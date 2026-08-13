"use client";

import Image from "next/image";
import MasonryGrid from "@/components/ui/masonry-grid";

const behindTheScenes = [
  { src: "/images/stock/glasshouse-1.jpg", tall: true },
  { src: "/images/stock/low-tide-1.jpg", tall: false },
  { src: "/images/stock/glasshouse-3.jpg", tall: false },
  { src: "/images/stock/north-star-3.jpg", tall: true },
  { src: "/images/stock/afterglow-2.jpg", tall: false },
  { src: "/images/stock/glasshouse-2.jpg", tall: true },
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
