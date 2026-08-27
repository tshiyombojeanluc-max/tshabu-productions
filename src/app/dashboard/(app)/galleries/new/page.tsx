import { PageHeader } from "@/app/dashboard/_components/page-header";
import { GalleryForm } from "@/app/dashboard/_components/gallery-form";

export const metadata = { title: "New Gallery" };

export default function NewGalleryPage() {
  return (
    <div>
      <PageHeader title="Create Gallery" description="You can add photos once the gallery is created." />
      <GalleryForm />
    </div>
  );
}
