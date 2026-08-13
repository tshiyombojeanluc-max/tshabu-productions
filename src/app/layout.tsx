import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/site/navbar";
import Footer from "@/components/site/footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const siteUrl = "https://www.tshabuproductions.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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
    "event photography",
    "event videography",
    "wedding photographer Cape Town",
    "brand photography",
    "production",
  ],
  openGraph: {
    title: "Tshabu Productions — Photography & Videography, Cape Town",
    description:
      "A Cape Town photography and videography studio creating timeless visuals for events, brands and businesses.",
    url: siteUrl,
    siteName: "Tshabu Productions",
    type: "website",
    locale: "en_ZA",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tshabu Productions — Photography & Videography, Cape Town",
    description:
      "A Cape Town photography and videography studio creating timeless visuals for events, brands and businesses.",
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen bg-background text-foreground selection:bg-tshabu-black selection:text-tshabu-paper">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
