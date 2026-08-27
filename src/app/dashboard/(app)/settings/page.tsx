import { requireProfile } from "@/app/dashboard/_lib/data";
import { PageHeader } from "@/app/dashboard/_components/page-header";
import { AvatarUploader } from "@/app/dashboard/_components/avatar-uploader";
import { SettingsForm } from "@/app/dashboard/_components/settings-form";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const profile = await requireProfile();

  return (
    <div>
      <PageHeader title="Settings" description="Your account details." />
      <div className="max-w-md space-y-10">
        <AvatarUploader userId={profile.id} currentAvatar={profile.avatar_url} />
        <SettingsForm profile={profile} />
      </div>
    </div>
  );
}
