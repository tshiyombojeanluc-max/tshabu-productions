import type { Metadata } from "next";

/**
 * The site's real, live, working domain. The old tshabu-productions.vercel.app
 * URL still resolves (Vercel keeps it as an alias), so next.config.ts
 * permanently redirects it here to avoid splitting SEO signals/duplicate
 * content between the two.
 */
export const SITE_URL = "https://tshabuproductions.co.za";

export const DEFAULT_OG_IMAGE = "/images/logo.png";

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
