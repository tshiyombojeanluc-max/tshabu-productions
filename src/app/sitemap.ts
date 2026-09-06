import type { MetadataRoute } from "next";
import { getPublishedProjects } from "@/lib/galleries";
import { SITE_URL } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getPublishedProjects();

  // The most recent gallery edit is the only real "last changed" signal the
  // /work listing has — using it instead of "now" (as this previously did
  // for every route) means the date is only ever true, not just current.
  const mostRecentProjectUpdate = projects
    .map((p) => new Date(p.updatedAt))
    .sort((a, b) => b.getTime() - a.getTime())[0];

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/work`, lastModified: mostRecentProjectUpdate, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/about`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${SITE_URL}/services`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.5 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${SITE_URL}/work/${project.slug}`,
    lastModified: new Date(project.updatedAt),
    changeFrequency: "monthly",
    priority: 0.7,
    images: project.gallery.map((photo) => photo.src),
  }));

  return [...staticRoutes, ...projectRoutes];
}
