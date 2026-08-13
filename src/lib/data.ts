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
  { label: "Facebook", href: "https://www.facebook.com/share/1HvfUTFsg3/" },
  { label: "Instagram", href: "https://www.instagram.com/tshabuproductions" },
  { label: "TikTok", href: "https://www.tiktok.com/@tshabu.production" },
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
    coverImage: "/images/stock/north-star-1.jpg",
    coverAspect: "landscape",
    gallery: [
      "/images/stock/north-star-1.jpg",
      "/images/stock/north-star-2.jpg",
      "/images/stock/north-star-3.jpg",
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
    coverImage: "/images/stock/glasshouse-1.jpg",
    coverAspect: "portrait",
    gallery: [
      "/images/stock/glasshouse-1.jpg",
      "/images/stock/glasshouse-2.jpg",
      "/images/stock/glasshouse-3.jpg",
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
    coverImage: "/images/stock/monogram-1.jpg",
    coverAspect: "landscape",
    gallery: [
      "/images/stock/monogram-1.jpg",
      "/images/stock/monogram-2.jpg",
      "/images/stock/monogram-3.jpg",
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
    coverImage: "/images/stock/low-tide-1.jpg",
    coverAspect: "portrait",
    gallery: [
      "/images/stock/low-tide-1.jpg",
      "/images/stock/low-tide-2.jpg",
      "/images/stock/low-tide-3.jpg",
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
    coverImage: "/images/stock/long-table-1.jpg",
    coverAspect: "landscape",
    gallery: ["/images/stock/long-table-1.jpg"],
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
    coverImage: "/images/stock/afterglow-1.jpg",
    coverAspect: "square",
    gallery: ["/images/stock/afterglow-1.jpg", "/images/stock/afterglow-2.jpg"],
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
