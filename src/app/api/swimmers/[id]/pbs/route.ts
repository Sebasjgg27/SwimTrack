import { NextRequest } from "next/server";
import { authenticatedSupabase, jsonError, jsonSuccess } from "@/lib/api-utils";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { supabase, user, error } = await authenticatedSupabase();
  if (error) return error;

  const { data: pbRows, error: pbError } = await supabase
    .from("personal_bests")
    .select("event_id, official_time_ms, meet_date, meet_name")
    .eq("swimmer_id", params.id);

  if (pbError) return jsonError(pbError.message, 500);

  if (!pbRows || pbRows.length === 0) {
    return jsonSuccess([]);
  }

  const eventIds = Array.from(new Set(pbRows.map((r) => r.event_id)));

  const { data: events, error: eventError } = await supabase
    .from("events")
    .select("id, distance, stroke, pool_type")
    .in("id", eventIds);

  if (eventError) return jsonError(eventError.message, 500);

  const eventMap = new Map(events?.map((e) => [e.id, e]) ?? []);

  const results = pbRows.map((pb) => {
    const event = eventMap.get(pb.event_id);
    return {
      event_id: pb.event_id,
      distance: event?.distance ?? null,
      stroke: event?.stroke ?? null,
      pool_type: event?.pool_type ?? null,
      time_ms: pb.official_time_ms,
      meet_name: pb.meet_name,
      date: pb.meet_date,
    };
  });

  return jsonSuccess(results);
}
