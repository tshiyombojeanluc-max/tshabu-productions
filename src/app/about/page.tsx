import type { Metadata } from "next";
import { Globe, ImageIcon, Video } from "lucide-react";
import { MinimalistHero } from "@/components/ui/minimalist-hero";
import { BehindTheScenesGallery } from "@/components/site/behind-the-scenes-gallery";
import { Reveal, ImageReveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { approachSteps, navLinks, site } from "@/lib/data";

export const metadata: Metadata = {
  title: "About",
  description:
    "Tshabu Productions is a Cape Town photography and videography studio built on storytelling, visual quality and disciplined craft.",
};

export default function AboutPage() {
  return (
    <>
      <MinimalistHero
        hideHeader
        logoText={site.shortName}
        navLinks={navLinks}
        mainText="Tshabu Productions is a Cape Town photography and videography studio. We partner with businesses, schools and individuals to build visual stories shaped by discipline, patience and a clear point of view."
        readMoreLink="/work"
        imageSrc="/images/stock/about-portrait.jpg"
        imageAlt="Portrait of a Tshabu Productions photographer on set"
        overlayText={{ part1: "We capture.", part2: "We create." }}
        socialLinks={[
          { icon: <Globe className="h-5 w-5" />, href: "https://www.facebook.com/tshabu.elie" },
          { icon: <ImageIcon className="h-5 w-5" />, href: "https://www.instagram.com/tshabuproductions" },
          { icon: <Video className="h-5 w-5" />, href: "https://www.tiktok.com/@tshabu.production" },
        ]}
        locationText={site.location}
        className="pt-20"
      />

      <section className="container-edit py-28 md:py-40">
        <Reveal>
          <p className="max-w-3xl text-4xl font-medium uppercase leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
            We tell your story.
          </p>
        </Reveal>
      </section>

      <section className="bg-tshabu-charcoal py-28 text-tshabu-paper md:py-36">
        <div className="container-edit">
          <SectionHeading dark label="Our Approach" title="How We Work" className="mb-16" />
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {approachSteps.map((step, i) => (
              <Reveal key={step.index} delay={i * 0.08}>
                <p className="mb-6 text-sm text-tshabu-paper/40">{step.index}</p>
                <h3 className="mb-3 text-2xl font-medium uppercase tracking-tight">{step.title}</h3>
                <p className="text-tshabu-paper/60">{step.description}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container-edit py-28 md:py-40">
        <SectionHeading label="Behind the Scenes" title="On Set" className="mb-16" />
        <ImageReveal>
          <BehindTheScenesGallery />
        </ImageReveal>
      </section>
    </>
  );
}
