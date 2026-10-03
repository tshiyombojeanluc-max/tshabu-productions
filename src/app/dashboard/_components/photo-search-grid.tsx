"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { PhotoRow } from "@/app/dashboard/_components/photo-row";
import type { PhotoWithGallery } from "@/app/dashboard/_lib/data";

export function PhotoSearchGrid({ photos }: { photos: PhotoWithGallery[] }) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!q) return photos;
    return photos.filter((p) => (p.title ?? "").toLowerCase().includes(q) || p.gallery_title.toLowerCase().includes(q));
  }, [photos, q]);

  return (
    <div>
      <Input
        type="search"
        placeholder="Search by title or gallery…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mb-6 max-w-sm rounded-none"
      />
      {filtered.length === 0 ? (
        <p className="text-sm text-tshabu-graphite">No photos match &ldquo;{query}&rdquo;.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {filtered.map((photo) => (
            <PhotoRow key={photo.id} photo={photo} />
          ))}
        </div>
      )}
    </div>
  );
}
