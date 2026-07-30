import { NextRequest } from "next/server";
import {
  authenticatedSupabase,
  getClubId,
  jsonError,
  jsonSuccess,
} from "@/lib/api-utils";

interface RouteContext {
  params: Promise<{ id: string }>;
}

async function authorizeCoachOrAdmin(
  supabase: Awaited<ReturnType<typeof import("@/lib/supabase-server").createSupabaseServerClient>>,
  userId: string,
  clubId: string,
) {
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("club_id", clubId)
    .single();

  return data?.role === "club_admin" || data?.role === "coach" ? data.role : null;
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  const { supabase, user, error } = await authenticatedSupabase();
  if (error) return error;

  const clubId = await getClubId(supabase, user!.id);
  if (!clubId) return jsonError("No club associated with this user", 403);

  const { id } = await params;

  const { data, error: dbError } = await supabase
    .from("meets")
    .select("*, events(count)")
    .eq("id", id)
    .eq("club_id", clubId)
    .single();

  if (dbError || !data) return jsonError("Meet not found", 404);

  return jsonSuccess(data);
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  const { supabase, user, error } = await authenticatedSupabase();
  if (error) return error;

  const clubId = await getClubId(supabase, user!.id);
  if (!clubId) return jsonError("No club associated with this user", 403);

  const role = await authorizeCoachOrAdmin(supabase, user!.id, clubId);
  if (!role) return jsonError("Only coaches and admins can update meets", 403);

  const { id } = await params;

  const { data: existing } = await supabase
    .from("meets")
    .select("id")
    .eq("id", id)
    .eq("club_id", clubId)
    .single();

  if (!existing) return jsonError("Meet not found", 404);

  const body = await request.json();
  const {
    name,
    country_id,
    region_id,
    city,
    venue,
    meet_date,
    pool_type,
    level,
    federation,
    results_verified,
  } = body;

  const updates: Record<string, unknown> = {};
  if (name !== undefined) updates.name = name;
  if (country_id !== undefined) updates.country_id = country_id;
  if (region_id !== undefined) updates.region_id = region_id;
  if (city !== undefined) updates.city = city;
  if (venue !== undefined) updates.venue = venue;
  if (meet_date !== undefined) updates.meet_date = meet_date;
  if (pool_type !== undefined) updates.pool_type = pool_type;
  if (level !== undefined) updates.level = level;
  if (federation !== undefined) updates.federation = federation;
  if (results_verified !== undefined) updates.results_verified = results_verified;

  if (Object.keys(updates).length === 0) {
    return jsonError("No fields to update", 400);
  }

  updates.updated_at = new Date().toISOString();

  const { data, error: dbError } = await supabase
    .from("meets")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (dbError) return jsonError(dbError.message, 500);

  return jsonSuccess(data);
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const { supabase, user, error } = await authenticatedSupabase();
  if (error) return error;

  const clubId = await getClubId(supabase, user!.id);
  if (!clubId) return jsonError("No club associated with this user", 403);

  const { data: roleRow } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user!.id)
    .eq("club_id", clubId)
    .single();

  if (!roleRow || roleRow.role !== "club_admin") {
    return jsonError("Only admins can delete meets", 403);
  }

  const { id } = await params;

  const { data: existing } = await supabase
    .from("meets")
    .select("id")
    .eq("id", id)
    .eq("club_id", clubId)
    .single();

  if (!existing) return jsonError("Meet not found", 404);

  const { error: dbError } = await supabase
    .from("meets")
    .delete()
    .eq("id", id);

  if (dbError) return jsonError(dbError.message, 500);

  return jsonSuccess({ message: "Meet deleted" });
}
