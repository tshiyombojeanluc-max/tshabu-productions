"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/site/navbar";
import Footer from "@/components/site/footer";

/**
 * The dashboard has its own sidebar shell (src/app/dashboard/(app)/layout.tsx)
 * and shouldn't also get the public site's Navbar/Footer — this is the only
 * place that decision is made, so no existing route file has to change.
 */
export function SiteChrome({ children, logoSrc }: { children: React.ReactNode; logoSrc?: string }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  return (
    <>
      {!isDashboard && <Navbar logoSrc={logoSrc} />}
      <main>{children}</main>
      {!isDashboard && <Footer />}
    </>
  );
}
