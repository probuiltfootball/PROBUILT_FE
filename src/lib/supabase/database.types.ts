// This file will be auto-generated from Supabase schema
// For now, we'll create a basic type structure
// Run: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/supabase/database.types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: 'player' | 'coach' | 'admin';
          status: 'pending' | 'verified' | 'suspended' | 'inactive';
          avatar_url: string | null;
          phone_number: string | null;
          date_of_birth: string | null;
          country: string | null;
          city: string | null;
          bio: string | null;
          created_at: string;
          updated_at: string;
          last_login_at: string | null;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          role: 'player' | 'coach' | 'admin';
          status?: 'pending' | 'verified' | 'suspended' | 'inactive';
          avatar_url?: string | null;
          phone_number?: string | null;
          date_of_birth?: string | null;
          country?: string | null;
          city?: string | null;
          bio?: string | null;
        };
        Update: Partial<Omit<Database['public']['Tables']['users']['Insert'], 'id'>>;
      };
      player_profiles: {
        Row: {
          id: string;
          user_id: string;
          position: string | null;
          preferred_foot: string | null;
          height_cm: number | null;
          weight_kg: number | null;
          current_club: string | null;
          previous_clubs: string[] | null;
          achievements: string[] | null;
          stats: Json | null;
          skill_level: string | null;
          total_pro_points: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          position?: string | null;
          preferred_foot?: string | null;
          height_cm?: number | null;
          weight_kg?: number | null;
          current_club?: string | null;
          previous_clubs?: string[] | null;
          achievements?: string[] | null;
          stats?: Json | null;
          skill_level?: string | null;
          total_pro_points?: number;
        };
        Update: Partial<Omit<Database['public']['Tables']['player_profiles']['Insert'], 'user_id'>>;
      };
      coach_profiles: {
        Row: {
          id: string;
          user_id: string;
          specializations: string[] | null;
          certifications: string[] | null;
          years_experience: number | null;
          bio_extended: string | null;
          hourly_rate: number | null;
          rating: number;
          total_sessions: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          specializations?: string[] | null;
          certifications?: string[] | null;
          years_experience?: number | null;
          bio_extended?: string | null;
          hourly_rate?: number | null;
          rating?: number;
          total_sessions?: number;
        };
        Update: Partial<Omit<Database['public']['Tables']['coach_profiles']['Insert'], 'user_id'>>;
      };
    };
    Views: {};
    Functions: {};
    Enums: {
      user_role: 'player' | 'coach' | 'admin';
      user_status: 'pending' | 'verified' | 'suspended' | 'inactive';
    };
  };
}

