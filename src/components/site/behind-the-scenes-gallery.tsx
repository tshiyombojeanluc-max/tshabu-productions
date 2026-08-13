"use client";

import Image from "next/image";
import MasonryGrid from "@/components/ui/masonry-grid";

const behindTheScenes = [
  { src: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=900&auto=format&fit=crop&q=80", tall: true },
  { src: "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=900&auto=format&fit=crop&q=80", tall: false },
  { src: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=900&auto=format&fit=crop&q=80", tall: false },
  { src: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=900&auto=format&fit=crop&q=80", tall: true },
  { src: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=900&auto=format&fit=crop&q=80", tall: false },
  { src: "https://images.unsplash.com/photo-1493514789931-586cb221d7a7?w=900&auto=format&fit=crop&q=80", tall: true },
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
            alt="Behind the scenes at a Tshabu Productions shoot"
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            className="object-cover grayscale"
            loading="lazy"
          />
        </div>
      )}
    />
  );
}
