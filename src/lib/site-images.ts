import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";

/**
 * Every site image override the client has uploaded, keyed by slot (see
 * site-image-slots.ts). Missing keys mean "use that slot's default asset".
 * Cached per-request so every page/component that needs an override only
 * triggers one query.
 */
export const getSiteImageOverrides = cache(async (): Promise<Record<string, string>> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from("site_images").select("key, url");

  if (error || !data) return {};

  return Object.fromEntries(data.map((row) => [row.key, row.url]));
});
