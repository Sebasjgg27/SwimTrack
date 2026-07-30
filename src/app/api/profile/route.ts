import { NextRequest } from "next/server";
import { authenticatedSupabase, jsonError, jsonSuccess } from "@/lib/api-utils";

export async function GET() {
  const { supabase, user, error } = await authenticatedSupabase();
  if (error) return error;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  const { data: clubRole } = await supabase
    .from("user_roles")
    .select("club_id, role, clubs(id, name, country_id, city)")
    .eq("user_id", user!.id)
    .limit(1)
    .single();

  return jsonSuccess({ profile, clubRole });
}

export async function PUT(request: NextRequest) {
  const { supabase, user, error } = await authenticatedSupabase();
  if (error) return error;

  const body = await request.json();
  const { first_name, last_name, phone, city, club_name } = body;

  const updates: Record<string, unknown> = {};
  if (first_name !== undefined) updates.first_name = first_name;
  if (last_name !== undefined) updates.last_name = last_name;
  if (phone !== undefined) updates.phone = phone;

  if (Object.keys(updates).length > 0) {
    const { error: updateError } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user!.id);

    if (updateError) return jsonError(updateError.message);
  }

  if (club_name !== undefined) {
    const { data: clubRole } = await supabase
      .from("user_roles")
      .select("club_id")
      .eq("user_id", user!.id)
      .limit(1)
      .single();

    if (clubRole) {
      await supabase
        .from("clubs")
        .update({ name: club_name })
        .eq("id", clubRole.club_id);
    }
  }

  if (city !== undefined) {
    const { data: clubRole } = await supabase
      .from("user_roles")
      .select("club_id")
      .eq("user_id", user!.id)
      .limit(1)
      .single();

    if (clubRole) {
      await supabase
        .from("clubs")
        .update({ city })
        .eq("id", clubRole.club_id);
    }
  }

  return jsonSuccess({ success: true });
}
