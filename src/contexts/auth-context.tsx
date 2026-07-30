"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { createClient } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  date_of_birth: string | null;
  country_id: string | null;
}

interface ClubRole {
  club_id: string;
  role: string;
  clubs: {
    id: string;
    name: string;
    country_id: string | null;
    city: string | null;
  };
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  clubRole: ClubRole | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  clubRole: null,
  loading: true,
  refresh: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [clubRole, setClubRole] = useState<ClubRole | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  async function loadAuth() {
    setLoading(true);
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    setUser(currentUser);

    if (currentUser) {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id)
        .single();
      setProfile(profileData);

      const { data: clubData } = await supabase
        .from("user_roles")
        .select("club_id, role, clubs(id, name, country_id, city)")
        .eq("user_id", currentUser.id)
        .limit(1)
        .single();
      setClubRole(clubData as ClubRole | null);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      loadAuth();
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, clubRole, loading, refresh: loadAuth }}>
      {children}
    </AuthContext.Provider>
  );
}
