"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/app/dashboard/_lib/slug";
import type { Database } from "@/lib/supabase/types";

export type FormState = { error: string } | null;

async function getAuthedClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/dashboard/login");
  return { supabase, userId: user.id };
}

async function uniqueSlug(supabase: SupabaseClient<Database>, base: string, excludeId?: string): Promise<string> {
  let candidate = base;
  for (let suffix = 2; suffix < 100; suffix += 1) {
    let query = supabase.from("galleries").select("id").eq("slug", candidate);
    if (excludeId) query = query.neq("id", excludeId);
    const { data } = await query.maybeSingle();
    if (!data) return candidate;
    candidate = `${base}-${suffix}`;
  }
  // Practically unreachable for a small studio's catalog, but keeps the
  // function total instead of looping forever.
  return `${base}-${Date.now()}`;
}

function readGalleryFields(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const category = String(formData.get("category") ?? "").trim() || null;
  const clientName = String(formData.get("client_name") ?? "").trim() || null;
  const projectYear = String(formData.get("project_year") ?? "").trim() || null;
  return { title, description, category, clientName, projectYear };
}

export async function createGallery(_prevState: FormState, formData: FormData): Promise<FormState> {
  const { supabase, userId } = await getAuthedClient();
  const { title, description, category, clientName, projectYear } = readGalleryFields(formData);

  if (!title) return { error: "Title is required." };

  const slug = await uniqueSlug(supabase, slugify(title));

  const { data, error } = await supabase
    .from("galleries")
    .insert({
      owner_id: userId,
      title,
      slug,
      description,
      category,
      client_name: clientName,
      project_year: projectYear,
    })
    .select("id")
    .single();

  if (error || !data) return { error: "Could not create the gallery. Please try again." };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/galleries");
  redirect(`/dashboard/galleries/${data.id}`);
}

export async function updateGallery(id: string, _prevState: FormState, formData: FormData): Promise<FormState> {
  const { supabase } = await getAuthedClient();
  const { title, description, category, clientName, projectYear } = readGalleryFields(formData);

  if (!title) return { error: "Title is required." };

  const published = formData.get("published") === "on";
  const featured = formData.get("featured") === "on";
  const requestedSlugInput = String(formData.get("slug") ?? "").trim();
  const slug = await uniqueSlug(supabase, slugify(requestedSlugInput || title), id);

  const { data, error } = await supabase
    .from("galleries")
    .update({
      title,
      slug,
      description,
      category,
      client_name: clientName,
      project_year: projectYear,
      published,
      featured,
    })
    .eq("id", id)
    .select("id");

  if (error) return { error: "Could not save changes. Please try again." };
  if (!data || data.length === 0) return { error: "Gallery not found." };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/galleries");
  revalidatePath(`/dashboard/galleries/${id}`);
  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath(`/work/${slug}`);
  return null;
}

export async function deleteGallery(id: string): Promise<{ error: string } | void> {
  const { supabase } = await getAuthedClient();

  const { data: photos } = await supabase.from("photos").select("storage_path").eq("gallery_id", id);

  const { data, error } = await supabase.from("galleries").delete().eq("id", id).select("id");
  if (error || !data || data.length === 0) {
    return { error: "Could not delete the gallery. Please try again." };
  }

  if (photos && photos.length > 0) {
    await supabase.storage.from("gallery-photos").remove(photos.map((p) => p.storage_path));
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/galleries");
  revalidatePath("/");
  revalidatePath("/work");
  redirect("/dashboard/galleries");
}

export async function togglePublished(id: string, published: boolean): Promise<{ error: string } | void> {
  const { supabase } = await getAuthedClient();

  const { data, error } = await supabase.from("galleries").update({ published }).eq("id", id).select("slug");
  if (error) return { error: "Could not update the gallery." };
  if (!data || data.length === 0) return { error: "Gallery not found." };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/galleries");
  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath(`/work/${data[0].slug}`);
}

/** Bulk-persists a new gallery order after a drag-and-drop reorder in the dashboard grid. */
export async function reorderGalleries(orderedGalleryIds: string[]): Promise<{ error: string } | void> {
  const { supabase } = await getAuthedClient();

  const results = await Promise.all(
    orderedGalleryIds.map((id, index) => supabase.from("galleries").update({ display_order: index }).eq("id", id))
  );

  const failed = results.find((r) => r.error);
  if (failed) return { error: "Could not save the new order. Please try again." };

  revalidatePath("/dashboard/galleries");
  revalidatePath("/");
  revalidatePath("/work");
}

/** Sets a gallery's cover from a file the client already uploaded directly to storage. */
export async function setGalleryCover(
  galleryId: string,
  cover: { url: string; width: number; height: number }
): Promise<{ error: string } | void> {
  const { supabase } = await getAuthedClient();

  const { data, error } = await supabase
    .from("galleries")
    .update({ cover_image: cover.url, cover_width: cover.width, cover_height: cover.height })
    .eq("id", galleryId)
    .select("slug");

  if (error) return { error: "Could not set the cover image." };
  if (!data || data.length === 0) return { error: "Gallery not found." };

  revalidatePath("/dashboard/galleries");
  revalidatePath(`/dashboard/galleries/${galleryId}`);
  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath(`/work/${data[0].slug}`);
}

/** Sets a gallery's cover to one of its own existing photos. */
export async function setGalleryCoverFromPhoto(galleryId: string, photoId: string): Promise<{ error: string } | void> {
  const { supabase } = await getAuthedClient();

  const { data: photo, error: photoError } = await supabase
    .from("photos")
    .select("image_url, width, height, gallery_id")
    .eq("id", photoId)
    .single();

  if (photoError || !photo || photo.gallery_id !== galleryId) {
    return { error: "Photo not found in this gallery." };
  }

  return setGalleryCover(galleryId, { url: photo.image_url, width: photo.width, height: photo.height });
}
