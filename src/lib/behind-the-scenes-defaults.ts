// Plain data, importable from both the server component that resolves each
// photo's src (about/page.tsx) and the client component that renders the
// masonry grid (components/site/behind-the-scenes-gallery.tsx) — kept out of
// that "use client" file because a client module's non-component exports
// don't reliably pass through into a Server Component import.
export type BehindTheScenesItem = { src: string; alt: string; tall: boolean };

// Alt text and layout stay fixed; each `src` is overridden per-slot from
// Dashboard → Site Images (see lib/site-image-slots.ts, keys "bts_1"..."bts_6").
export const behindTheScenesDefaults: BehindTheScenesItem[] = [
  {
    src: "/images/projects/jazz-and-wine/jazz-and-wine-6.jpg",
    alt: "A musician playing a keyboard at the Jazz & Wine event",
    tall: true,
  },
  {
    src: "/images/projects/yit-gala/yit-gala-2.jpg",
    alt: "A guest laughing at the YIT Gala dinner table",
    tall: false,
  },
  {
    src: "/images/projects/one-year-birthday/one-year-birthday-4.jpg",
    alt: "A toddler at her first birthday cake smash photoshoot",
    tall: true,
  },
  {
    src: "/images/projects/myles-munroe-foundation/myles-munroe-foundation-2.jpg",
    alt: "A speaker at the podium at the Myles Munroe Foundation event",
    tall: false,
  },
  {
    src: "/images/projects/50th-birthday/50th-birthday-3.jpg",
    alt: "Guests at a 50th birthday celebration",
    tall: false,
  },
  {
    src: "/images/projects/jazz-and-wine/jazz-and-wine-4.jpg",
    alt: "Two guests toasting with wine glasses at Jazz & Wine",
    tall: true,
  },
];
