import { NextRequest } from "next/server";
import {
  authenticatedSupabase,
  jsonError,
  jsonSuccess,
  getClubId,
} from "@/lib/api-utils";
import { calculateCSS, calculateZones } from "@/lib/utils";

export async function POST(request: NextRequest) {
  const auth = await authenticatedSupabase();
  if (auth.error) return auth.error;
  const { supabase, user } = auth;

  const body = await request.json();
  const { swimmer_id, distance, pool_type, t400_ms, t200_ms } = body;

  if (!swimmer_id || !distance || !pool_type || !t400_ms || !t200_ms) {
    return jsonError(
      "swimmer_id, distance, pool_type, t400_ms, and t200_ms are required"
    );
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

  const css = calculateCSS(t400_ms, t200_ms);
  if (css <= 0) return jsonError("Invalid time trial data for CSS calculation");

  const zones = calculateZones(css);

  const { data: existing } = await supabase
    .from("pace_cards")
    .select("id")
    .eq("swimmer_id", swimmer_id)
    .eq("pool_type", pool_type)
    .maybeSingle();

  const paceCardPayload = {
    swimmer_id,
    css_sec_per_100: zones.css,
    a1_sec_per_100: zones.a1.min,
    a2_sec_per_100: zones.a2.min,
    a3_sec_per_100: zones.a3.min,
    vo2_sec_per_100: zones.vo2.min,
    tolerance_sec_per_100: zones.tolerance.min,
    all_out_sec_per_100: zones.allOut,
    pool_type,
    calculated_at: new Date().toISOString(),
  };

  let paceCard;

  if (existing) {
    const { data, error } = await supabase
      .from("pace_cards")
      .update(paceCardPayload)
      .eq("id", existing.id)
      .select()
      .single();

    if (error) return jsonError(error.message, 500);
    paceCard = data;
  } else {
    const { data, error } = await supabase
      .from("pace_cards")
      .insert(paceCardPayload)
      .select()
      .single();

    if (error) return jsonError(error.message, 500);
    paceCard = data;
  }

  return jsonSuccess({ pace_card: paceCard, zones });
}
