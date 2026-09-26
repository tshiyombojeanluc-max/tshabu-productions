"use client";

import Image from "next/image";
import MasonryGrid from "@/components/ui/masonry-grid";
import type { BehindTheScenesItem } from "@/lib/behind-the-scenes-defaults";

export function BehindTheScenesGallery({ items }: { items: BehindTheScenesItem[] }) {
  return (
    <MasonryGrid
      items={items}
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
