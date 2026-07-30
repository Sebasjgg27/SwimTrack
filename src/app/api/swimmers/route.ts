import { NextRequest } from "next/server";
import { authenticatedSupabase, jsonError, jsonSuccess, getClubId } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  const { supabase, user, error } = await authenticatedSupabase();
  if (error) return error;

  const clubId = await getClubId(supabase, user!.id);
  if (!clubId) return jsonError("No club associated with this user", 403);

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const gender = searchParams.get("gender");

  let query = supabase
    .from("swimmers")
    .select("*")
    .eq("club_id", clubId)
    .order("last_name", { ascending: true })
    .order("first_name", { ascending: true });

  if (search) {
    query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%`);
  }

  if (gender && ["male", "female"].includes(gender)) {
    query = query.eq("gender", gender);
  }

  const { data, error: queryError } = await query;

  if (queryError) return jsonError(queryError.message, 500);

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
    .limit(1)
    .single();

  if (!roleRow || !["club_admin", "coach"].includes(roleRow.role)) {
    return jsonError("Only coaches and admins can create swimmers", 403);
  }

  const body = await request.json();
  const { first_name, last_name, gender, date_of_birth, user_id, profile_visibility, is_minor, parent_consent } = body;

  if (!first_name || !last_name) {
    return jsonError("first_name and last_name are required");
  }

  const { data, error: insertError } = await supabase
    .from("swimmers")
    .insert({
      club_id: clubId,
      first_name,
      last_name,
      gender: gender ?? null,
      date_of_birth: date_of_birth ?? null,
      user_id: user_id ?? null,
      profile_visibility: profile_visibility ?? "club_private",
      is_minor: is_minor ?? false,
      parent_consent: parent_consent ?? false,
    })
    .select()
    .single();

  if (insertError) return jsonError(insertError.message, 500);

  return jsonSuccess(data, 201);
}
