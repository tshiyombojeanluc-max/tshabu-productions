import Image from "next/image";
import type { Metadata } from "next";
import { site } from "@/lib/data";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  // No need to append the site name here — the root layout's title
  // template ("%s — Tshabu Productions") already does that once.
  title: "Client Login",
  robots: { index: false, follow: false },
};

export default async function DashboardLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-12 bg-tshabu-black px-6 py-20 text-tshabu-paper">
      <div className="flex flex-col items-center gap-4 text-center">
        <Image
          src="/images/logo.png"
          alt={site.name}
          width={48}
          height={48}
          priority
          className="h-12 w-12 rounded-full"
        />
        <div>
          <p className="text-lg font-bold uppercase tracking-[0.2em]">{site.shortName}</p>
          <p className="label-caps mt-1 text-tshabu-paper/50">Client Dashboard</p>
        </div>
      </div>

      <LoginForm next={next ?? "/dashboard"} />
    </div>
  );
}
