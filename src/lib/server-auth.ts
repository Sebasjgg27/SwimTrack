import { createSupabaseServerClient } from "./supabase-server";
import { redirect } from "next/navigation";

export async function requireAuth() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return user;
}

export async function getUserProfile(userId: string) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  return data;
}

export async function getUserClubRole(userId: string, clubId: string) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("club_id", clubId)
    .single();
  return data?.role as string | undefined;
}

export async function getUserPrimaryClub(userId: string) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("user_roles")
    .select("club_id, clubs(*)")
    .eq("user_id", userId)
    .limit(1)
    .single();
  return data;
}
