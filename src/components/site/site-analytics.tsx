"use client";

import { useEffect } from "react";
import { Analytics } from "@vercel/analytics/next";
import { track } from "@vercel/analytics";

/**
 * Page views (Vercel Web Analytics — cookieless, so no consent banner) plus
 * the contact actions that matter commercially. Contact links are tracked
 * with one delegated listener instead of wiring every <a> on the site, so a
 * new WhatsApp/phone/email link anywhere is counted automatically.
 *
 * Dashboard traffic is dropped so the client's own admin sessions don't
 * inflate the numbers.
 *
 * Note: page views work on every Vercel plan once Web Analytics is enabled
 * for the project; the custom events below need a plan that includes
 * custom events, and are a harmless no-op otherwise.
 */
export function SiteAnalytics() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const anchor = (event.target as Element | null)?.closest?.("a");
      const href = anchor?.getAttribute("href") ?? "";
      if (href.startsWith("https://wa.me/")) track("whatsapp_click", { page: location.pathname });
      else if (href.startsWith("tel:")) track("phone_click", { page: location.pathname });
      else if (href.startsWith("mailto:")) track("email_click", { page: location.pathname });
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <Analytics
      beforeSend={(event) => (new URL(event.url).pathname.startsWith("/dashboard") ? null : event)}
    />
  );
}
