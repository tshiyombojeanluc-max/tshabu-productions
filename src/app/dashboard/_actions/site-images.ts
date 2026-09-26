"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { SITE_IMAGE_SLOT_BY_KEY } from "@/lib/site-image-slots";

async function getAuthedClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/dashboard/login");
  return { supabase, userId: user.id };
}

// Every editable image can appear on the homepage, about page and/or the
// navbar logo (which is rendered from the root layout, shared by every
// route), so a change to any slot busts the whole site rather than trying
// to track which page(s) a given key affects.
function revalidatePublicPages() {
  revalidatePath("/", "layout");
}

export async function setSiteImage(
  key: string,
  image: { url: string; storagePath: string; width: number; height: number }
): Promise<{ error: string } | void> {
  if (!SITE_IMAGE_SLOT_BY_KEY[key]) return { error: "Unknown image slot." };

  const { supabase } = await getAuthedClient();

  const { error } = await supabase.from("site_images").upsert({
    key,
    url: image.url,
    storage_path: image.storagePath,
    width: image.width,
    height: image.height,
  });

  if (error) return { error: "Could not save that photo. Please try again." };

  revalidatePublicPages();
}

export async function resetSiteImage(key: string): Promise<{ error: string } | void> {
  const { supabase } = await getAuthedClient();

  const { error } = await supabase.from("site_images").delete().eq("key", key);
  if (error) return { error: "Could not reset that photo. Please try again." };

  revalidatePublicPages();
}
