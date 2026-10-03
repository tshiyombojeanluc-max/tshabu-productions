"use client";

import { useState, useTransition } from "react";
import { GripVertical, Trash2, Check } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy, useSortable, arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { bulkDeleteVideos, bulkMoveVideos, deleteVideo, moveVideoToGallery, reorderVideos } from "@/app/dashboard/_actions/videos";
import { ConfirmDeleteButton } from "@/app/dashboard/_components/confirm-delete-button";
import { BulkActionBar } from "@/app/dashboard/_components/bulk-action-bar";
import { VideoDetailsSheet } from "@/app/dashboard/_components/video-details-sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Video } from "@/lib/supabase/types";

function SortableVideo({
  video,
  otherGalleries,
  selected,
  onToggleSelect,
}: {
  video: Video;
  otherGalleries: { id: string; title: string }[];
  selected: boolean;
  onToggleSelect: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: video.id });
  const [pending, startTransition] = useTransition();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative aspect-square overflow-hidden border border-border bg-tshabu-charcoal",
        isDragging && "z-10 opacity-70",
        selected && "ring-2 ring-tshabu-black ring-offset-2"
      )}
    >
      <video
        src={video.video_url}
        poster={video.thumbnail_url ?? undefined}
        muted
        preload="metadata"
        className="h-full w-full object-cover"
      />

      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
        className="absolute top-2 left-2 flex h-7 w-7 cursor-grab items-center justify-center bg-black/50 text-white opacity-0 transition-opacity touch-none group-hover:opacity-100 active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={onToggleSelect}
        aria-label={selected ? "Deselect video" : "Select video"}
        aria-pressed={selected}
        className={cn(
          "absolute top-2 right-2 flex h-7 w-7 items-center justify-center border transition-colors",
          selected
            ? "border-tshabu-black bg-tshabu-black text-white"
            : "border-white/70 bg-black/30 text-transparent opacity-0 hover:bg-black/50 group-hover:opacity-100"
        )}
      >
        <Check className="h-4 w-4" />
      </button>

      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
        <div className="flex gap-1">
          <VideoDetailsSheet video={video} />
          {otherGalleries.length > 0 && (
            <select
              aria-label="Move to another gallery"
              disabled={pending}
              defaultValue=""
              onChange={(e) => {
                const target = e.target.value;
                if (!target) return;
                startTransition(async () => {
                  await moveVideoToGallery(video.id, target);
                });
              }}
              className="h-7 max-w-[7rem] border-0 bg-white/90 px-1 text-xs text-tshabu-black outline-none"
            >
              <option value="" disabled>
                Move to…
              </option>
              {otherGalleries.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.title}
                </option>
              ))}
            </select>
          )}
        </div>
        <ConfirmDeleteButton
          title="Delete video?"
          description="This permanently removes the video from the gallery and from storage."
          onConfirm={() => deleteVideo(video.id)}
          trigger={
            <Button type="button" variant="secondary" size="icon-sm" aria-label="Delete video">
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          }
        />
      </div>
    </div>
  );
}

export function VideoGrid({
  galleryId,
  videos,
  otherGalleries,
}: {
  galleryId: string;
  videos: Video[];
  otherGalleries: { id: string; title: string }[];
}) {
  const [items, setItems] = useState(videos);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  // See PhotoGrid for why this resync happens during render rather than an effect.
  const [syncedVideos, setSyncedVideos] = useState(videos);
  if (videos !== syncedVideos) {
    setSyncedVideos(videos);
    setItems(videos);
    const stillPresent = new Set(videos.map((v) => v.id));
    setSelected((prev) => new Set([...prev].filter((id) => stillPresent.has(id))));
  }

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((v) => v.id === active.id);
    const newIndex = items.findIndex((v) => v.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const next = arrayMove(items, oldIndex, newIndex);
    setItems(next);
    reorderVideos(
      galleryId,
      next.map((v) => v.id)
    );
  };

  return (
    <div>
      <BulkActionBar
        count={selected.size}
        itemNoun="video"
        otherGalleries={otherGalleries}
        onMove={(targetGalleryId) => bulkMoveVideos([...selected], targetGalleryId)}
        onDelete={async () => {
          const result = await bulkDeleteVideos([...selected]);
          if (!result || !("error" in result)) setSelected(new Set());
          return result;
        }}
        onClear={() => setSelected(new Set())}
      />
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((v) => v.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((video) => (
              <SortableVideo
                key={video.id}
                video={video}
                otherGalleries={otherGalleries}
                selected={selected.has(video.id)}
                onToggleSelect={() => toggleSelect(video.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
