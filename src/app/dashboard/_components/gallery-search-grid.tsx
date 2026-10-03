"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { GalleryGrid } from "@/app/dashboard/_components/gallery-grid";
import { GalleryCard } from "@/app/dashboard/_components/gallery-card";
import type { Gallery } from "@/lib/supabase/types";

export function GallerySearchGrid({ galleries }: { galleries: Gallery[] }) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!q) return galleries;
    return galleries.filter((g) =>
      [g.title, g.category, g.client_name].some((field) => (field ?? "").toLowerCase().includes(q))
    );
  }, [galleries, q]);

  return (
    <div>
      <Input
        type="search"
        placeholder="Search by title, category or client…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mb-6 max-w-sm rounded-none"
      />
      {q ? (
        filtered.length === 0 ? (
          <p className="text-sm text-tshabu-graphite">No galleries match &ldquo;{query}&rdquo;.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((gallery) => (
              <GalleryCard key={gallery.id} gallery={gallery} />
            ))}
          </div>
        )
      ) : (
        <>
          {/* Drag-to-reorder only makes sense against the full, unfiltered list — reordering a
              filtered subset can't map cleanly back onto the other items' positions. */}
          <p className="mb-4 text-sm text-tshabu-graphite">
            Drag galleries to reorder them — this is the order visitors see on /work.
          </p>
          <GalleryGrid galleries={galleries} />
        </>
      )}
    </div>
  );
}
