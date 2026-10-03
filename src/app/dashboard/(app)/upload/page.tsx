import Link from "next/link";
import { Images } from "lucide-react";
import { listGalleries, requireProfile } from "@/app/dashboard/_lib/data";
import { PageHeader } from "@/app/dashboard/_components/page-header";
import { EmptyState } from "@/app/dashboard/_components/empty-state";
import { UploadFlow } from "@/app/dashboard/_components/upload-flow";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Upload" };

export default async function UploadPage() {
  const [profile, galleries] = await Promise.all([requireProfile(), listGalleries()]);

  return (
    <div>
      <PageHeader title="Upload" description="Choose a gallery, then drag in your photos or videos." />

      {galleries.length === 0 ? (
        <EmptyState
          icon={<Images className="h-10 w-10" />}
          title="Create a gallery first"
          description="You need at least one gallery before you can upload photos or videos."
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
        <UploadFlow galleries={galleries.map((g) => ({ id: g.id, title: g.title }))} userId={profile.id} />
      )}
    </div>
  );
}
