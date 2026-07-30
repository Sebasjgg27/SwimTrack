import { NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { jsonError, jsonSuccess } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  const supabase = await createSupabaseServerClient();

  const searchParams = request.nextUrl.searchParams;
  const event = searchParams.get("event");
  const pool_type = searchParams.get("pool_type");
  const gender = searchParams.get("gender");
  const distance = searchParams.get("distance");
  const limit = parseInt(searchParams.get("limit") ?? "50", 10);
  const offset = parseInt(searchParams.get("offset") ?? "0", 10);

  let query = supabase
    .from("public_leaderboard")
    .select("*", { count: "exact" });

  if (event) query = query.eq("event", event);
  if (pool_type) query = query.eq("pool_type", pool_type);
  if (gender) query = query.eq("gender", gender);
  if (distance) query = query.eq("distance", parseInt(distance, 10));

  query = query
    .order("time_ms", { ascending: true })
    .range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) return jsonError(error.message, 500);

  return jsonSuccess({ data: data ?? [], count: count ?? 0, limit, offset });
}
