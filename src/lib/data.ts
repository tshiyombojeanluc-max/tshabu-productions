export const site = {
  name: "Tshabu Productions",
  shortName: "Tshabu",
  tagline: "Photography · Videography · Storytelling",
  email: "tshabuproductions@gmail.com",
  phone: "+27 67 105 7588",
  location: "Cape Town, South Africa",
};

export const navLinks = [
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
];

export const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/tshabu.elie" },
  { label: "Instagram", href: "https://www.instagram.com/tshabuproductions" },
  { label: "TikTok", href: "https://www.tiktok.com/@tshabu.production" },
];

// Gallery/photo content used to live here as a hardcoded array. It's now
// managed through /dashboard and served from Supabase — see
// src/lib/galleries.ts, which still returns this exact shape so every
// existing display component (ProjectGrid, ProjectCard, /work/[slug])
// works unchanged.
export type Project = {
  slug: string;
  name: string;
  category: string;
  year: string;
  client: string;
  description: string;
  coverImage: string;
  coverAspect: "portrait" | "landscape" | "square";
  gallery: { src: string; width: number; height: number }[];
  videos: { src: string; width: number; height: number }[];
  credits: { role: string; name: string }[];
  featured: boolean;
  /** ISO timestamp of the gallery's last edit — used for sitemap.xml. */
  updatedAt: string;
};

/**
 * Category/year/client are optional on a dashboard-created gallery (unlike
 * the original 5 seeded projects, which always had them), so anything
 * joining them with " — " needs to skip the pieces that are missing rather
 * than rendering a dangling separator.
 */
export function joinLabel(...parts: (string | null | undefined)[]): string {
  return parts.filter((part): part is string => Boolean(part)).join(" — ");
}

export type Service = {
  id: string;
  index: string;
  title: string;
  summary: string;
  description: string;
  offerings: string[];
};

export const services: Service[] = [
  {
    id: "photography",
    index: "01",
    title: "Photography",
    summary: "Editorial, event and brand photography.",
    description:
      "From portraits to full-day coverage, we shoot photography that holds its value long after the moment has passed — considered light, honest composition, timeless edits.",
    offerings: ["Event photography", "Brand & product photography", "Portrait sessions", "Same-day previews"],
  },
  {
    id: "videography",
    index: "02",
    title: "Videography",
    summary: "Cinematic video for brands and events.",
    description:
      "We film and edit video that feels considered — brand stories, event highlights and promotional content shaped around your story, not a template.",
    offerings: ["Event highlight films", "Brand & promotional video", "Social-ready cutdowns", "On-location filming"],
  },
  {
    id: "event-coverage",
    index: "03",
    title: "Event Coverage",
    summary: "Full-day photo and video coverage for events.",
    description:
      "One team, on-site for the full day — photo and video together, so nothing about your event, wedding or function goes undocumented.",
    offerings: ["Weddings & functions", "School & corporate events", "Multi-camera coverage", "Same-week delivery"],
  },
  {
    id: "post-production",
    index: "04",
    title: "Post-Production",
    summary: "Editing, colour grading and delivery.",
    description:
      "Every project is edited and graded in-house — colour, sound and pacing considered with the same care as the shoot itself.",
    offerings: ["Photo editing & retouching", "Video editing & colour grading", "Highlight reels", "Fast turnaround delivery"],
  },
];

export const approachSteps = [
  { index: "01", title: "Discover", description: "Understanding the story, audience and objective." },
  { index: "02", title: "Create", description: "Developing the concept and visual direction." },
  { index: "03", title: "Produce", description: "Turning the concept into high-quality visual content." },
  { index: "04", title: "Deliver", description: "Polished final production ready for its audience." },
];
