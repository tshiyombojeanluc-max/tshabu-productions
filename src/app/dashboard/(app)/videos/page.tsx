import Link from "next/link";
import { Film } from "lucide-react";
import { listAllVideos } from "@/app/dashboard/_lib/data";
import { PageHeader } from "@/app/dashboard/_components/page-header";
import { EmptyState } from "@/app/dashboard/_components/empty-state";
import { VideoRow } from "@/app/dashboard/_components/video-row";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Videos" };

export default async function AllVideosPage() {
  const videos = await listAllVideos();

  return (
    <div>
      <PageHeader title="Videos" description="Every video across all of your galleries." />

      {videos.length === 0 ? (
        <EmptyState
          icon={<Film className="h-10 w-10" />}
          title="No videos yet"
          description="Upload videos to a gallery to see them here."
          action={
            <Button
              render={<Link href="/dashboard/upload" />}
              nativeButton={false}
              className="h-auto rounded-none bg-tshabu-black px-6 py-3 text-sm uppercase tracking-[0.15em] text-tshabu-paper hover:bg-tshabu-charcoal"
            >
              Upload Videos
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {videos.map((video) => (
            <VideoRow key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}
