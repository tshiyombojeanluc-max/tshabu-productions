"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { VideoRow } from "@/app/dashboard/_components/video-row";
import type { VideoWithGallery } from "@/app/dashboard/_lib/data";

export function VideoSearchGrid({ videos }: { videos: VideoWithGallery[] }) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!q) return videos;
    return videos.filter((v) => (v.title ?? "").toLowerCase().includes(q) || v.gallery_title.toLowerCase().includes(q));
  }, [videos, q]);

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
        <p className="text-sm text-tshabu-graphite">No videos match &ldquo;{query}&rdquo;.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {filtered.map((video) => (
            <VideoRow key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}
