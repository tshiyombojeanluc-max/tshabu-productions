"use client";

import { useState } from "react";
import { GripVertical } from "lucide-react";
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
import { reorderGalleries } from "@/app/dashboard/_actions/galleries";
import { GalleryCard } from "@/app/dashboard/_components/gallery-card";
import { cn } from "@/lib/utils";
import type { Gallery } from "@/lib/supabase/types";

function SortableGalleryCard({ gallery }: { gallery: Gallery }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: gallery.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className={cn("group relative", isDragging && "z-10 opacity-70")}>
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
        className="absolute top-2 left-2 z-10 flex h-7 w-7 cursor-grab items-center justify-center bg-black/50 text-white opacity-0 transition-opacity touch-none group-hover:opacity-100 active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <GalleryCard gallery={gallery} />
    </div>
  );
}

export function GalleryGrid({ galleries }: { galleries: Gallery[] }) {
  const [items, setItems] = useState(galleries);
  // See PhotoGrid for why this resync happens during render rather than an effect.
  const [syncedGalleries, setSyncedGalleries] = useState(galleries);
  if (galleries !== syncedGalleries) {
    setSyncedGalleries(galleries);
    setItems(galleries);
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((g) => g.id === active.id);
    const newIndex = items.findIndex((g) => g.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const next = arrayMove(items, oldIndex, newIndex);
    setItems(next);
    reorderGalleries(next.map((g) => g.id));
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((g) => g.id)} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((gallery) => (
            <SortableGalleryCard key={gallery.id} gallery={gallery} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
