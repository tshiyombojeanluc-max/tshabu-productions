import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="container-edit flex min-h-[70vh] flex-col items-start justify-center py-40">
      <p className="label-caps mb-4 text-tshabu-graphite">404</p>
      <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
        This page doesn&rsquo;t exist.
      </h1>
      <p className="mt-6 max-w-md text-tshabu-graphite">
        The page you&rsquo;re looking for may have moved. Try our work, or get
        in touch to book a session.
      </p>
      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          href="/"
          className="inline-block bg-tshabu-black px-8 py-4 text-sm uppercase tracking-[0.2em] text-tshabu-paper transition-colors hover:bg-tshabu-charcoal"
        >
          Back to Home
        </Link>
        <Link
          href="/work"
          className="inline-block border border-tshabu-graphite/30 px-8 py-4 text-sm uppercase tracking-[0.2em] transition-colors hover:border-tshabu-black"
        >
          View Our Work
        </Link>
      </div>
    </section>
  );
}
