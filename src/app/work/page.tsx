import { ProjectGrid } from "@/components/site/project-grid";
import { Reveal } from "@/components/site/reveal";
import { JsonLd } from "@/components/site/json-ld";
import { getPublishedProjects } from "@/lib/galleries";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Work",
  description:
    "Selected photography, videography and event coverage from Tshabu Productions in Cape Town — real events, real clients.",
  path: "/work",
});

export default async function WorkPage() {
  const projects = await getPublishedProjects();

  return (
    <section className="container-edit pt-40 pb-28 md:pt-48 md:pb-40">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Work", path: "/work" },
        ])}
      />
      <Reveal className="mb-20 max-w-3xl">
        <p className="label-caps mb-4">Selected Work</p>
        <h1 className="text-5xl font-semibold uppercase leading-[1.02] tracking-tight sm:text-6xl md:text-7xl">
          Portfolio
        </h1>
      </Reveal>
      {projects.length > 0 ? (
        <ProjectGrid projects={projects} />
      ) : (
        <p className="text-tshabu-graphite">New work is on its way — check back soon.</p>
      )}
    </section>
  );
}
