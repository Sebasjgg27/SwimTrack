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
  const meetId = searchParams.get("meet_id");
  const swimmerId = searchParams.get("swimmer_id");
  const eventId = searchParams.get("event_id");

  let query = supabase
    .from("results")
    .select("*, swimmer:swimmers(*), meet:meets(*), event:events(*)");

  if (meetId) {
    query = query.eq("meet_id", meetId);
  }
  if (swimmerId) {
    query = query.eq("swimmer_id", swimmerId);
  }
  if (eventId) {
    query = query.eq("event_id", eventId);
  }

  // If no filters provided, scope to club's swimmers so we don't leak data
  if (!meetId && !swimmerId && !eventId) {
    const { data: clubSwimmers } = await supabase
      .from("swimmers")
      .select("id")
      .eq("club_id", clubId);

    const swimmerIds = clubSwimmers?.map((s) => s.id) ?? [];
    if (swimmerIds.length === 0) return jsonSuccess([]);

    query = query.in("swimmer_id", swimmerIds);
  }

  const { data, error: dbError } = await query.order("created_at", {
    ascending: false,
  });

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
    return jsonError("Only coaches and admins can create results", 403);
  }

  const body = await request.json();
  const {
    swimmer_id,
    meet_id,
    event_id,
    entry_time_ms,
    official_time_ms,
    is_dq,
    dq_reason,
    is_relay,
    relay_position,
    split_times,
  } = body;

  if (!swimmer_id || !meet_id || !event_id) {
    return jsonError("swimmer_id, meet_id, and event_id are required", 400);
  }

  // Verify swimmer belongs to this club
  const { data: swimmer } = await supabase
    .from("swimmers")
    .select("id")
    .eq("id", swimmer_id)
    .eq("club_id", clubId)
    .single();

  if (!swimmer) {
    return jsonError("Swimmer not found in this club", 404);
  }

  // Auto-check PB: find the fastest previous official_time_ms for same swimmer+event
  let isPb = false;
  if (official_time_ms != null && !is_dq) {
    const { data: previousResults } = await supabase
      .from("results")
      .select("official_time_ms")
      .eq("swimmer_id", swimmer_id)
      .eq("event_id", event_id)
      .eq("is_dq", false)
      .not("official_time_ms", "is", null)
      .order("official_time_ms", { ascending: true })
      .limit(1);

    const bestTime =
      previousResults && previousResults.length > 0
        ? previousResults[0].official_time_ms
        : null;

    isPb = bestTime === null || official_time_ms < bestTime;
  }

  const { data, error: dbError } = await supabase
    .from("results")
    .insert({
      swimmer_id,
      meet_id,
      event_id,
      entry_time_ms: entry_time_ms ?? null,
      official_time_ms: official_time_ms ?? null,
      is_pb: isPb,
      is_dq: is_dq ?? false,
      dq_reason: dq_reason ?? null,
      is_relay: is_relay ?? false,
      relay_position: relay_position ?? null,
      split_times: split_times ?? null,
    })
    .select("*, swimmer:swimmers(*), meet:meets(*), event:events(*)")
    .single();

  if (dbError) return jsonError(dbError.message, 500);

  return jsonSuccess(data, 201);
}
