import Link from "next/link";
import { OrbitHero } from "@/components/site/orbit-hero";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { ProjectGrid } from "@/components/site/project-grid";
import ScrollAdventure, { type ScrollAdventurePage } from "@/components/ui/animated-scroll";
import { joinLabel, services, site, type Project } from "@/lib/data";
import { getPublishedProjects } from "@/lib/galleries";
import { getSiteImageOverrides } from "@/lib/site-images";
import { resolveSiteImage } from "@/lib/site-image-slots";
import { buildMetadata } from "@/lib/seo";

// The Orbit hero's ring photos — the dashboard's "Desktop Hero Photo 1–10"
// slots (Dashboard → Site Images), each falling back to a shipped photo of
// real client work (see lib/site-image-slots.ts).
const heroPhotoSlots = Array.from({ length: 10 }, (_, i) => `home_stream_${i + 1}`);

// No Request-time APIs (cookies/headers) run in this tree — getFeaturedProjects
// and getSiteImageOverrides both go through the cookie-free public Supabase
// client — so this page can be statically rendered and revalidated hourly
// instead of forced fully-dynamic on every request.
export const revalidate = 3600;

export const metadata = buildMetadata({
  title: "Tshabu Productions — Photography & Videography in Cape Town",
  description:
    "Event photography and film in Cape Town. Conferences, galas and celebrations, photographed and filmed by one team, with same-day previews.",
  path: "/",
});

function buildShowreelPages(projects: Project[]): ScrollAdventurePage[] {
  return projects.slice(0, 4).map((project, i) => {
    const content = {
      heading: joinLabel(project.category, project.year),
      description: project.name,
    };
    return i % 2 === 0
      ? {
          leftBgImage: null,
          rightBgImage: project.coverImage,
          rightImageAlt: joinLabel(project.name, project.category),
          leftContent: content,
          rightContent: null,
        }
      : {
          leftBgImage: project.coverImage,
          leftImageAlt: joinLabel(project.name, project.category),
          rightBgImage: null,
          leftContent: null,
          rightContent: content,
        };
  });
}

export default async function HomePage() {
  const [allProjects, imageOverrides] = await Promise.all([getPublishedProjects(), getSiteImageOverrides()]);
  const featuredProjects = allProjects.filter((p) => p.featured);
  const showreelPages = buildShowreelPages(featuredProjects);
  // The showreel already features the first 4 featured projects, and the
  // grid below used to repeat those exact same 4. Show the next projects in
  // the client's chosen order instead, so the homepage surfaces 8 distinct
  // pieces of work; falls back to the featured set if there aren't enough.
  const showreelSlugs = new Set(featuredProjects.slice(0, 4).map((p) => p.slug));
  const moreProjects = allProjects.filter((p) => !showreelSlugs.has(p.slug)).slice(0, 4);
  const portfolioGridProjects = moreProjects.length > 0 ? moreProjects : featuredProjects.slice(0, 4);
  const heroPhotos = heroPhotoSlots.map((key) => ({ src: resolveSiteImage(imageOverrides, key) }));

  return (
    <>
      <OrbitHero
        photos={heroPhotos}
        eyebrow={site.name}
        headline={["Event photography", "& film in Cape Town"]}
        body="Conferences, galas and celebrations, photographed and filmed by one team, with same-day previews."
        ctaText="Get a Quote →"
        ctaHref="/contact"
      />

      <section className="container-edit py-16 md:py-40">
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
            Get a Quote →
          </Link>
        </Reveal>
      </section>

      {featuredProjects.length > 0 && (
        <>
          <section id="selected-work">
            <div className="container-edit mb-16">
              <SectionHeading label="Selected Work" title="Recent Productions" />
            </div>
            <ScrollAdventure pages={showreelPages} />
          </section>

          <section className="container-edit py-28 md:py-40">
            <div className="mb-16 flex items-end justify-between gap-6">
              <SectionHeading label="Portfolio" title="More Work" />
              <Reveal>
                <Link href="/work" className="label-caps hidden shrink-0 whitespace-nowrap underline underline-offset-4 sm:block">
                  View all work →
                </Link>
              </Reveal>
            </div>
            <ProjectGrid projects={portfolioGridProjects} />
            <Reveal className="mt-12 sm:hidden">
              <Link href="/work" className="label-caps underline underline-offset-4">
                View all work →
              </Link>
            </Reveal>
          </section>
        </>
      )}

      <section className="bg-tshabu-black py-28 text-tshabu-paper md:py-40">
        <div className="container-edit">
          <SectionHeading dark label="What We Do" title="Services" className="mb-16" />
          <ul>
            {services.map((service, i) => (
              // <li> must be the <ul>'s direct child (Reveal renders a
              // <div>), so the reveal animation now sits inside the item.
              <li key={service.id} className="border-t border-tshabu-paper/15 last:border-b">
                <Reveal
                  delay={i * 0.05}
                  className="flex flex-col gap-2 py-8 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-baseline gap-6">
                    <span className="label-caps text-tshabu-paper/60!">{service.index}</span>
                    <h3 className="text-2xl font-medium sm:text-3xl">{service.title}</h3>
                  </div>
                  <p className="text-tshabu-paper/60 sm:max-w-sm sm:text-right">{service.summary}</p>
                </Reveal>
              </li>
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
