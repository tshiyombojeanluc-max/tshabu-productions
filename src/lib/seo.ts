import type { Metadata } from "next";

/**
 * The site's real, live, working domain. `tshabuproductions.com` (used
 * previously throughout metadata) is unregistered and resolves to nothing —
 * every canonical/OG URL was pointing at a dead domain. Update this the day
 * a real custom domain goes live, and add a redirect from this URL to it.
 */
export const SITE_URL = "https://tshabu-productions.vercel.app";

export const DEFAULT_OG_IMAGE =
  "/images/projects/myles-munroe-foundation/myles-munroe-foundation-1.jpg";

export const absoluteUrl = (path: string) => new URL(path, SITE_URL).toString();

/**
 * Builds a page's full metadata object, including the nested `openGraph`
 * and `alternates.canonical` fields that Next.js does NOT deep-merge from
 * the root layout — a page that only sets `title`/`description` silently
 * inherits the parent's entire `openGraph` object (wrong title/url) and
 * canonical (wrong URL). Every page must set these explicitly.
 */
export function buildMetadata({
  title,
  description,
  path,
  image,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  const url = absoluteUrl(path);
  const ogImage = image ?? DEFAULT_OG_IMAGE;
  // `title` only receives the root layout's "%s — Tshabu Productions"
  // template for the <title> tag — openGraph/twitter titles need it applied
  // manually, or shared links show the bare page name with no brand context.
  const fullTitle = title.includes("Tshabu Productions") ? title : `${title} — Tshabu Productions`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
  };
}

type BreadcrumbItem = { name: string; path: string };

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
