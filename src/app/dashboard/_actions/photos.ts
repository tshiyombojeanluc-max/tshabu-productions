"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function getAuthedClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/dashboard/login");
  return { supabase, userId: user.id };
}

async function revalidateGallery(galleryId: string, slug?: string | null) {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/photos");
  revalidatePath(`/dashboard/galleries/${galleryId}`);
  revalidatePath("/");
  revalidatePath("/work");
  if (slug) revalidatePath(`/work/${slug}`);
}

export type NewPhoto = {
  galleryId: string;
  storagePath: string;
  url: string;
  width: number;
  height: number;
  title?: string;
};

/** Persists metadata for a file the client already uploaded directly to storage. */
export async function createPhotoRecord(photo: NewPhoto): Promise<{ error: string } | { id: string }> {
  const { supabase } = await getAuthedClient();

  const { data: gallery, error: galleryError } = await supabase
    .from("galleries")
    .select("id, slug")
    .eq("id", photo.galleryId)
    .single();

  if (galleryError || !gallery) return { error: "Gallery not found." };

  const { data: maxOrderRow } = await supabase
    .from("photos")
    .select("display_order")
    .eq("gallery_id", photo.galleryId)
    .order("display_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextOrder = (maxOrderRow?.display_order ?? -1) + 1;

  const { data, error } = await supabase
    .from("photos")
    .insert({
      gallery_id: photo.galleryId,
      storage_path: photo.storagePath,
      image_url: photo.url,
      width: photo.width,
      height: photo.height,
      title: photo.title || null,
      display_order: nextOrder,
    })
    .select("id")
    .single();

  if (error || !data) return { error: "Could not save the photo. Please try again." };

  await revalidateGallery(photo.galleryId, gallery.slug);
  return { id: data.id };
}

type PhotoWithGallerySlug = { storage_path: string; gallery_id: string; galleries: { slug: string } | null };

export async function deletePhoto(photoId: string): Promise<{ error: string } | void> {
  const { supabase } = await getAuthedClient();

  const { data: photoRow, error: findError } = await supabase
    .from("photos")
    .select("storage_path, gallery_id, galleries(slug)")
    .eq("id", photoId)
    .single();

  if (findError || !photoRow) return { error: "Photo not found." };
  const photo = photoRow as unknown as PhotoWithGallerySlug;

  const { data, error } = await supabase.from("photos").delete().eq("id", photoId).select("id");
  if (error || !data || data.length === 0) return { error: "Could not delete the photo. Please try again." };

  await supabase.storage.from("gallery-photos").remove([photo.storage_path]);

  await revalidateGallery(photo.gallery_id, photo.galleries?.slug);
}

export async function updatePhotoDetails(
  photoId: string,
  fields: { title?: string; description?: string }
): Promise<{ error: string } | void> {
  const { supabase } = await getAuthedClient();

  const { data, error } = await supabase
    .from("photos")
    .update({
      title: fields.title?.trim() || null,
      description: fields.description?.trim() || null,
    })
    .eq("id", photoId)
    .select("gallery_id, galleries(slug)");

  if (error) return { error: "Could not save changes." };
  if (!data || data.length === 0) return { error: "Photo not found." };

  const row = data[0] as unknown as { gallery_id: string; galleries: { slug: string } | null };
  await revalidateGallery(row.gallery_id, row.galleries?.slug);
}

/** Bulk-persists a new photo order after a drag-and-drop reorder in the dashboard grid. */
export async function reorderPhotos(galleryId: string, orderedPhotoIds: string[]): Promise<{ error: string } | void> {
  const { supabase } = await getAuthedClient();

  const { data: gallery } = await supabase.from("galleries").select("slug").eq("id", galleryId).single();

  const results = await Promise.all(
    orderedPhotoIds.map((id, index) =>
      supabase.from("photos").update({ display_order: index }).eq("id", id).eq("gallery_id", galleryId)
    )
  );

  const failed = results.find((r) => r.error);
  if (failed) return { error: "Could not save the new order. Please try again." };

  await revalidateGallery(galleryId, gallery?.slug);
}

/** Deletes several photos (possibly spanning multiple galleries) in one pass. */
export async function bulkDeletePhotos(photoIds: string[]): Promise<{ error: string } | void> {
  if (photoIds.length === 0) return;
  const { supabase } = await getAuthedClient();

  const { data: rows, error: findError } = await supabase
    .from("photos")
    .select("storage_path, gallery_id, galleries(slug)")
    .in("id", photoIds);

  if (findError || !rows || rows.length === 0) return { error: "Photos not found." };
  const photos = rows as unknown as PhotoWithGallerySlug[];

  const { error } = await supabase.from("photos").delete().in("id", photoIds);
  if (error) return { error: "Could not delete the photos. Please try again." };

  await supabase.storage.from("gallery-photos").remove(photos.map((p) => p.storage_path));

  const byGallery = new Map<string, string | null | undefined>();
  photos.forEach((p) => byGallery.set(p.gallery_id, p.galleries?.slug));
  await Promise.all([...byGallery.entries()].map(([galleryId, slug]) => revalidateGallery(galleryId, slug)));
}

/** Moves several photos (possibly from different source galleries) into one target gallery. */
export async function bulkMovePhotos(photoIds: string[], newGalleryId: string): Promise<{ error: string } | void> {
  if (photoIds.length === 0) return;
  const { supabase } = await getAuthedClient();

  const { data: currentRows } = await supabase.from("photos").select("gallery_id, galleries(slug)").in("id", photoIds);
  const sourceGalleries = new Map<string, string | null | undefined>();
  (currentRows as unknown as { gallery_id: string; galleries: { slug: string } | null }[] | null)?.forEach((row) =>
    sourceGalleries.set(row.gallery_id, row.galleries?.slug)
  );

  const { data, error } = await supabase
    .from("photos")
    .update({ gallery_id: newGalleryId })
    .in("id", photoIds)
    .select("id, galleries(slug)");

  if (error) return { error: "Could not move the photos — check they belong to one of your galleries." };
  if (!data || data.length === 0) return { error: "Photos not found." };

  const newSlug = (data[0] as unknown as { galleries: { slug: string } | null }).galleries?.slug;

  await Promise.all([
    ...[...sourceGalleries.entries()].map(([galleryId, slug]) => revalidateGallery(galleryId, slug)),
    revalidateGallery(newGalleryId, newSlug),
  ]);
}

export async function movePhotoToGallery(photoId: string, newGalleryId: string): Promise<{ error: string } | void> {
  const { supabase } = await getAuthedClient();

  const { data: currentRow } = await supabase
    .from("photos")
    .select("gallery_id, galleries(slug)")
    .eq("id", photoId)
    .single();
  const current = currentRow as unknown as { gallery_id: string; galleries: { slug: string } | null } | null;

  const { data, error } = await supabase
    .from("photos")
    .update({ gallery_id: newGalleryId })
    .eq("id", photoId)
    .select("id, galleries(slug)");

  if (error) return { error: "Could not move the photo — check it belongs to one of your galleries." };
  if (!data || data.length === 0) return { error: "Photo not found." };

  const newSlug = (data[0] as unknown as { galleries: { slug: string } | null }).galleries?.slug;

  if (current?.gallery_id) await revalidateGallery(current.gallery_id, current.galleries?.slug);
  await revalidateGallery(newGalleryId, newSlug);
}
