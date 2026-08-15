import type { Metadata } from "next";
import { Inter, Kaushan_Script } from "next/font/google";
import Navbar from "@/components/site/navbar";
import Footer from "@/components/site/footer";
import { JsonLd } from "@/components/site/json-ld";
import { SITE_URL, DEFAULT_OG_IMAGE, absoluteUrl } from "@/lib/seo";
import { site, socialLinks } from "@/lib/data";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

// Matches the brush-script "Tshabu" wordmark in the logo.
const kaushanScript = Kaushan_Script({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Tshabu Productions — Photography & Videography, Cape Town",
    template: "%s — Tshabu Productions",
  },
  description:
    "Tshabu Productions is a Cape Town photography and videography studio creating timeless visuals for events, brands and businesses. We don't just take photos or film videos — we tell your story.",
  keywords: [
    "Tshabu Productions",
    "photography Cape Town",
    "videography Cape Town",
    "production company Cape Town",
    "event photography Cape Town",
    "event videography Cape Town",
    "corporate video production Cape Town",
    "brand photography Cape Town",
    "post-production Cape Town",
  ],
  openGraph: {
    title: "Tshabu Productions — Photography & Videography, Cape Town",
    description:
      "A Cape Town photography and videography studio creating timeless visuals for events, brands and businesses.",
    url: SITE_URL,
    siteName: "Tshabu Productions",
    type: "website",
    locale: "en_ZA",
    images: [{ url: DEFAULT_OG_IMAGE, width: 1600, height: 1066 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tshabu Productions — Photography & Videography, Cape Town",
    description:
      "A Cape Town photography and videography studio creating timeless visuals for events, brands and businesses.",
    images: [DEFAULT_OG_IMAGE],
  },
  alternates: {
    canonical: "/",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness"],
  "@id": `${SITE_URL}/#organization`,
  name: site.name,
  url: SITE_URL,
  logo: absoluteUrl("/images/logo.png"),
  image: absoluteUrl(DEFAULT_OG_IMAGE),
  email: site.email,
  telephone: site.phone,
  description:
    "Cape Town photography and videography studio providing event coverage, brand photography, videography and post-production for businesses, schools and individuals.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Cape Town",
    addressRegion: "Western Cape",
    addressCountry: "ZA",
  },
  areaServed: {
    "@type": "City",
    name: "Cape Town",
  },
  sameAs: socialLinks.map((link) => link.href),
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: site.name,
  publisher: { "@id": `${SITE_URL}/#organization` },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-ZA" className={`${inter.variable} ${kaushanScript.variable} antialiased`}>
      <body className="min-h-screen bg-background text-foreground selection:bg-tshabu-black selection:text-tshabu-paper">
        <JsonLd data={organizationJsonLd} />
        <JsonLd data={websiteJsonLd} />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
