import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Gallery, Photo } from "@/lib/supabase/types";
import type { Project } from "@/lib/data";

/**
 * Maps a Supabase `galleries` row (with its `photos`) onto the exact
 * `Project` shape the existing public components (ProjectGrid, ProjectCard,
 * the /work/[slug] detail page) already render — so none of that JSX needs
 * to change, only where the data comes from.
 */
function coverAspect(width: number | null, height: number | null): Project["coverAspect"] {
  if (!width || !height) return "landscape";
  const ratio = width / height;
  if (ratio < 0.85) return "portrait";
  if (ratio > 1.15) return "landscape";
  return "square";
}

function toProject(gallery: Gallery, photos: Photo[]): Project {
  const sortedPhotos = [...photos].sort((a, b) => a.display_order - b.display_order);
  return {
    slug: gallery.slug,
    name: gallery.title,
    category: gallery.category ?? "",
    year: gallery.project_year ?? "",
    client: gallery.client_name ?? "",
    description: gallery.description ?? "",
    coverImage: gallery.cover_image ?? sortedPhotos[0]?.image_url ?? "",
    coverAspect: coverAspect(gallery.cover_width, gallery.cover_height),
    gallery: sortedPhotos.map((p) => ({ src: p.image_url, width: p.width, height: p.height })),
    credits: [{ role: "Photography", name: "Tshabu Productions" }],
    featured: gallery.featured,
    updatedAt: gallery.updated_at,
  };
}

/** All published galleries, newest first. Cached per-request. */
export const getPublishedProjects = cache(async (): Promise<Project[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("galleries")
    .select("*, photos(*)")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((row) => {
    const { photos, ...gallery } = row as Gallery & { photos: Photo[] };
    return toProject(gallery, photos);
  });
});

export async function getFeaturedProjects(): Promise<Project[]> {
  return (await getPublishedProjects()).filter((p) => p.featured);
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  return (await getPublishedProjects()).find((p) => p.slug === slug);
}

export async function getAdjacentProjects(slug: string): Promise<{ prev: Project; next: Project }> {
  const projects = await getPublishedProjects();
  const index = projects.findIndex((p) => p.slug === slug);
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  return { prev, next };
}
