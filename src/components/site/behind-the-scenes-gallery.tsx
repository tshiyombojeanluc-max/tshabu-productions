"use client";

import Image from "next/image";
import MasonryGrid from "@/components/ui/masonry-grid";

const behindTheScenes = [
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

export function BehindTheScenesGallery() {
  return (
    <MasonryGrid
      items={behindTheScenes}
      className="columns-2 md:columns-3"
      gap="1rem"
      renderItem={(item) => (
        <div className={`relative w-full overflow-hidden bg-tshabu-charcoal ${item.tall ? "aspect-[3/4]" : "aspect-[4/3]"}`}>
          <Image
            src={item.src}
            alt={item.alt}
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            className="object-cover"
            loading="lazy"
          />
        </div>
      )}
    />
  );
}
