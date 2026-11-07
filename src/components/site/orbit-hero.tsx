import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Orbit hero: the offer sits dead centre and real event photos float in a
 * loose ring around it, so a visitor sees the clients and the work before
 * reading a word, and the empty centre makes the headline impossible to miss.
 *
 * Replaces the animated 3D image corridor (desktop) and the scroll-expand
 * camera hero (mobile). Both hid what the company does behind the wordmark,
 * and the corridor alone cost over a second of main-thread time. This is
 * static markup + CSS: no client JS, ten small optimised images.
 *
 * Every photo shares one treatment (black and white, 10px radius) so the
 * scatter reads as designed. Photos come from the dashboard's "Desktop Hero
 * Photo 1–10" slots, so the client can still swap them without a deploy.
 */

export type OrbitPhoto = { src: string };

type Slot = {
  /** Position of the photo's top-left corner, as % of the hero box. */
  top: number;
  left: number;
  /** Width at the 1440px design size; scales down with the viewport. */
  width: number;
  aspect: "landscape" | "portrait" | "square";
  /** Tucked behind its neighbour to make an overlapping pair. */
  behind?: boolean;
};

// Roughly clock positions (12, 1:30, 3, 4:30, 6, 7:30, 9, 10:30) plus two
// small photos tucked behind their neighbours. Kept outside an oval around
// the text block (centre 50%/52%, radii ~26%/22%) so nothing crosses the copy.
const RING: Slot[] = [
  { top: 11, left: 44, width: 170, aspect: "landscape" }, // 12
  { top: 13, left: 75, width: 190, aspect: "portrait" }, // 1:30
  { top: 50, left: 86, width: 170, aspect: "landscape" }, // 3
  { top: 72, left: 72, width: 220, aspect: "landscape" }, // 4:30
  { top: 85, left: 46, width: 150, aspect: "landscape" }, // 6
  { top: 70, left: 8, width: 230, aspect: "landscape" }, // 7:30
  { top: 38, left: 3, width: 175, aspect: "portrait" }, // 9
  { top: 12, left: 11, width: 210, aspect: "landscape" }, // 10:30
  { top: 27, left: 23, width: 120, aspect: "square", behind: true }, // behind 10:30
  { top: 64, left: 88, width: 130, aspect: "square", behind: true }, // behind 4:30
];

// Photos shown on phones and tablets: 2 above the text, 2 below.
const COMPACT = [0, 3, 5, 7];

const aspectClass = {
  landscape: "aspect-[4/3]",
  portrait: "aspect-[3/4]",
  square: "aspect-square",
} as const;

const css = `
@keyframes orbit-rise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@keyframes orbit-pop{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:none}}
@keyframes orbit-drift{0%,100%{translate:0 0}50%{translate:var(--dx) var(--dy)}}
.orbit-text{animation:orbit-rise .7s cubic-bezier(.22,1,.36,1) both}
.orbit-photo{animation:orbit-pop .6s cubic-bezier(.22,1,.36,1) both,orbit-drift var(--drift) ease-in-out infinite}
@media (prefers-reduced-motion:reduce){.orbit-text,.orbit-photo{animation:none}}
`;

function OrbitImage({
  src,
  slot,
  sizes,
  eager = false,
}: {
  src: string;
  slot: Slot;
  sizes: string;
  /** Above-the-fold on phones, where one of these is the LCP element. */
  eager?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-[10px] bg-tshabu-charcoal shadow-[0_10px_30px_-12px_rgba(0,0,0,0.35)]",
        aspectClass[slot.aspect]
      )}
    >
      <Image
        src={src}
        alt=""
        fill
        sizes={sizes}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : undefined}
        className="object-cover grayscale"
      />
    </div>
  );
}

export function OrbitHero({
  photos,
  eyebrow,
  headline,
  body,
  ctaText,
  ctaHref,
}: {
  photos: OrbitPhoto[];
  eyebrow: string;
  headline: [string, string];
  body: string;
  ctaText: string;
  ctaHref: string;
}) {
  const ring = RING.map((slot, i) => ({ slot, photo: photos[i % Math.max(photos.length, 1)] })).filter(
    (item) => item.photo?.src
  );

  return (
    <section className="relative overflow-hidden bg-tshabu-paper">
      <style>{css}</style>

      {/* Desktop ring (lg+). Decorative: the text block carries the message. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden lg:block">
        {ring.map(({ slot, photo }, i) => (
          <div
            key={i}
            className={cn("orbit-photo absolute", slot.behind ? "z-0" : "z-10")}
            style={
              {
                top: `${slot.top}%`,
                left: `${slot.left}%`,
                width: `min(${slot.width}px, ${(slot.width / 14.4).toFixed(2)}vw)`,
                animationDelay: `${0.45 + i * 0.08}s, 0s`,
                "--drift": `${7 + (i % 4) * 1.5}s`,
                "--dx": `${i % 2 ? 3 : -3}px`,
                "--dy": `${i % 3 ? -4 : 3}px`,
              } as React.CSSProperties
            }
          >
            <OrbitImage src={photo.src} slot={slot} sizes={`${Math.round(slot.width * 1.1)}px`} />
          </div>
        ))}
      </div>

      <div className="container-edit relative z-20 flex min-h-[100svh] flex-col items-center justify-center gap-10 pt-28 pb-16 lg:pt-24">
        {/* Phones/tablets: 2 photos above the text. */}
        <CompactRow photos={photos} indices={COMPACT.slice(0, 2)} />

        <div className="flex max-w-4xl flex-col items-center text-center">
          <p className="orbit-text font-script text-2xl text-tshabu-black sm:text-3xl" style={{ animationDelay: "0s" }}>
            {eyebrow}
          </p>
          <h1
            className="orbit-text mt-4 text-[clamp(2.4rem,5vw,4.75rem)] font-semibold leading-[1.02] tracking-tight text-balance text-tshabu-black"
            style={{ animationDelay: "0.1s" }}
          >
            {headline[0]}
            <br />
            {headline[1]}
          </h1>
          <p
            className="orbit-text mt-6 max-w-xl text-base leading-relaxed text-tshabu-graphite sm:text-lg"
            style={{ animationDelay: "0.2s" }}
          >
            {body}
          </p>
          <Link
            href={ctaHref}
            className="orbit-text mt-9 inline-block bg-tshabu-black px-9 py-4 text-sm uppercase tracking-[0.2em] text-tshabu-paper transition-colors hover:bg-tshabu-charcoal focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tshabu-black"
            style={{ animationDelay: "0.3s" }}
          >
            {ctaText}
          </Link>
        </div>

        {/* Phones/tablets: 2 photos below the text. */}
        <CompactRow photos={photos} indices={COMPACT.slice(2, 4)} flip />
      </div>
    </section>
  );
}

function CompactRow({ photos, indices, flip = false }: { photos: OrbitPhoto[]; indices: number[]; flip?: boolean }) {
  const items = indices.map((i) => photos[i]).filter((p): p is OrbitPhoto => Boolean(p?.src));
  if (items.length === 0) return null;
  return (
    <div aria-hidden="true" className={cn("flex w-full max-w-md items-end justify-center gap-4 lg:hidden", flip && "items-start")}>
      {items.map((photo, i) => {
        const wide = flip ? i === 1 : i === 0;
        return (
          <div
            key={photo.src + i}
            className={cn("orbit-photo", wide ? "w-[55%]" : "w-[38%]")}
            style={
              {
                animationDelay: `${0.45 + i * 0.1}s, 0s`,
                "--drift": `${8 + i}s`,
                "--dx": "0px",
                "--dy": `${i ? 3 : -3}px`,
              } as React.CSSProperties
            }
          >
            <OrbitImage
              src={photo.src}
              slot={{ top: 0, left: 0, width: 0, aspect: wide ? "landscape" : "portrait" }}
              sizes="(max-width: 1023px) 55vw, 1px"
              // The row above the headline is the phone LCP. Eager is cheap on
              // desktop: this row is hidden there and `sizes` resolves to 1px,
              // so the browser fetches only the smallest rendition.
              eager={!flip}
            />
          </div>
        );
      })}
    </div>
  );
}
