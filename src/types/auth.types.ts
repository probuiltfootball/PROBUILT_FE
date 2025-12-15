import { User, Session } from '@supabase/supabase-js';

export type UserRole = 'player' | 'coach' | 'admin';
export type UserStatus = 'pending' | 'verified' | 'suspended' | 'inactive';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  status: UserStatus;
  avatar_url?: string;
  phone_number?: string;
  date_of_birth?: string;
  country?: string;
  city?: string;
  bio?: string;
  user_type?: string;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
  // Subscription plan details (from Edge Function)
  subscription?: {
    plan: 'trial' | 'hub' | 'edge' | null;
    tier: number | null;
    start_date: string | null;
    end_date: string | null;
    is_expired: boolean;
    plan_expired: boolean;
    days_left: number | null;
  };
  // Role-specific profiles (from Edge Function)
  player_profile?: PlayerProfile;
  coach_profile?: CoachProfile;
}

export interface PlayerProfile {
  id: string;
  user_id: string;
  position?: string;
  preferred_foot?: string;
  height_cm?: number;
  weight_kg?: number;
  current_club?: string;
  previous_clubs?: string[];
  achievements?: string[];
  stats?: Record<string, any>;
  skill_level?: string;
  total_pro_points: number;
  created_at: string;
  updated_at: string;
  user?: UserProfile;
}

export interface CoachProfile {
  id: string;
  user_id: string;
  specializations?: string[];
  certifications?: string[];
  years_experience?: number;
  bio_extended?: string;
  hourly_rate?: number;
  rating: number;
  total_sessions: number;
  created_at: string;
  updated_at: string;
  user?: UserProfile;
}

export interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  playerProfile: PlayerProfile | null;
  coachProfile: CoachProfile | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface SignUpData {
  email: string;
  password: string;
  full_name: string;
  role: UserRole;
  phone_number?: string;
  date_of_birth?: string;
  country?: string;
  city?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface ProfileUpdateData {
  full_name?: string;
  phone_number?: string;
  date_of_birth?: string;
  country?: string;
  city?: string;
  bio?: string;
  avatar_url?: string;
}

export interface PlayerProfileUpdateData {
  position?: string;
  preferred_foot?: string;
  height_cm?: number;
  weight_kg?: number;
  current_club?: string;
  previous_clubs?: string[];
  achievements?: string[];
  skill_level?: string;
}

export interface CoachProfileUpdateData {
  specializations?: string[];
  certifications?: string[];
  years_experience?: number;
  bio_extended?: string;
  hourly_rate?: number;
}

