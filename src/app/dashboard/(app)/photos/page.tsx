import Link from "next/link";
import { ImagePlus } from "lucide-react";
import { listAllPhotos } from "@/app/dashboard/_lib/data";
import { PageHeader } from "@/app/dashboard/_components/page-header";
import { EmptyState } from "@/app/dashboard/_components/empty-state";
import { PhotoSearchGrid } from "@/app/dashboard/_components/photo-search-grid";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Photos" };

export default async function AllPhotosPage() {
  const photos = await listAllPhotos();

  return (
    <div>
      <PageHeader title="Photos" description="Every photo across all of your galleries." />

      {photos.length === 0 ? (
        <EmptyState
          icon={<ImagePlus className="h-10 w-10" />}
          title="No photos yet"
          description="Upload photos to a gallery to see them here."
          action={
            <Button
              render={<Link href="/dashboard/upload" />}
              nativeButton={false}
              className="h-auto rounded-none bg-tshabu-black px-6 py-3 text-sm uppercase tracking-[0.15em] text-tshabu-paper hover:bg-tshabu-charcoal"
            >
              Upload Photos
            </Button>
          }
        />
      ) : (
        <PhotoSearchGrid photos={photos} />
      )}
    </div>
  );
}
