import Link from "next/link";
import { Images, ImagePlus, Film, Inbox, Plus, Upload } from "lucide-react";
import { getDashboardStats, requireProfile } from "@/app/dashboard/_lib/data";
import { StatCard } from "@/app/dashboard/_components/stat-card";
import { EmptyState } from "@/app/dashboard/_components/empty-state";
import { GalleryCard } from "@/app/dashboard/_components/gallery-card";
import { LeadCard } from "@/app/dashboard/_components/lead-card";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Overview" };

export default async function DashboardOverviewPage() {
  const [profile, stats] = await Promise.all([requireProfile(), getDashboardStats()]);
  const firstName = (profile.display_name || profile.email).split(" ")[0];

  return (
    <div>
      <p className="label-caps mb-2">Welcome back</p>
      <h1 className="mb-10 text-3xl font-semibold tracking-tight sm:text-4xl">{firstName}</h1>

      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Galleries" value={stats.galleryCount} icon={<Images className="h-8 w-8" />} />
        <StatCard label="Photos" value={stats.photoCount} icon={<ImagePlus className="h-8 w-8" />} />
        <StatCard label="Videos" value={stats.videoCount} icon={<Film className="h-8 w-8" />} />
        <StatCard label="New Enquiries" value={stats.newLeadCount} icon={<Inbox className="h-8 w-8" />} />
      </div>

      <div className="mb-14 flex flex-col gap-3 sm:flex-row">
        <Button
          render={<Link href="/dashboard/galleries/new" />}
          nativeButton={false}
          className="h-auto justify-center gap-2 rounded-none bg-tshabu-black px-6 py-4 text-sm uppercase tracking-[0.15em] text-tshabu-paper hover:bg-tshabu-charcoal"
        >
          <Plus className="h-4 w-4" />
          Create Gallery
        </Button>
        <Button
          render={<Link href="/dashboard/upload" />}
          nativeButton={false}
          variant="outline"
          className="h-auto justify-center gap-2 rounded-none border-tshabu-black px-6 py-4 text-sm uppercase tracking-[0.15em] hover:bg-tshabu-black hover:text-tshabu-paper"
        >
          <Upload className="h-4 w-4" />
          Upload Photos
        </Button>
      </div>

      <div className="mb-6 flex items-baseline justify-between">
        <h2 className="text-lg font-semibold uppercase tracking-tight">Recent Galleries</h2>
        <Link href="/dashboard/galleries" className="label-caps underline underline-offset-4">
          View all →
        </Link>
      </div>

      {stats.recentGalleries.length === 0 ? (
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.recentGalleries.map((gallery) => (
            <GalleryCard key={gallery.id} gallery={gallery} />
          ))}
        </div>
      )}

      <div className="mt-14 mb-6 flex items-baseline justify-between">
        <h2 className="text-lg font-semibold uppercase tracking-tight">Recent Enquiries</h2>
        <Link href="/dashboard/leads" className="label-caps underline underline-offset-4">
          View all →
        </Link>
      </div>

      {stats.recentLeads.length === 0 ? (
        <EmptyState
          icon={<Inbox className="h-10 w-10" />}
          title="No enquiries yet"
          description="Messages sent through your contact form will show up here."
        />
      ) : (
        <div className="space-y-4">
          {stats.recentLeads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </div>
      )}
    </div>
  );
}
