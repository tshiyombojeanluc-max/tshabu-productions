import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { supabaseUrl, supabaseAnonKey } from "@/lib/supabase/env";

/**
 * A cookie-free Supabase client for public, unauthenticated reads only
 * (published galleries, site image overrides). The regular server client
 * (lib/supabase/server) calls next/headers' `cookies()` to read the visitor's
 * session — and merely calling `cookies()` opts the whole route into fully
 * dynamic, uncached rendering, even for a page that never needs a session.
 * That was forcing every public page to `cache-control: private, no-cache`
 * and a ~700ms+ TTFB on every request, which hurts Core Web Vitals (and
 * therefore SEO). Public pages have no user to authenticate anyway, so they
 * fetch through this client instead and can be statically rendered / ISR'd
 * (see the `revalidate` export on those pages) with on-demand
 * `revalidatePath` busting the cache when a client edits content.
 *
 * RLS — not this client's key — is still what restricts what can be read or
 * written; this is exactly as privileged as the anon key already is.
 */
export function createPublicClient() {
  return createSupabaseClient<Database>(supabaseUrl(), supabaseAnonKey(), {
    auth: { persistSession: false },
  });
}
