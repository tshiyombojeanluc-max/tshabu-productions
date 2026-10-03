"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

/** Shared selection toolbar for PhotoGrid/VideoGrid — same shape, different item noun and actions. */
export function BulkActionBar({
  count,
  itemNoun,
  otherGalleries,
  onMove,
  onDelete,
  onClear,
}: {
  count: number;
  itemNoun: string;
  otherGalleries: { id: string; title: string }[];
  onMove: (galleryId: string) => Promise<{ error: string } | void>;
  onDelete: () => Promise<{ error: string } | void>;
  onClear: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (count === 0) return null;

  const plural = count === 1 ? itemNoun : `${itemNoun}s`;

  return (
    <div className="sticky top-0 z-20 mb-4 flex flex-wrap items-center gap-3 border border-tshabu-black bg-tshabu-black px-4 py-3 text-tshabu-paper">
      <p className="text-sm">
        {count} {plural} selected
      </p>
      <div className="ml-auto flex flex-wrap items-center gap-2">
        {otherGalleries.length > 0 && (
          <select
            aria-label={`Move selected ${itemNoun}s to…`}
            disabled={pending}
            defaultValue=""
            onChange={(e) => {
              const target = e.target.value;
              if (!target) return;
              setError(null);
              startTransition(async () => {
                const result = await onMove(target);
                if (result && "error" in result) setError(result.error);
              });
              e.target.value = "";
            }}
            className="h-8 border-0 bg-white/90 px-2 text-xs text-tshabu-black outline-none"
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
        <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <AlertDialogTrigger
            render={
              <Button type="button" variant="secondary" size="sm" className="h-8 gap-1.5 rounded-none">
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </Button>
            }
          />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete {count} {plural}?</AlertDialogTitle>
              <AlertDialogDescription>
                This permanently removes {count === 1 ? `this ${itemNoun}` : `these ${itemNoun}s`} and their files from
                storage.
              </AlertDialogDescription>
            </AlertDialogHeader>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            <AlertDialogFooter>
              <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
              <Button
                type="button"
                variant="destructive"
                className="h-auto rounded-none px-6 py-3"
                disabled={pending}
                onClick={() => {
                  setError(null);
                  startTransition(async () => {
                    const result = await onDelete();
                    if (result && "error" in result) {
                      setError(result.error);
                      return;
                    }
                    setConfirmOpen(false);
                  });
                }}
              >
                {pending ? "Deleting…" : "Delete"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 rounded-none text-tshabu-paper hover:bg-tshabu-paper/10 hover:text-tshabu-paper"
          onClick={onClear}
          disabled={pending}
        >
          Clear
        </Button>
      </div>
    </div>
  );
}
