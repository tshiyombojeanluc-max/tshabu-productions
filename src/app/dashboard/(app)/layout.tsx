import type { Metadata } from "next";
import type { ReactNode } from "react";
import { requireProfile } from "@/app/dashboard/_lib/data";
import { DashboardShell } from "./dashboard-shell";
import { site } from "@/lib/data";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: `%s — ${site.shortName} Dashboard` },
  robots: { index: false, follow: false },
};

export default async function DashboardAppLayout({ children }: { children: ReactNode }) {
  const profile = await requireProfile();
  return <DashboardShell profile={profile}>{children}</DashboardShell>;
}
