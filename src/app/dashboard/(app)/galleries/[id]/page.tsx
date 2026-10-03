import { notFound } from "next/navigation";
import { getGalleryWithPhotos, listGalleries, requireProfile } from "@/app/dashboard/_lib/data";
import { PageHeader } from "@/app/dashboard/_components/page-header";
import { GalleryForm } from "@/app/dashboard/_components/gallery-form";
import { GalleryCoverUploader } from "@/app/dashboard/_components/gallery-cover-uploader";
import { PhotoUploader } from "@/app/dashboard/_components/photo-uploader";
import { PhotoGrid } from "@/app/dashboard/_components/photo-grid";
import { VideoUploader } from "@/app/dashboard/_components/video-uploader";
import { VideoGrid } from "@/app/dashboard/_components/video-grid";
import { EmptyState } from "@/app/dashboard/_components/empty-state";
import { Images, Film } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getGalleryWithPhotos(id);
  return { title: result?.gallery.title ?? "Gallery" };
}

export default async function GalleryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [profile, result, allGalleries] = await Promise.all([requireProfile(), getGalleryWithPhotos(id), listGalleries()]);

  if (!result) notFound();

  const { gallery, photos, videos } = result;
  const otherGalleries = allGalleries.filter((g) => g.id !== gallery.id).map((g) => ({ id: g.id, title: g.title }));

  return (
    <div className="space-y-16">
      <div>
        <PageHeader title={gallery.title} description="Gallery details and cover image." />
        <div className="max-w-2xl space-y-10">
          <GalleryCoverUploader galleryId={gallery.id} userId={profile.id} currentCover={gallery.cover_image} />
          <GalleryForm gallery={gallery} />
        </div>
      </div>

      <div>
        <h2 className="mb-6 text-lg font-semibold uppercase tracking-tight">Upload Photos</h2>
        <PhotoUploader galleryId={gallery.id} userId={profile.id} />
      </div>

      <div>
        <h2 className="mb-6 text-lg font-semibold uppercase tracking-tight">
          Photos <span className="text-tshabu-graphite">({photos.length})</span>
        </h2>
        {photos.length === 0 ? (
          <EmptyState icon={<Images className="h-10 w-10" />} title="No photos yet" description="Upload photos above to get started." />
        ) : (
          <>
            <p className="mb-4 text-sm text-tshabu-graphite">Drag photos to reorder them — this is the order visitors will see.</p>
            <PhotoGrid galleryId={gallery.id} photos={photos} otherGalleries={otherGalleries} />
          </>
        )}
      </div>

      <div>
        <h2 className="mb-6 text-lg font-semibold uppercase tracking-tight">Upload Videos</h2>
        <VideoUploader galleryId={gallery.id} userId={profile.id} />
      </div>

      <div>
        <h2 className="mb-6 text-lg font-semibold uppercase tracking-tight">
          Videos <span className="text-tshabu-graphite">({videos.length})</span>
        </h2>
        {videos.length === 0 ? (
          <EmptyState icon={<Film className="h-10 w-10" />} title="No videos yet" description="Upload videos above to get started." />
        ) : (
          <>
            <p className="mb-4 text-sm text-tshabu-graphite">Drag videos to reorder them — this is the order visitors will see.</p>
            <VideoGrid galleryId={gallery.id} videos={videos} otherGalleries={otherGalleries} />
          </>
        )}
      </div>
    </div>
  );
}
