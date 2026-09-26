/**
 * Registry of every "fixed" photo on the public site that the client can
 * replace from the dashboard (Dashboard → Site Images), as opposed to work
 * photos, which already go through Galleries/Photos.
 *
 * Each slot's `key` is what's stored in the `site_images` table. Adding a
 * new replaceable image anywhere on the site means: add a slot here, then
 * call `resolveSiteImage(overrides, key)` wherever that image is rendered
 * instead of hardcoding the file path.
 */
export type SiteImageSlot = {
  key: string;
  label: string;
  group: string;
  /** Falls back to this repo-committed file when no override has been uploaded. */
  defaultSrc: string;
};

export const SITE_IMAGE_SLOTS: SiteImageSlot[] = [
  { key: "logo", label: "Logo", group: "Branding", defaultSrc: "/images/logo.png" },

  { key: "home_hero_media", label: "Mobile Hero — Foreground", group: "Homepage Hero", defaultSrc: "/images/hero/camera-artistic.jpg" },
  { key: "home_hero_background", label: "Mobile Hero — Background", group: "Homepage Hero", defaultSrc: "/images/hero/lens-dark.jpg" },
  { key: "home_stream_1", label: "Desktop Hero Photo 1", group: "Homepage Hero", defaultSrc: "/images/projects/yit-gala/yit-gala-1.jpg" },
  { key: "home_stream_2", label: "Desktop Hero Photo 2", group: "Homepage Hero", defaultSrc: "/images/projects/one-year-birthday/one-year-birthday-4.jpg" },
  { key: "home_stream_3", label: "Desktop Hero Photo 3", group: "Homepage Hero", defaultSrc: "/images/projects/myles-munroe-foundation/myles-munroe-foundation-1.jpg" },
  { key: "home_stream_4", label: "Desktop Hero Photo 4", group: "Homepage Hero", defaultSrc: "/images/projects/jazz-and-wine/jazz-and-wine-2.jpg" },
  { key: "home_stream_5", label: "Desktop Hero Photo 5", group: "Homepage Hero", defaultSrc: "/images/projects/50th-birthday/50th-birthday-3.jpg" },
  { key: "home_stream_6", label: "Desktop Hero Photo 6", group: "Homepage Hero", defaultSrc: "/images/projects/yit-gala/yit-gala-6.jpg" },
  { key: "home_stream_7", label: "Desktop Hero Photo 7", group: "Homepage Hero", defaultSrc: "/images/projects/jazz-and-wine/jazz-and-wine-6.jpg" },
  { key: "home_stream_8", label: "Desktop Hero Photo 8", group: "Homepage Hero", defaultSrc: "/images/projects/myles-munroe-foundation/myles-munroe-foundation-3.jpg" },
  { key: "home_stream_9", label: "Desktop Hero Photo 9", group: "Homepage Hero", defaultSrc: "/images/projects/one-year-birthday/one-year-birthday-1.jpg" },
  { key: "home_stream_10", label: "Desktop Hero Photo 10", group: "Homepage Hero", defaultSrc: "/images/projects/50th-birthday/50th-birthday-1.jpg" },

  { key: "about_hero", label: "About Page Photo", group: "About Page", defaultSrc: "/images/projects/one-year-birthday/one-year-birthday-4.jpg" },

  { key: "bts_1", label: "Behind the Scenes Photo 1", group: "Behind the Scenes (About Page)", defaultSrc: "/images/projects/jazz-and-wine/jazz-and-wine-6.jpg" },
  { key: "bts_2", label: "Behind the Scenes Photo 2", group: "Behind the Scenes (About Page)", defaultSrc: "/images/projects/yit-gala/yit-gala-2.jpg" },
  { key: "bts_3", label: "Behind the Scenes Photo 3", group: "Behind the Scenes (About Page)", defaultSrc: "/images/projects/one-year-birthday/one-year-birthday-4.jpg" },
  { key: "bts_4", label: "Behind the Scenes Photo 4", group: "Behind the Scenes (About Page)", defaultSrc: "/images/projects/myles-munroe-foundation/myles-munroe-foundation-2.jpg" },
  { key: "bts_5", label: "Behind the Scenes Photo 5", group: "Behind the Scenes (About Page)", defaultSrc: "/images/projects/50th-birthday/50th-birthday-3.jpg" },
  { key: "bts_6", label: "Behind the Scenes Photo 6", group: "Behind the Scenes (About Page)", defaultSrc: "/images/projects/jazz-and-wine/jazz-and-wine-4.jpg" },
];

export const SITE_IMAGE_SLOT_BY_KEY: Record<string, SiteImageSlot> = Object.fromEntries(
  SITE_IMAGE_SLOTS.map((slot) => [slot.key, slot])
);

/** The URL to render for a slot: the client's uploaded override if one exists, else the shipped default. */
export function resolveSiteImage(overrides: Record<string, string>, key: string): string {
  return overrides[key] ?? SITE_IMAGE_SLOT_BY_KEY[key]?.defaultSrc ?? "";
}
