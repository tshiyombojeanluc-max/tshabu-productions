import Link from "next/link";
import { navLinks, site, socialLinks } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="bg-tshabu-black text-tshabu-paper">
      <div className="container-edit border-b border-tshabu-paper/10 py-20 md:py-28">
        <p className="label-caps mb-6 text-tshabu-paper/50">Let&rsquo;s tell your story</p>
        <Link
          href="/contact"
          className="block text-4xl font-semibold leading-tight tracking-tight sm:text-6xl md:text-7xl"
        >
          Book your session&nbsp;
          <span className="inline-block transition-transform group-hover:translate-x-2">→</span>
        </Link>
      </div>

      <div className="container-edit grid grid-cols-2 gap-10 py-14 text-sm md:grid-cols-4">
        <div className="min-w-0">
          <p className="label-caps mb-4 text-tshabu-paper/50">Studio</p>
          <p className="text-tshabu-paper/80">{site.name}</p>
          <p className="mt-1 text-tshabu-paper/50">{site.location}</p>
        </div>

        <div className="min-w-0">
          <p className="label-caps mb-4 text-tshabu-paper/50">Contact</p>
          <a href={`mailto:${site.email}`} className="block break-words text-tshabu-paper/80 hover:text-tshabu-paper">
            {site.email}
          </a>
          <a href={`tel:${site.phone}`} className="mt-1 block text-tshabu-paper/50 hover:text-tshabu-paper/80">
            {site.phone}
          </a>
        </div>

        <div className="min-w-0">
          <p className="label-caps mb-4 text-tshabu-paper/50">Navigate</p>
          <ul className="space-y-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-tshabu-paper/80 hover:text-tshabu-paper">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-0">
          <p className="label-caps mb-4 text-tshabu-paper/50">Follow</p>
          <ul className="space-y-1">
            {socialLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-tshabu-paper/80 hover:text-tshabu-paper"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container-edit flex flex-col items-start justify-between gap-2 border-t border-tshabu-paper/10 py-6 text-xs text-tshabu-paper/40 sm:flex-row sm:items-center">
        <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
        <p>Film &middot; Video &middot; Creative Production</p>
      </div>
    </footer>
  );
}
