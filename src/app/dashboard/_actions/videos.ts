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
  revalidatePath("/dashboard/videos");
  revalidatePath(`/dashboard/galleries/${galleryId}`);
  revalidatePath("/");
  revalidatePath("/work");
  if (slug) revalidatePath(`/work/${slug}`);
}

export type NewVideo = {
  galleryId: string;
  storagePath: string;
  url: string;
  width: number;
  height: number;
  durationSeconds: number;
  title?: string;
};

/** Persists metadata for a file the client already uploaded directly to storage. */
export async function createVideoRecord(video: NewVideo): Promise<{ error: string } | { id: string }> {
  const { supabase } = await getAuthedClient();

  const { data: gallery, error: galleryError } = await supabase
    .from("galleries")
    .select("id, slug")
    .eq("id", video.galleryId)
    .single();

  if (galleryError || !gallery) return { error: "Gallery not found." };

  const { data: maxOrderRow } = await supabase
    .from("videos")
    .select("display_order")
    .eq("gallery_id", video.galleryId)
    .order("display_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextOrder = (maxOrderRow?.display_order ?? -1) + 1;

  const { data, error } = await supabase
    .from("videos")
    .insert({
      gallery_id: video.galleryId,
      storage_path: video.storagePath,
      video_url: video.url,
      width: video.width,
      height: video.height,
      duration_seconds: video.durationSeconds,
      title: video.title || null,
      display_order: nextOrder,
    })
    .select("id")
    .single();

  if (error || !data) return { error: "Could not save the video. Please try again." };

  await revalidateGallery(video.galleryId, gallery.slug);
  return { id: data.id };
}

type VideoWithGallerySlug = { storage_path: string; gallery_id: string; galleries: { slug: string } | null };

export async function deleteVideo(videoId: string): Promise<{ error: string } | void> {
  const { supabase } = await getAuthedClient();

  const { data: videoRow, error: findError } = await supabase
    .from("videos")
    .select("storage_path, gallery_id, galleries(slug)")
    .eq("id", videoId)
    .single();

  if (findError || !videoRow) return { error: "Video not found." };
  const video = videoRow as unknown as VideoWithGallerySlug;

  const { data, error } = await supabase.from("videos").delete().eq("id", videoId).select("id");
  if (error || !data || data.length === 0) return { error: "Could not delete the video. Please try again." };

  await supabase.storage.from("gallery-videos").remove([video.storage_path]);

  await revalidateGallery(video.gallery_id, video.galleries?.slug);
}

export async function updateVideoDetails(
  videoId: string,
  fields: { title?: string; description?: string }
): Promise<{ error: string } | void> {
  const { supabase } = await getAuthedClient();

  const { data, error } = await supabase
    .from("videos")
    .update({
      title: fields.title?.trim() || null,
      description: fields.description?.trim() || null,
    })
    .eq("id", videoId)
    .select("gallery_id, galleries(slug)");

  if (error) return { error: "Could not save changes." };
  if (!data || data.length === 0) return { error: "Video not found." };

  const row = data[0] as unknown as { gallery_id: string; galleries: { slug: string } | null };
  await revalidateGallery(row.gallery_id, row.galleries?.slug);
}

/** Bulk-persists a new video order after a drag-and-drop reorder in the dashboard grid. */
export async function reorderVideos(galleryId: string, orderedVideoIds: string[]): Promise<{ error: string } | void> {
  const { supabase } = await getAuthedClient();

  const { data: gallery } = await supabase.from("galleries").select("slug").eq("id", galleryId).single();

  const results = await Promise.all(
    orderedVideoIds.map((id, index) =>
      supabase.from("videos").update({ display_order: index }).eq("id", id).eq("gallery_id", galleryId)
    )
  );

  const failed = results.find((r) => r.error);
  if (failed) return { error: "Could not save the new order. Please try again." };

  await revalidateGallery(galleryId, gallery?.slug);
}

export async function moveVideoToGallery(videoId: string, newGalleryId: string): Promise<{ error: string } | void> {
  const { supabase } = await getAuthedClient();

  const { data: currentRow } = await supabase
    .from("videos")
    .select("gallery_id, galleries(slug)")
    .eq("id", videoId)
    .single();
  const current = currentRow as unknown as { gallery_id: string; galleries: { slug: string } | null } | null;

  const { data, error } = await supabase
    .from("videos")
    .update({ gallery_id: newGalleryId })
    .eq("id", videoId)
    .select("id, galleries(slug)");

  if (error) return { error: "Could not move the video — check it belongs to one of your galleries." };
  if (!data || data.length === 0) return { error: "Video not found." };

  const newSlug = (data[0] as unknown as { galleries: { slug: string } | null }).galleries?.slug;

  if (current?.gallery_id) await revalidateGallery(current.gallery_id, current.galleries?.slug);
  await revalidateGallery(newGalleryId, newSlug);
}
