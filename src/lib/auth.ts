import { createClient } from "./supabase";

export interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export async function signUp({ email, password, firstName, lastName }: SignUpData) {
  const supabase = createClient();
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { data, error: null };
}

export async function signIn({ email, password }: SignInData) {
  const supabase = createClient();
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  return { data, error: null };
}

export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser() {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return { user: null, error: error?.message ?? "No user" };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return { user, profile, error: profileError?.message ?? null };
}

export async function createProfile(userId: string, firstName: string, lastName: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from("profiles")
    .insert({
      id: userId,
      first_name: firstName,
      last_name: lastName,
    })
    .select()
    .single();

  return { data, error };
}

export async function updateProfile(userId: string, updates: Record<string, unknown>) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  return { data, error };
}

export async function createSwimmer(
  userId: string,
  firstName: string,
  lastName: string,
  clubId: string | null,
  gender: "male" | "female" | null,
  dateOfBirth: string | null,
  isMinor: boolean = false
) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from("swimmers")
    .insert({
      user_id: userId,
      club_id: clubId,
      first_name: firstName,
      last_name: lastName,
      gender,
      date_of_birth: dateOfBirth,
      is_minor: isMinor,
      parent_consent: !isMinor,
    })
    .select()
    .single();

  return { data, error };
}

export async function getOrCreateClub(clubName: string, countryId: string) {
  const supabase = createClient();
  
  if (!clubName.trim()) {
    return { club: null, error: null };
  }

  const { data: existingClubs } = await supabase
    .from("clubs")
    .select("*")
    .ilike("name", clubName)
    .limit(1);

  if (existingClubs && existingClubs.length > 0) {
    return { club: existingClubs[0], error: null };
  }

  const { data, error } = await supabase
    .from("clubs")
    .insert({
      name: clubName,
      country_id: countryId,
      is_public: true,
    })
    .select()
    .single();

  return { club: data, error };
}
