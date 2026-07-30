import { NextRequest } from "next/server";
import {
  authenticatedSupabase,
  jsonError,
  jsonSuccess,
  getClubId,
} from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  const auth = await authenticatedSupabase();
  if (auth.error) return auth.error;
  const { supabase, user } = auth;

  let swimmer_id = request.nextUrl.searchParams.get("swimmer_id");
  if (!swimmer_id) return jsonError("swimmer_id is required");

  if (swimmer_id === "me") {
    const { data: mySwimmer } = await supabase
      .from("swimmers")
      .select("id")
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle();
    if (!mySwimmer) return jsonError("No swimmer profile found for your user", 404);
    swimmer_id = mySwimmer.id;
  }

  const { data: swimmer, error: swimmerErr } = await supabase
    .from("swimmers")
    .select("id, club_id, user_id")
    .eq("id", swimmer_id)
    .single();

  if (swimmerErr || !swimmer) return jsonError("Swimmer not found", 404);

  if (swimmer.user_id !== user.id) {
    const clubId = await getClubId(supabase, user.id);
    if (!clubId) return jsonError("Forbidden", 403);

    const { data: role } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("club_id", clubId)
      .in("role", ["coach", "club_admin"])
      .maybeSingle();

    if (!role || swimmer.club_id !== clubId)
      return jsonError("Forbidden", 403);
  }

  const { data, error } = await supabase
    .from("time_trials")
    .select("*")
    .eq("swimmer_id", swimmer_id)
    .order("trial_date", { ascending: false });

  if (error) return jsonError(error.message, 500);
  return jsonSuccess(data);
}

export async function POST(request: NextRequest) {
  const auth = await authenticatedSupabase();
  if (auth.error) return auth.error;
  const { supabase, user } = auth;

  const body = await request.json();
  let { swimmer_id, distance, time_ms, trial_date, pool_type, notes } = body;

  if (!swimmer_id || !distance || !time_ms || !trial_date || !pool_type) {
    return jsonError(
      "swimmer_id, distance, time_ms, trial_date, and pool_type are required"
    );
  }

  if (swimmer_id === "me") {
    const { data: mySwimmer } = await supabase
      .from("swimmers")
      .select("id")
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle();
    if (!mySwimmer) return jsonError("No swimmer profile found for your user", 404);
    swimmer_id = mySwimmer.id;
  }

  const { data: swimmer, error: swimmerErr } = await supabase
    .from("swimmers")
    .select("id, club_id, user_id")
    .eq("id", swimmer_id)
    .single();

  if (swimmerErr || !swimmer) return jsonError("Swimmer not found", 404);

  if (swimmer.user_id !== user.id) {
    const clubId = await getClubId(supabase, user.id);
    if (!clubId) return jsonError("Forbidden", 403);

    const { data: role } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("club_id", clubId)
      .in("role", ["coach", "club_admin"])
      .maybeSingle();

    if (!role || swimmer.club_id !== clubId)
      return jsonError("Forbidden", 403);
  }

  const { data, error } = await supabase
    .from("time_trials")
    .insert({
      swimmer_id,
      distance,
      time_ms,
      trial_date,
      pool_type,
      notes: notes ?? null,
    })
    .select()
    .single();

  if (error) return jsonError(error.message, 500);
  return jsonSuccess(data, 201);
}
