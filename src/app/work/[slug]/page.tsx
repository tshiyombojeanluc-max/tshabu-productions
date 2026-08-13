import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal, ImageReveal } from "@/components/site/reveal";
import { getAdjacentProjects, getProjectBySlug, projects } from "@/lib/data";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.name,
    description: project.description,
    openGraph: {
      title: `${project.name} — Tshabu Productions`,
      description: project.description,
      images: [{ url: project.coverImage }],
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const { prev, next } = getAdjacentProjects(slug);

  return (
    <article>
      <section className="relative flex h-[100svh] w-full items-end overflow-hidden bg-tshabu-black">
        <Image
          src={project.coverImage}
          alt={`${project.name} — ${project.category}`}
          fill
          priority
          sizes="100vw"
          className="object-cover grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/20" />
        <div className="container-edit relative z-10 flex w-full flex-col gap-6 pb-16 pt-40">
          <p className="label-caps text-tshabu-paper/70">
            {project.category} — {project.year}
          </p>
          <h1 className="text-5xl font-bold uppercase leading-[0.95] tracking-tight text-tshabu-paper sm:text-7xl md:text-8xl">
            {project.name}
          </h1>
        </div>
      </section>

      <section className="container-edit grid grid-cols-1 gap-12 py-20 md:grid-cols-12 md:py-28">
        <Reveal className="md:col-span-4">
          <dl className="space-y-8">
            <div>
              <dt className="label-caps mb-2 text-tshabu-graphite">Client</dt>
              <dd className="text-lg">{project.client}</dd>
            </div>
            <div>
              <dt className="label-caps mb-2 text-tshabu-graphite">Category</dt>
              <dd className="text-lg">{project.category}</dd>
            </div>
            <div>
              <dt className="label-caps mb-2 text-tshabu-graphite">Year</dt>
              <dd className="text-lg">{project.year}</dd>
            </div>
          </dl>
        </Reveal>
        <Reveal delay={0.1} className="md:col-span-8">
          <p className="max-w-2xl text-2xl font-medium leading-relaxed tracking-tight sm:text-3xl">
            {project.description}
          </p>
        </Reveal>
      </section>

      <div className="space-y-6 pb-20 md:pb-28">
        {project.gallery.map((src, i) => (
          <ImageReveal key={src + i} className="container-edit">
            <div className="relative aspect-[16/9] w-full bg-tshabu-charcoal">
              <Image
                src={src}
                alt={`${project.name} production still ${i + 1}`}
                fill
                sizes="100vw"
                className="object-cover grayscale"
              />
            </div>
          </ImageReveal>
        ))}
      </div>

      <section className="container-edit pb-28 md:pb-40">
        <Reveal>
          <p className="label-caps mb-8 text-tshabu-graphite">Credits</p>
          <ul className="grid grid-cols-1 gap-x-8 gap-y-4 border-t border-tshabu-graphite/20 pt-8 sm:grid-cols-2">
            {project.credits.map((credit) => (
              <li key={credit.role} className="flex items-baseline justify-between border-b border-tshabu-graphite/10 pb-4">
                <span className="text-tshabu-graphite">{credit.role}</span>
                <span className="font-medium">{credit.name}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <nav className="grid grid-cols-1 border-t border-tshabu-graphite/20 sm:grid-cols-2">
        <Link
          href={`/work/${prev.slug}`}
          className="group border-b border-tshabu-graphite/20 px-6 py-14 sm:border-b-0 sm:border-r md:px-12"
        >
          <p className="label-caps mb-3 text-tshabu-graphite">← Previous</p>
          <p className="text-2xl font-medium uppercase tracking-tight transition-transform group-hover:-translate-x-1 sm:text-3xl">
            {prev.name}
          </p>
        </Link>
        <Link href={`/work/${next.slug}`} className="group px-6 py-14 text-right md:px-12">
          <p className="label-caps mb-3 text-tshabu-graphite">Next →</p>
          <p className="text-2xl font-medium uppercase tracking-tight transition-transform group-hover:translate-x-1 sm:text-3xl">
            {next.name}
          </p>
        </Link>
      </nav>
    </article>
  );
}
