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
  { label: "Facebook", href: "https://facebook.com" },
  { label: "Instagram", href: "https://instagram.com" },
  { label: "TikTok", href: "https://tiktok.com" },
];

export type Project = {
  slug: string;
  name: string;
  category: string;
  year: string;
  client: string;
  description: string;
  coverImage: string;
  coverAspect: "portrait" | "landscape" | "square";
  gallery: string[];
  credits: { role: string; name: string }[];
  featured: boolean;
};

export const projects: Project[] = [
  {
    slug: "north-star",
    name: "North Star",
    category: "Brand Photography",
    year: "2026",
    client: "Arden Watch Co.",
    description:
      "A quiet product photography story built around light, texture and the confidence of a brand that doesn't need to shout.",
    coverImage:
      "https://images.unsplash.com/photo-1495707902641-75cac588d2e9?w=1400&auto=format&fit=crop&q=80",
    coverAspect: "landscape",
    gallery: [
      "https://images.unsplash.com/photo-1495707902641-75cac588d2e9?w=1600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=1600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1600&auto=format&fit=crop&q=80",
    ],
    credits: [
      { role: "Director", name: "Lerato Tshabu" },
      { role: "Director of Photography", name: "Samuel Okafor" },
      { role: "Editor", name: "Mia Chen" },
      { role: "Colorist", name: "David Reyes" },
    ],
    featured: true,
  },
  {
    slug: "glasshouse",
    name: "Glasshouse",
    category: "Videography",
    year: "2025",
    client: "Independent",
    description:
      "A short film exploring memory and architecture, shot over three days inside a single modernist residence at the edge of the city.",
    coverImage:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1400&auto=format&fit=crop&q=80",
    coverAspect: "portrait",
    gallery: [
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1493514789931-586cb221d7a7?w=1600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1600&auto=format&fit=crop&q=80",
    ],
    credits: [
      { role: "Director", name: "Lerato Tshabu" },
      { role: "Writer", name: "Naledi Moyo" },
      { role: "Director of Photography", name: "Samuel Okafor" },
    ],
    featured: true,
  },
  {
    slug: "monogram",
    name: "Monogram",
    category: "Brand Content",
    year: "2025",
    client: "Ffélicité Maison",
    description:
      "A multi-format campaign for a Paris-based fashion house — film, stills and social content unified under one visual language.",
    coverImage:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&auto=format&fit=crop&q=80",
    coverAspect: "landscape",
    gallery: [
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1520975954732-35dd22299614?w=1600&auto=format&fit=crop&q=80",
    ],
    credits: [
      { role: "Creative Director", name: "Lerato Tshabu" },
      { role: "Photographer", name: "Anaïs Laurent" },
      { role: "Producer", name: "Kwame Asante" },
    ],
    featured: true,
  },
  {
    slug: "low-tide",
    name: "Low Tide",
    category: "Event Coverage",
    year: "2025",
    client: "Private Wedding",
    description:
      "An intimate wedding film shot at dawn on the Atlantic coast, built entirely around natural light and quiet, unscripted moments.",
    coverImage:
      "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=1400&auto=format&fit=crop&q=80",
    coverAspect: "portrait",
    gallery: [
      "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=1600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=1600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=1600&auto=format&fit=crop&q=80",
    ],
    credits: [
      { role: "Director", name: "Naledi Moyo" },
      { role: "Director of Photography", name: "Samuel Okafor" },
      { role: "Editor", name: "Mia Chen" },
    ],
    featured: true,
  },
  {
    slug: "the-long-table",
    name: "The Long Table",
    category: "Videography",
    year: "2024",
    client: "Field & Fire",
    description:
      "A short documentary following a family-run restaurant through one service, told without narration — only sound, light and rhythm.",
    coverImage:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&auto=format&fit=crop&q=80",
    coverAspect: "landscape",
    gallery: [
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&auto=format&fit=crop&q=80",
    ],
    credits: [
      { role: "Director", name: "Lerato Tshabu" },
      { role: "Producer", name: "Kwame Asante" },
    ],
    featured: false,
  },
  {
    slug: "afterglow",
    name: "Afterglow",
    category: "Photography",
    year: "2024",
    client: "Solenne Beauty",
    description:
      "A skincare campaign built on texture and light — macro photography and product stills for a brand that trusts its ingredients to speak first.",
    coverImage:
      "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=1400&auto=format&fit=crop&q=80",
    coverAspect: "square",
    gallery: [
      "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=1600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1600&auto=format&fit=crop&q=80",
    ],
    credits: [
      { role: "Director", name: "Naledi Moyo" },
      { role: "Photographer", name: "Anaïs Laurent" },
    ],
    featured: false,
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export const getProjectBySlug = (slug: string) =>
  projects.find((p) => p.slug === slug);

export const getAdjacentProjects = (slug: string) => {
  const index = projects.findIndex((p) => p.slug === slug);
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  return { prev, next };
};

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
