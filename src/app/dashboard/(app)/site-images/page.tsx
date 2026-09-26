import { requireProfile } from "@/app/dashboard/_lib/data";
import { PageHeader } from "@/app/dashboard/_components/page-header";
import { SiteImageUploader } from "@/app/dashboard/_components/site-image-uploader";
import { SITE_IMAGE_SLOTS } from "@/lib/site-image-slots";
import { getSiteImageOverrides } from "@/lib/site-images";

export const metadata = { title: "Site Images" };

function groupSlots() {
  const groups = new Map<string, typeof SITE_IMAGE_SLOTS>();
  for (const slot of SITE_IMAGE_SLOTS) {
    const list = groups.get(slot.group) ?? [];
    list.push(slot);
    groups.set(slot.group, list);
  }
  return groups;
}

export default async function SiteImagesPage() {
  const [profile, overrides] = await Promise.all([requireProfile(), getSiteImageOverrides()]);
  const groups = groupSlots();

  return (
    <div>
      <PageHeader
        title="Site Images"
        description="Replace any fixed photo on the public site — logo, hero images, about page — without touching code. Work photos are managed separately under Galleries."
      />
      <div className="max-w-2xl space-y-12">
        {Array.from(groups.entries()).map(([group, slots]) => (
          <div key={group}>
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-tshabu-graphite">{group}</h2>
            <div className="space-y-6">
              {slots.map((slot) => (
                <SiteImageUploader key={slot.key} slot={slot} userId={profile.id} currentUrl={overrides[slot.key] ?? null} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
