import type { Metadata } from "next";
import { Reveal } from "@/components/site/reveal";
import { ContactForm } from "@/components/site/contact-form";
import { site, socialLinks } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Tshabu Productions to book photography, videography or event coverage in Cape Town.",
};

export default function ContactPage() {
  return (
    <section className="container-edit grid grid-cols-1 gap-16 pt-40 pb-28 md:grid-cols-12 md:pt-48 md:pb-40">
      <div className="md:col-span-5">
        <Reveal>
          <p className="label-caps mb-6">Get in Touch</p>
          <h1 className="text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl">
            Let&rsquo;s tell your story.
          </h1>
          <p className="mt-8 max-w-sm text-tshabu-graphite">
            Have an event, brand or project in mind? Tell us about it and let&rsquo;s book you in.
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mt-16 space-y-8 border-t border-tshabu-graphite/20 pt-10">
          <div>
            <p className="label-caps mb-2 text-tshabu-graphite">Email</p>
            <a href={`mailto:${site.email}`} className="text-lg hover:underline">
              {site.email}
            </a>
          </div>
          <div>
            <p className="label-caps mb-2 text-tshabu-graphite">Phone</p>
            <a href={`tel:${site.phone}`} className="text-lg hover:underline">
              {site.phone}
            </a>
          </div>
          <div>
            <p className="label-caps mb-2 text-tshabu-graphite">Location</p>
            <p className="text-lg">{site.location}</p>
          </div>
          <div>
            <p className="label-caps mb-3 text-tshabu-graphite">Follow</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {socialLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm underline underline-offset-4"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.1} className="md:col-span-7">
        <ContactForm />
      </Reveal>
    </section>
  );
}
