export interface Country {
  id: string;
  name: string;
  code: string;
  created_at: string;
}

export interface Region {
  id: string;
  country_id: string;
  name: string;
  code: string | null;
  created_at: string;
}

export interface Club {
  id: string;
  name: string;
  country_id: string;
  region_id: string | null;
  city: string | null;
  address: string | null;
  logo_url: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  date_of_birth: string | null;
  country_id: string | null;
  created_at: string;
  updated_at: string;
}

export type UserRole = "club_admin" | "coach" | "swimmer" | "parent" | "spectator";

export interface UserRoleRow {
  id: string;
  user_id: string;
  club_id: string;
  role: UserRole;
  created_at: string;
}

export interface Swimmer {
  id: string;
  user_id: string | null;
  club_id: string;
  first_name: string;
  last_name: string;
  gender: "male" | "female" | null;
  date_of_birth: string | null;
  profile_visibility: "club_private" | "club_public" | "country" | "international";
  is_minor: boolean;
  parent_consent: boolean;
  created_at: string;
  updated_at: string;
  club?: Club;
}

export interface Meet {
  id: string;
  name: string;
  club_id: string | null;
  country_id: string | null;
  region_id: string | null;
  city: string | null;
  venue: string | null;
  meet_date: string;
  pool_type: "SCM" | "SCY" | "LCM";
  level: "club" | "local" | "regional" | "national" | "international" | null;
  federation: string | null;
  results_verified: boolean;
  created_at: string;
  updated_at: string;
}

export type Stroke = 
  | "freestyle" 
  | "backstroke" 
  | "breaststroke" 
  | "butterfly" 
  | "individual_medley" 
  | "relay";

export type PoolType = "SCM" | "SCY" | "LCM";

export interface SwimEvent {
  id: string;
  distance: number;
  stroke: Stroke;
  pool_type: PoolType;
  gender: "male" | "female" | "mixed" | null;
  age_group_min: number | null;
  age_group_max: number | null;
  created_at: string;
}

export interface Result {
  id: string;
  swimmer_id: string;
  meet_id: string;
  event_id: string;
  entry_time_ms: number | null;
  official_time_ms: number | null;
  is_pb: boolean;
  is_dq: boolean;
  dq_reason: string | null;
  is_relay: boolean;
  relay_position: number | null;
  split_times: Record<string, number> | null;
  created_at: string;
  swimmer?: Swimmer;
  meet?: Meet;
  event?: SwimEvent;
}

export interface TimeTrial {
  id: string;
  swimmer_id: string;
  distance: number;
  time_ms: number;
  trial_date: string;
  pool_type: PoolType;
  notes: string | null;
  created_at: string;
}

export interface PaceCard {
  id: string;
  swimmer_id: string;
  css_sec_per_100: number;
  a1_sec_per_100: number;
  a2_sec_per_100: number;
  a3_sec_per_100: number;
  vo2_sec_per_100: number;
  tolerance_sec_per_100: number;
  all_out_sec_per_100: number;
  pool_type: PoolType;
  calculated_from_trial_id: string | null;
  calculated_at: string;
}

export interface ImportTemplate {
  id: string;
  club_id: string;
  name: string;
  format: string;
  column_mapping: Record<string, string>;
  created_at: string;
}

export interface LeaderboardEntry {
  rank: number;
  swimmer_id: string;
  swimmer_name: string;
  age: number;
  club_id: string;
  club_name: string;
  region_name: string | null;
  country_name: string;
  time_ms: number;
  date: string;
  meet_name: string;
  pool_type: PoolType;
}

export interface PersonalBest {
  event_id: string;
  distance: number;
  stroke: Stroke;
  pool_type: PoolType;
  time_ms: number;
  meet_name: string;
  date: string;
}

export interface TimeProgression {
  date: string;
  time_ms: number;
  meet_name: string;
}

export interface User {
  id: string;
  email: string;
  role?: UserRole;
}