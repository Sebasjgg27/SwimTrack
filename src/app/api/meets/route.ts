import { NextRequest } from "next/server";
import {
  authenticatedSupabase,
  getClubId,
  jsonError,
  jsonSuccess,
} from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  const { supabase, user, error } = await authenticatedSupabase();
  if (error) return error;

  const clubId = await getClubId(supabase, user!.id);
  if (!clubId) return jsonError("No club associated with this user", 403);

  const { searchParams } = new URL(request.url);
  const filter = searchParams.get("filter"); // "upcoming" | "past" | null

  let query = supabase
    .from("meets")
    .select("*")
    .eq("club_id", clubId)
    .order("meet_date", { ascending: true });

  const today = new Date().toISOString().slice(0, 10);

  if (filter === "upcoming") {
    query = query.gte("meet_date", today);
  } else if (filter === "past") {
    query = query.lt("meet_date", today);
  }

  const { data, error: dbError } = await query;

  if (dbError) return jsonError(dbError.message, 500);

  return jsonSuccess(data);
}

export async function POST(request: NextRequest) {
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

  if (!roleRow || !["club_admin", "coach"].includes(roleRow.role)) {
    return jsonError("Only coaches and admins can create meets", 403);
  }

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
  } = body;

  if (!name || !meet_date || !pool_type) {
    return jsonError("name, meet_date, and pool_type are required", 400);
  }

  const { data, error: dbError } = await supabase
    .from("meets")
    .insert({
      name,
      club_id: clubId,
      country_id: country_id ?? null,
      region_id: region_id ?? null,
      city: city ?? null,
      venue: venue ?? null,
      meet_date,
      pool_type,
      level: level ?? null,
      federation: federation ?? null,
      results_verified: false,
    })
    .select()
    .single();

  if (dbError) return jsonError(dbError.message, 500);

  return jsonSuccess(data, 201);
}
