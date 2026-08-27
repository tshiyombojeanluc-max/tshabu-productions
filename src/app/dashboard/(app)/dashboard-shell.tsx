"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Images, ImagePlus, Upload, Settings, LogOut, Menu } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { logout } from "@/app/dashboard/_actions/auth";
import type { Profile } from "@/lib/supabase/types";
import { site } from "@/lib/data";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Galleries", href: "/dashboard/galleries", icon: Images },
  { label: "Photos", href: "/dashboard/photos", icon: ImagePlus },
  { label: "Upload", href: "/dashboard/upload", icon: Upload },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
      {navItems.map((item) => {
        const active = item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 px-3 py-3 text-sm uppercase tracking-[0.15em] text-tshabu-paper/60 transition-colors hover:bg-tshabu-paper/5 hover:text-tshabu-paper",
              active && "bg-tshabu-paper/10 text-tshabu-paper"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarHeader({ profile }: { profile: Profile }) {
  return (
    <div className="flex items-center gap-3 border-b border-tshabu-paper/10 px-6 py-6">
      <Image src="/images/logo.png" alt="" width={36} height={36} className="h-9 w-9 rounded-full" />
      <div className="min-w-0">
        <p className="truncate text-sm font-bold uppercase tracking-[0.15em]">{site.shortName}</p>
        <p className="truncate text-xs text-tshabu-paper/50">{profile.display_name || profile.email}</p>
      </div>
    </div>
  );
}

function SidebarFooter() {
  return (
    <div className="border-t border-tshabu-paper/10 p-3">
      <form action={logout}>
        <Button
          type="submit"
          variant="ghost"
          className="h-auto w-full justify-start gap-3 rounded-none px-3 py-3 text-sm uppercase tracking-[0.15em] text-tshabu-paper/60 hover:bg-tshabu-paper/5 hover:text-tshabu-paper"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </form>
    </div>
  );
}

export function DashboardShell({ profile, children }: { profile: Profile; children: ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="hidden w-64 shrink-0 flex-col bg-tshabu-black text-tshabu-paper md:flex">
        <SidebarHeader profile={profile} />
        <NavLinks pathname={pathname} />
        <SidebarFooter />
      </aside>

      <div className="flex flex-1 flex-col md:min-w-0">
        <header className="flex items-center justify-between border-b border-border bg-tshabu-black px-4 py-4 text-tshabu-paper md:hidden">
          <Link href="/dashboard" className="text-sm font-bold uppercase tracking-[0.2em]">
            {site.shortName} Dashboard
          </Link>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger aria-label="Open menu" className="p-1 text-tshabu-paper">
              <Menu className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent side="left" className="flex w-72 flex-col bg-tshabu-black p-0 text-tshabu-paper">
              <SheetTitle className="sr-only">Dashboard menu</SheetTitle>
              <SidebarHeader profile={profile} />
              <NavLinks pathname={pathname} onNavigate={() => setMobileOpen(false)} />
              <SidebarFooter />
            </SheetContent>
          </Sheet>
        </header>

        <main className="flex-1 px-4 py-8 sm:px-8 sm:py-10 md:px-12 md:py-12">{children}</main>
      </div>
    </div>
  );
}
