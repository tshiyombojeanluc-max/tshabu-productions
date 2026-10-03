import Link from "next/link";
import { Images, Plus } from "lucide-react";
import { listGalleries } from "@/app/dashboard/_lib/data";
import { PageHeader } from "@/app/dashboard/_components/page-header";
import { EmptyState } from "@/app/dashboard/_components/empty-state";
import { GallerySearchGrid } from "@/app/dashboard/_components/gallery-search-grid";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Galleries" };

export default async function GalleriesPage() {
  const galleries = await listGalleries();

  return (
    <div>
      <PageHeader
        title="Galleries"
        description="Create, edit and publish the galleries visitors see on your website."
        action={
          <Button
            render={<Link href="/dashboard/galleries/new" />}
            nativeButton={false}
            className="h-auto gap-2 rounded-none bg-tshabu-black px-6 py-3 text-sm uppercase tracking-[0.15em] text-tshabu-paper hover:bg-tshabu-charcoal"
          >
            <Plus className="h-4 w-4" />
            Create Gallery
          </Button>
        }
      />

      {galleries.length === 0 ? (
        <EmptyState
          icon={<Images className="h-10 w-10" />}
          title="No galleries yet"
          description="Create your first gallery to start uploading photos."
          action={
            <Button
              render={<Link href="/dashboard/galleries/new" />}
            nativeButton={false}
              className="h-auto rounded-none bg-tshabu-black px-6 py-3 text-sm uppercase tracking-[0.15em] text-tshabu-paper hover:bg-tshabu-charcoal"
            >
              Create Gallery
            </Button>
          }
        />
      ) : (
        <GallerySearchGrid galleries={galleries} />
      )}
    </div>
  );
}
