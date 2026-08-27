import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/supabase/types";
import { supabaseUrl, supabaseAnonKey } from "@/lib/supabase/env";

/**
 * Server-side Supabase client for Server Components, Server Actions and
 * Route Handlers. Reads the session from cookies; every query still goes
 * through RLS using the signed-in user's own JWT — this client is never
 * given elevated privileges.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(supabaseUrl(), supabaseAnonKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component render, where cookies can't be
          // written. Harmless as long as proxy.ts is refreshing the
          // session on every request (see src/proxy.ts).
        }
      },
    },
  });
}
