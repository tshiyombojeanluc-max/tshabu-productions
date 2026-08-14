import { Reveal } from "@/components/site/reveal";
import { JsonLd } from "@/components/site/json-ld";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { services, site } from "@/lib/data";
import { buildMetadata, breadcrumbJsonLd, absoluteUrl } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Services",
  description:
    "Photography, videography, event coverage and post-production — the services offered by Tshabu Productions in Cape Town.",
  path: "/services",
});

const servicesJsonLd = services.map((service) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: service.title,
  name: `${service.title} — Tshabu Productions`,
  description: service.description,
  provider: { "@id": `${absoluteUrl("/")}#organization` },
  areaServed: { "@type": "City", name: "Cape Town" },
}));

export default function ServicesPage() {
  return (
    <>
      {servicesJsonLd.map((data, i) => (
        <JsonLd key={services[i].id} data={data} />
      ))}
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ])}
      />
      <section className="container-edit pt-40 pb-20 md:pt-48 md:pb-28">
        <Reveal className="max-w-3xl">
          <p className="label-caps mb-4">What We Do</p>
          <h1 className="text-5xl font-semibold uppercase leading-[1.02] tracking-tight sm:text-6xl md:text-7xl">
            Services
          </h1>
          <p className="mt-6 max-w-xl text-tshabu-graphite">
            {site.name} provides photography, videography, event coverage and
            post-production for businesses, schools and individuals across{" "}
            {site.location}.
          </p>
        </Reveal>
      </section>

      <section className="container-edit pb-28 md:pb-40">
        <Accordion className="border-t border-tshabu-graphite/20">
          {services.map((service, i) => (
            <AccordionItem
              key={service.id}
              value={service.id}
              className="!border-b border-tshabu-graphite/20 py-2"
            >
              <Reveal delay={i * 0.05}>
                <AccordionTrigger className="!rounded-none !border-none !py-8 hover:!no-underline focus-visible:!ring-0">
                  <div className="flex w-full items-baseline gap-6 pr-6">
                    <span className="label-caps text-tshabu-graphite">{service.index}</span>
                    <span className="text-2xl font-medium uppercase tracking-tight sm:text-4xl">
                      {service.title}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="!pb-10">
                  <div className="grid grid-cols-1 gap-8 pl-0 sm:grid-cols-2 sm:pl-16">
                    <p className="max-w-md text-base leading-relaxed text-tshabu-graphite">
                      {service.description}
                    </p>
                    <ul className="space-y-2">
                      {service.offerings.map((offering) => (
                        <li key={offering} className="border-b border-tshabu-graphite/10 pb-2 text-sm">
                          {offering}
                        </li>
                      ))}
                    </ul>
                  </div>
                </AccordionContent>
              </Reveal>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </>
  );
}
