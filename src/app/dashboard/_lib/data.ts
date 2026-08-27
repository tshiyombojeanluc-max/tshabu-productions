import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Gallery, Lead, Photo, Profile } from "@/lib/supabase/types";

/**
 * Resolves the signed-in user's profile. proxy.ts already redirects
 * unauthenticated requests away from /dashboard, but every data-access
 * function checks again here — the proxy matcher is not the security
 * boundary, this query (scoped by RLS to auth.uid()) is.
 *
 * Wrapped in React's `cache` so multiple functions can call it within the
 * same request without double-querying Supabase.
 */
export const requireProfile = cache(async (): Promise<Profile> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/dashboard/login");
  }

  const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();

  if (error || !profile) {
    redirect("/dashboard/login");
  }

  return profile;
});

/**
 * Every function below explicitly filters by the signed-in user's id, on
 * top of what RLS already restricts. RLS's SELECT policy intentionally
 * allows any authenticated user to read *published* galleries (the public
 * site needs that), so without this explicit filter a dashboard query would
 * also return other clients' published work once more than one client
 * exists. RLS still independently blocks writes to anything not owned.
 */

export async function listGalleries(): Promise<Gallery[]> {
  const profile = await requireProfile();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("galleries")
    .select("*")
    .eq("owner_id", profile.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getGalleryWithPhotos(id: string): Promise<{ gallery: Gallery; photos: Photo[] } | null> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: gallery, error: galleryError } = await supabase
    .from("galleries")
    .select("*")
    .eq("id", id)
    .eq("owner_id", profile.id)
    .single();

  if (galleryError || !gallery) return null;

  const { data: photos, error: photosError } = await supabase
    .from("photos")
    .select("*")
    .eq("gallery_id", id)
    .order("display_order", { ascending: true });

  if (photosError) throw photosError;

  return { gallery, photos: photos ?? [] };
}

export type PhotoWithGallery = Photo & { gallery_title: string };

export async function listAllPhotos(): Promise<PhotoWithGallery[]> {
  const profile = await requireProfile();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("photos")
    .select("*, galleries!inner(title, owner_id)")
    .eq("galleries.owner_id", profile.id)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row) => {
    const { galleries, ...photo } = row as Photo & { galleries: { title: string } };
    return { ...photo, gallery_title: galleries.title };
  });
}

export type DashboardStats = {
  galleryCount: number;
  photoCount: number;
  newLeadCount: number;
  recentGalleries: Gallery[];
  recentPhotos: PhotoWithGallery[];
  recentLeads: Lead[];
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const [galleryCountRes, photoCountRes, newLeadCountRes, recentGalleriesRes, recentPhotosRes, recentLeadsRes] =
    await Promise.all([
      supabase.from("galleries").select("*", { count: "exact", head: true }).eq("owner_id", profile.id),
      supabase
        .from("photos")
        .select("*, galleries!inner(owner_id)", { count: "exact", head: true })
        .eq("galleries.owner_id", profile.id),
      supabase.from("leads").select("*", { count: "exact", head: true }).eq("status", "new"),
      supabase
        .from("galleries")
        .select("*")
        .eq("owner_id", profile.id)
        .order("updated_at", { ascending: false })
        .limit(5),
      supabase
        .from("photos")
        .select("*, galleries!inner(title, owner_id)")
        .eq("galleries.owner_id", profile.id)
        .order("created_at", { ascending: false })
        .limit(8),
      supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(5),
    ]);

  if (galleryCountRes.error) throw galleryCountRes.error;
  if (photoCountRes.error) throw photoCountRes.error;
  if (newLeadCountRes.error) throw newLeadCountRes.error;
  if (recentGalleriesRes.error) throw recentGalleriesRes.error;
  if (recentPhotosRes.error) throw recentPhotosRes.error;
  if (recentLeadsRes.error) throw recentLeadsRes.error;

  const recentPhotos = (recentPhotosRes.data ?? []).map((row) => {
    const { galleries, ...photo } = row as Photo & { galleries: { title: string } };
    return { ...photo, gallery_title: galleries.title };
  });

  return {
    galleryCount: galleryCountRes.count ?? 0,
    photoCount: photoCountRes.count ?? 0,
    newLeadCount: newLeadCountRes.count ?? 0,
    recentGalleries: recentGalleriesRes.data ?? [],
    recentPhotos,
    recentLeads: recentLeadsRes.data ?? [],
  };
}

export async function listLeads(): Promise<Lead[]> {
  await requireProfile();
  const supabase = await createClient();
  const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}
