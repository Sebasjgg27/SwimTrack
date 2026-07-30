import { NextRequest } from "next/server";
import { authenticatedSupabase, jsonError, jsonSuccess, getClubId } from "@/lib/api-utils";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { supabase, user, error } = await authenticatedSupabase();
  if (error) return error;

  const { data, error: queryError } = await supabase
    .from("swimmers")
    .select("*, club:clubs(*)")
    .eq("id", params.id)
    .single();

  if (queryError || !data) return jsonError("Swimmer not found", 404);

  return jsonSuccess(data);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { supabase, user, error } = await authenticatedSupabase();
  if (error) return error;

  const clubId = await getClubId(supabase, user!.id);
  if (!clubId) return jsonError("No club associated with this user", 403);

  const { data: roleRow } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user!.id)
    .eq("club_id", clubId)
    .limit(1)
    .single();

  if (!roleRow || !["club_admin", "coach"].includes(roleRow.role)) {
    return jsonError("Only coaches and admins can update swimmers", 403);
  }

  const { data: existing } = await supabase
    .from("swimmers")
    .select("club_id")
    .eq("id", params.id)
    .single();

  if (!existing || existing.club_id !== clubId) {
    return jsonError("Swimmer not found in your club", 404);
  }

  const body = await request.json();
  const { first_name, last_name, gender, date_of_birth, user_id, profile_visibility, is_minor, parent_consent } = body;

  const updates: Record<string, unknown> = {};
  if (first_name !== undefined) updates.first_name = first_name;
  if (last_name !== undefined) updates.last_name = last_name;
  if (gender !== undefined) updates.gender = gender;
  if (date_of_birth !== undefined) updates.date_of_birth = date_of_birth;
  if (user_id !== undefined) updates.user_id = user_id;
  if (profile_visibility !== undefined) updates.profile_visibility = profile_visibility;
  if (is_minor !== undefined) updates.is_minor = is_minor;
  if (parent_consent !== undefined) updates.parent_consent = parent_consent;

  if (Object.keys(updates).length === 0) {
    return jsonError("No fields to update");
  }

  const { data, error: updateError } = await supabase
    .from("swimmers")
    .update(updates)
    .eq("id", params.id)
    .select()
    .single();

  if (updateError) return jsonError(updateError.message, 500);

  return jsonSuccess(data);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { supabase, user, error } = await authenticatedSupabase();
  if (error) return error;

  const clubId = await getClubId(supabase, user!.id);
  if (!clubId) return jsonError("No club associated with this user", 403);

  const { data: roleRow } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user!.id)
    .eq("club_id", clubId)
    .limit(1)
    .single();

  if (!roleRow || roleRow.role !== "club_admin") {
    return jsonError("Only club admins can delete swimmers", 403);
  }

  const { data: existing } = await supabase
    .from("swimmers")
    .select("club_id")
    .eq("id", params.id)
    .single();

  if (!existing || existing.club_id !== clubId) {
    return jsonError("Swimmer not found in your club", 404);
  }

  const { error: deleteError } = await supabase
    .from("swimmers")
    .delete()
    .eq("id", params.id);

  if (deleteError) return jsonError(deleteError.message, 500);

  return jsonSuccess({ message: "Swimmer deleted" });
}
