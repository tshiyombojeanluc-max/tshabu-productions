"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/supabase/types";
import { supabaseUrl, supabaseAnonKey } from "@/lib/supabase/env";

// Safe to use only the anon key here — RLS is what actually restricts what
// this client can read or write, not the key itself.
export function createClient() {
  return createBrowserClient<Database>(supabaseUrl(), supabaseAnonKey());
}
