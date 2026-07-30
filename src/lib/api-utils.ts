import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "./supabase-server";

export async function authenticatedSupabase() {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return { supabase, user: null, error: jsonError("Unauthorized", 401) };
  }

  return { supabase, user, error: null };
}

export function jsonError(message: string, status: number = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function jsonSuccess<T>(data: T, status: number = 200) {
  return NextResponse.json(data, { status });
}

export async function getClubId(supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>, userId: string): Promise<string | null> {
  const { data } = await supabase
    .from("user_roles")
    .select("club_id")
    .eq("user_id", userId)
    .limit(1)
    .single();
  return data?.club_id ?? null;
}
