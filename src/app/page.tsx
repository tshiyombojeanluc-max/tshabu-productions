import Link from "next/link";
import { MinimalistHero } from "@/components/ui/minimalist-hero";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { ProjectGrid } from "@/components/site/project-grid";
import ScrollAdventure, { type ScrollAdventurePage } from "@/components/ui/animated-scroll";
import type { StreamImage } from "@/components/ui/image-stream-hero";
import { featuredProjects, navLinks, services, site } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

// A curated spread of real client photos across all 5 projects, cycled
// through the hero's animated corridor.
const heroStreamImages: StreamImage[] = [
  { src: "/images/projects/yit-gala/yit-gala-1.jpg", alt: "Guests at the YIT Gala dinner table" },
  { src: "/images/projects/one-year-birthday/one-year-birthday-4.jpg", alt: "A toddler at her first birthday cake smash" },
  { src: "/images/projects/myles-munroe-foundation/myles-munroe-foundation-1.jpg", alt: "A speaker at the Myles Munroe Foundation event" },
  { src: "/images/projects/jazz-and-wine/jazz-and-wine-2.jpg", alt: "Guests at the Jazz & Wine event" },
  { src: "/images/projects/50th-birthday/50th-birthday-3.jpg", alt: "Guests at a 50th birthday celebration" },
  { src: "/images/projects/yit-gala/yit-gala-6.jpg", alt: "A guest laughing at the YIT Gala" },
  { src: "/images/projects/jazz-and-wine/jazz-and-wine-6.jpg", alt: "A musician performing at Jazz & Wine" },
  { src: "/images/projects/myles-munroe-foundation/myles-munroe-foundation-3.jpg", alt: "A speaker at the Myles Munroe Foundation event" },
  { src: "/images/projects/one-year-birthday/one-year-birthday-1.jpg", alt: "A first birthday photoshoot" },
  { src: "/images/projects/50th-birthday/50th-birthday-1.jpg", alt: "A 50th birthday celebration" },
];

export const metadata = buildMetadata({
  title: "Tshabu Productions — Photography & Videography in Cape Town",
  description:
    "Tshabu Productions creates timeless photography and cinematic videography for events, brands and businesses in Cape Town. We don't just take photos or film videos — we tell your story.",
  path: "/",
});

const showreelPages: ScrollAdventurePage[] = featuredProjects.slice(0, 4).map((project, i) => {
  const content = {
    heading: `${project.category} — ${project.year}`,
    description: project.name,
  };
  return i % 2 === 0
    ? {
        leftBgImage: null,
        rightBgImage: project.coverImage,
        rightImageAlt: `${project.name} — ${project.category}`,
        leftContent: content,
        rightContent: null,
      }
    : {
        leftBgImage: project.coverImage,
        leftImageAlt: `${project.name} — ${project.category}`,
        rightBgImage: null,
        leftContent: null,
        rightContent: content,
      };
});

export default function HomePage() {
  return (
    <>
      <h1 className="sr-only">
        Photography &amp; Videography Production Company in Cape Town
      </h1>
      <MinimalistHero
        hideHeader
        logoText={site.shortName}
        navLinks={navLinks}
        mainText="Photography · Videography · Storytelling. Timeless photo and cinematic video for events, brands and businesses in Cape Town."
        readMoreLink="/work"
        ctaText="Book Your Session →"
        ctaLink="/contact"
        watermarkText={["Tshabu", "Productions"]}
        socialLinks={[]}
        locationText={site.location}
        className="pt-20"
        streamImages={heroStreamImages}
      />

      <section className="container-edit py-28 md:py-40">
        <Reveal>
          <p className="max-w-4xl text-4xl font-medium leading-[1.15] tracking-tight sm:text-5xl md:text-6xl">
            We don&rsquo;t just take photos or film videos. We tell your story.
          </p>
        </Reveal>
        <Reveal delay={0.15} className="mt-10 max-w-xl">
          <p className="text-base leading-relaxed text-tshabu-graphite">
            Tshabu Productions is a Cape Town photography and videography studio. We help
            businesses, schools and individuals be remembered through powerful photo and video
            storytelling — for events, brands and everything in between.
          </p>
        </Reveal>
        <Reveal delay={0.25} className="mt-10">
          <Link
            href="/contact"
            className="inline-block bg-tshabu-black px-8 py-4 text-sm uppercase tracking-[0.2em] text-tshabu-paper transition-colors hover:bg-tshabu-charcoal"
          >
            Book Your Session →
          </Link>
        </Reveal>
      </section>

      <section id="selected-work">
        <div className="container-edit mb-16">
          <SectionHeading label="Selected Work" title="Recent Productions" />
        </div>
        <ScrollAdventure pages={showreelPages} />
      </section>

      <section className="container-edit py-28 md:py-40">
        <div className="mb-16 flex items-end justify-between gap-6">
          <SectionHeading label="Portfolio" title="Full Portfolio" />
          <Reveal>
            <Link href="/work" className="label-caps hidden shrink-0 whitespace-nowrap underline underline-offset-4 sm:block">
              View all work →
            </Link>
          </Reveal>
        </div>
        <ProjectGrid projects={featuredProjects.slice(0, 4)} />
        <Reveal className="mt-12 sm:hidden">
          <Link href="/work" className="label-caps underline underline-offset-4">
            View all work →
          </Link>
        </Reveal>
      </section>

      <section className="bg-tshabu-black py-28 text-tshabu-paper md:py-40">
        <div className="container-edit">
          <SectionHeading dark label="What We Do" title="Services" className="mb-16" />
          <ul>
            {services.map((service, i) => (
              <Reveal key={service.id} delay={i * 0.05}>
                <li className="flex flex-col gap-2 border-t border-tshabu-paper/15 py-8 last:border-b sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-baseline gap-6">
                    <span className="label-caps text-tshabu-paper/40">{service.index}</span>
                    <h3 className="text-2xl font-medium sm:text-3xl">{service.title}</h3>
                  </div>
                  <p className="text-tshabu-paper/60 sm:max-w-sm sm:text-right">{service.summary}</p>
                </li>
              </Reveal>
            ))}
          </ul>
          <Reveal delay={0.2} className="mt-12">
            <Link href="/services" className="label-caps underline underline-offset-4">
              More about our services →
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
