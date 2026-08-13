"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { navLinks, site } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 mix-blend-difference">
        <nav className="container-edit flex items-center justify-between py-6 text-tshabu-white">
          <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-3">
            <span aria-hidden="true" className="h-9 w-9 sm:h-10 sm:w-10" />
            <span className="hidden text-sm font-bold uppercase tracking-[0.2em] sm:inline">
              {site.name}
            </span>
          </Link>

          <div className="hidden items-center gap-10 md:flex">
            {navLinks.map((link) => {
              const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "label-caps text-tshabu-white/70 transition-colors hover:text-tshabu-white",
                    active && "text-tshabu-white"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="md:hidden"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>
      </header>

      {/* Logo painted on its own unblended layer — mix-blend-difference above
          would otherwise flatten its black/white artwork against the page. */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[51]">
        <div className="container-edit flex items-center py-6">
          <Link href="/" onClick={() => setOpen(false)} className="pointer-events-auto">
            <Image
              src="/images/logo.png"
              alt={site.name}
              width={40}
              height={40}
              priority
              className="h-9 w-9 rounded-full sm:h-10 sm:w-10"
            />
          </Link>
        </div>
      </div>

      <div
        className={cn(
          "fixed inset-0 z-40 flex flex-col justify-center bg-tshabu-black text-tshabu-paper transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden",
          open ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <div className="container-edit flex flex-col gap-6">
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              style={{ transitionDelay: `${i * 40}ms` }}
              className="text-4xl font-semibold uppercase tracking-tight"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
