// Hand-written to match supabase/migrations/20260827000000_dashboard_schema.sql.
// Regenerate with `supabase gen types typescript` once the CLI is linked to
// the project if the schema drifts from this file.
//
// Every table carries Row/Insert/Update/Relationships, and the schema
// carries Views/Functions/Enums/CompositeTypes (all empty here) because
// @supabase/supabase-js's generic constraints require that full shape —
// omitting any of it silently collapses inferred query types to `never`.

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          role: "admin" | "client";
          display_name: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role?: "admin" | "client";
          display_name?: string | null;
          avatar_url?: string | null;
        };
        Update: {
          display_name?: string | null;
          avatar_url?: string | null;
        };
        Relationships: [];
      };
      galleries: {
        Row: {
          id: string;
          owner_id: string;
          title: string;
          slug: string;
          description: string | null;
          category: string | null;
          client_name: string | null;
          project_year: string | null;
          cover_image: string | null;
          cover_width: number | null;
          cover_height: number | null;
          published: boolean;
          featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          owner_id: string;
          title: string;
          slug: string;
          description?: string | null;
          category?: string | null;
          client_name?: string | null;
          project_year?: string | null;
          cover_image?: string | null;
          cover_width?: number | null;
          cover_height?: number | null;
          published?: boolean;
          featured?: boolean;
        };
        Update: {
          title?: string;
          slug?: string;
          description?: string | null;
          category?: string | null;
          client_name?: string | null;
          project_year?: string | null;
          cover_image?: string | null;
          cover_width?: number | null;
          cover_height?: number | null;
          published?: boolean;
          featured?: boolean;
        };
        Relationships: [];
      };
      photos: {
        Row: {
          id: string;
          gallery_id: string;
          storage_path: string;
          image_url: string;
          width: number;
          height: number;
          title: string | null;
          description: string | null;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          gallery_id: string;
          storage_path: string;
          image_url: string;
          width: number;
          height: number;
          title?: string | null;
          description?: string | null;
          display_order?: number;
        };
        Update: {
          gallery_id?: string;
          title?: string | null;
          description?: string | null;
          display_order?: number;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Gallery = Database["public"]["Tables"]["galleries"]["Row"];
export type Photo = Database["public"]["Tables"]["photos"]["Row"];
