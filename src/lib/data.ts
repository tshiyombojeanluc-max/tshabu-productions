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
    slug: "yit-gala",
    name: "YIT Gala",
    category: "Event Coverage",
    year: "2025",
    client: "YIT",
    description:
      "A formal gala evening — candid table moments, speeches and the quiet in-between instants that a night like this is actually remembered by.",
    coverImage: "/images/projects/yit-gala/yit-gala-1.jpg",
    coverAspect: "landscape",
    gallery: [
      "/images/projects/yit-gala/yit-gala-1.jpg",
      "/images/projects/yit-gala/yit-gala-2.jpg",
      "/images/projects/yit-gala/yit-gala-3.jpg",
      "/images/projects/yit-gala/yit-gala-4.jpg",
      "/images/projects/yit-gala/yit-gala-5.jpg",
      "/images/projects/yit-gala/yit-gala-6.jpg",
      "/images/projects/yit-gala/yit-gala-7.jpg",
      "/images/projects/yit-gala/yit-gala-8.jpg",
      "/images/projects/yit-gala/yit-gala-9.jpg",
      "/images/projects/yit-gala/yit-gala-10.jpg",
    ],
    credits: [{ role: "Photography", name: "Tshabu Productions" }],
    featured: true,
  },
  {
    slug: "myles-munroe-foundation",
    name: "Myles Munroe Foundation",
    category: "Event Coverage",
    year: "2024",
    client: "Myles Munroe Foundation",
    description:
      "Coverage of the Global Influence Leadership Award — speakers, presentations and the room itself, shot to hold up as a record of the occasion.",
    coverImage: "/images/projects/myles-munroe-foundation/myles-munroe-foundation-1.jpg",
    coverAspect: "landscape",
    gallery: [
      "/images/projects/myles-munroe-foundation/myles-munroe-foundation-1.jpg",
      "/images/projects/myles-munroe-foundation/myles-munroe-foundation-2.jpg",
      "/images/projects/myles-munroe-foundation/myles-munroe-foundation-3.jpg",
      "/images/projects/myles-munroe-foundation/myles-munroe-foundation-4.jpg",
      "/images/projects/myles-munroe-foundation/myles-munroe-foundation-5.jpg",
    ],
    credits: [{ role: "Photography", name: "Tshabu Productions" }],
    featured: true,
  },
  {
    slug: "jazz-and-wine",
    name: "Jazz & Wine",
    category: "Event Coverage",
    year: "2026",
    client: "Jazz & Wine",
    description:
      "An evening event built around music and atmosphere — low light, live performance and a crowd at ease, documented as it actually happened.",
    coverImage: "/images/projects/jazz-and-wine/jazz-and-wine-1.jpg",
    coverAspect: "portrait",
    gallery: [
      "/images/projects/jazz-and-wine/jazz-and-wine-1.jpg",
      "/images/projects/jazz-and-wine/jazz-and-wine-2.jpg",
      "/images/projects/jazz-and-wine/jazz-and-wine-3.jpg",
      "/images/projects/jazz-and-wine/jazz-and-wine-4.jpg",
      "/images/projects/jazz-and-wine/jazz-and-wine-5.jpg",
      "/images/projects/jazz-and-wine/jazz-and-wine-6.jpg",
      "/images/projects/jazz-and-wine/jazz-and-wine-7.jpg",
      "/images/projects/jazz-and-wine/jazz-and-wine-8.jpg",
      "/images/projects/jazz-and-wine/jazz-and-wine-9.jpg",
      "/images/projects/jazz-and-wine/jazz-and-wine-10.jpg",
    ],
    credits: [{ role: "Photography", name: "Tshabu Productions" }],
    featured: true,
  },
  {
    slug: "50th-birthday",
    name: "50th Birthday",
    category: "Event Coverage",
    year: "2025",
    client: "Private Client",
    description:
      "A milestone birthday celebration — full-day coverage of the guests, the toasts and the small details that made the day theirs.",
    coverImage: "/images/projects/50th-birthday/50th-birthday-1.jpg",
    coverAspect: "square",
    gallery: [
      "/images/projects/50th-birthday/50th-birthday-1.jpg",
      "/images/projects/50th-birthday/50th-birthday-2.jpg",
      "/images/projects/50th-birthday/50th-birthday-3.jpg",
      "/images/projects/50th-birthday/50th-birthday-4.jpg",
      "/images/projects/50th-birthday/50th-birthday-5.jpg",
      "/images/projects/50th-birthday/50th-birthday-6.jpg",
      "/images/projects/50th-birthday/50th-birthday-7.jpg",
      "/images/projects/50th-birthday/50th-birthday-8.jpg",
      "/images/projects/50th-birthday/50th-birthday-9.jpg",
      "/images/projects/50th-birthday/50th-birthday-10.jpg",
    ],
    credits: [{ role: "Photography", name: "Tshabu Productions" }],
    featured: true,
  },
  {
    slug: "one-year-birthday",
    name: "1 Year Birthday",
    category: "Event Coverage",
    year: "2026",
    client: "Private Client",
    description:
      "A first birthday, photographed the way it deserves to be — warm, unposed and built to be looked back on for years.",
    coverImage: "/images/projects/one-year-birthday/one-year-birthday-1.jpg",
    coverAspect: "portrait",
    gallery: [
      "/images/projects/one-year-birthday/one-year-birthday-1.jpg",
      "/images/projects/one-year-birthday/one-year-birthday-2.jpg",
      "/images/projects/one-year-birthday/one-year-birthday-3.jpg",
      "/images/projects/one-year-birthday/one-year-birthday-4.jpg",
      "/images/projects/one-year-birthday/one-year-birthday-5.jpg",
      "/images/projects/one-year-birthday/one-year-birthday-6.jpg",
      "/images/projects/one-year-birthday/one-year-birthday-7.jpg",
      "/images/projects/one-year-birthday/one-year-birthday-8.jpg",
      "/images/projects/one-year-birthday/one-year-birthday-9.jpg",
      "/images/projects/one-year-birthday/one-year-birthday-10.jpg",
    ],
    credits: [{ role: "Photography", name: "Tshabu Productions" }],
    featured: true,
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
