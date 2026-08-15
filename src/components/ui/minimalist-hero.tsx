"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ImageStreamHero, type StreamImage } from "@/components/ui/image-stream-hero";

interface MinimalistHeroProps {
  logoText: string;
  navLinks: { label: string; href: string }[];
  mainText: string;
  readMoreLink: string;
  imageSrc?: string;
  imageAlt?: string;
  overlayText?: {
    part1: string;
    part2: string;
  };
  socialLinks: { icon: React.ReactNode; href: string; label: string }[];
  locationText: string;
  className?: string;
  hideHeader?: boolean;
  hideFooter?: boolean;
  watermarkText?: [string, string];
  /** Renders on a black background with white text instead of the default light theme. */
  dark?: boolean;
  /** Set to false to show the photo in its original colour instead of the brand's monochrome treatment. */
  grayscaleImage?: boolean;
  /** Zoom multiplier applied to the photo, useful for cropping tighter around a subject. */
  imageZoom?: number;
  /** CSS transform-origin (e.g. "60% 40%") controlling which part of the photo the zoom anchors to. */
  imageFocalPoint?: string;
  /** Optional solid CTA button rendered below the "Read More" link. */
  ctaText?: string;
  ctaLink?: string;
  /** When provided, renders an animated corridor of images as the hero's background instead of a flat colour. */
  streamImages?: StreamImage[];
}

const NavLink = ({
  href,
  children,
  dark,
}: {
  href: string;
  children: React.ReactNode;
  dark?: boolean;
}) => (
  <a
    href={href}
    className={cn(
      "text-sm font-medium tracking-widest transition-colors",
      dark
        ? "text-tshabu-paper/60 hover:text-tshabu-paper"
        : "text-foreground/60 hover:text-foreground"
    )}
  >
    {children}
  </a>
);

const SocialIcon = ({
  href,
  icon,
  label,
  dark,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  dark?: boolean;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className={cn(
      "transition-colors",
      dark ? "text-tshabu-paper/60 hover:text-tshabu-paper" : "text-foreground/60 hover:text-foreground"
    )}
  >
    {icon}
  </a>
);

export const MinimalistHero = ({
  logoText,
  navLinks,
  mainText,
  readMoreLink,
  imageSrc,
  imageAlt,
  overlayText,
  socialLinks,
  locationText,
  className,
  hideHeader = false,
  hideFooter = false,
  watermarkText,
  dark = false,
  grayscaleImage = true,
  imageZoom = 1,
  imageFocalPoint = "50% 50%",
  ctaText,
  ctaLink,
  streamImages,
}: MinimalistHeroProps) => {
  const baseClassName = cn(
    "relative flex h-screen w-full flex-col items-center justify-between overflow-hidden p-8 font-sans md:p-12",
    dark ? "bg-tshabu-black text-tshabu-paper" : "bg-background text-foreground",
    className
  );

  const content = (
    <>
      <header className={cn("z-30 flex w-full max-w-7xl items-center justify-between", hideHeader && "sr-only")}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xl font-bold tracking-wider"
        >
          {logoText}
        </motion.div>
        <div className="hidden items-center space-x-8 md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.label} href={link.href} dark={dark}>
              {link.label}
            </NavLink>
          ))}
        </div>
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col space-y-1.5 md:hidden"
          aria-label="Open menu"
        >
          <span className={cn("block h-0.5 w-6", dark ? "bg-tshabu-paper" : "bg-foreground")}></span>
          <span className={cn("block h-0.5 w-6", dark ? "bg-tshabu-paper" : "bg-foreground")}></span>
          <span className={cn("block h-0.5 w-5", dark ? "bg-tshabu-paper" : "bg-foreground")}></span>
        </motion.button>
      </header>

      <div
        className={cn(
          "relative w-full max-w-7xl",
          watermarkText
            ? "flex flex-grow flex-col items-center justify-center gap-7 text-center md:grid md:grid-cols-3 md:items-center md:gap-0 md:text-left"
            : "grid flex-grow grid-cols-1 items-center md:grid-cols-3"
        )}
      >
        {watermarkText && (
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, -14, 0] }}
            transition={{
              opacity: { duration: 1, delay: 0.3 },
              y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 },
            }}
            className="pointer-events-none z-10 order-1 flex select-none flex-col items-center gap-1 text-center font-sans md:absolute md:inset-x-0 md:top-0 md:bottom-0 md:order-none md:h-auto md:justify-center md:gap-0 md:py-0"
          >
            <span
              className={cn(
                "font-script text-[clamp(3.5rem,15vw,11rem)] leading-[0.9] normal-case md:text-[clamp(4.5rem,12vw,13rem)]",
                dark ? "text-tshabu-paper" : "text-foreground"
              )}
            >
              {watermarkText[0]}
            </span>
            <span
              className={cn(
                "text-[clamp(1.75rem,7vw,5rem)] font-extrabold uppercase leading-[0.9] tracking-[0.15em] md:text-[clamp(2rem,5vw,5rem)]",
                dark ? "text-tshabu-paper" : "text-foreground"
              )}
            >
              {watermarkText[1]}
            </span>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className={cn(
            "z-20 text-center",
            watermarkText
              ? "order-3 md:absolute md:inset-x-0 md:top-[87%] md:text-center"
              : "order-2 md:order-1 md:col-start-1 md:text-left"
          )}
        >
          <p
            className={cn(
              "mx-auto text-sm leading-relaxed",
              watermarkText ? "max-w-2xl" : "max-w-xs md:mx-0",
              dark ? "text-tshabu-paper/80" : "text-foreground/80"
            )}
          >
            {mainText}
          </p>
          <a
            href={readMoreLink}
            className={cn(
              "mt-4 inline-block text-sm font-medium underline decoration-from-font",
              dark ? "text-tshabu-paper" : "text-foreground"
            )}
          >
            Read More
          </a>
          {ctaText && ctaLink && !watermarkText && (
            <a
              href={ctaLink}
              className={cn(
                "mx-auto mt-6 block w-fit px-8 py-4 text-sm uppercase tracking-[0.2em] transition-colors md:mx-0",
                dark
                  ? "bg-tshabu-paper text-tshabu-black hover:bg-tshabu-paper/90"
                  : "bg-tshabu-black text-tshabu-paper hover:bg-tshabu-charcoal"
              )}
            >
              {ctaText}
            </a>
          )}
        </motion.div>

        {watermarkText && ctaText && ctaLink && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="z-20 order-2 flex justify-center md:order-none md:absolute md:inset-x-0 md:top-[77%]"
          >
            <a
              href={ctaLink}
              className={cn(
                "block w-fit px-8 py-4 text-sm uppercase tracking-[0.2em] transition-colors",
                dark
                  ? "bg-tshabu-paper text-tshabu-black hover:bg-tshabu-paper/90"
                  : "bg-tshabu-black text-tshabu-paper hover:bg-tshabu-charcoal"
              )}
            >
              {ctaText}
            </a>
          </motion.div>
        )}

        {imageSrc && (
          <div className="relative order-1 md:order-2 flex justify-center items-center h-full">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className={cn(
                "absolute z-0 h-[300px] w-[300px] rounded-full md:h-[400px] md:w-[400px] lg:h-[500px] lg:w-[500px]",
                dark ? "bg-tshabu-paper/[0.06] ring-1 ring-tshabu-paper/15" : "bg-foreground/[0.06] ring-1 ring-foreground/15"
              )}
            ></motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
              className="relative z-10 h-[336px] w-[336px] overflow-hidden rounded-full md:h-[384px] md:w-[384px] lg:h-[432px] lg:w-[432px]"
            >
              <Image
                src={imageSrc}
                alt={imageAlt ?? ""}
                fill
                sizes="(max-width: 768px) 336px, (max-width: 1024px) 384px, 432px"
                className={cn("object-cover", grayscaleImage && "grayscale contrast-125")}
                style={{ scale: imageZoom, transformOrigin: imageFocalPoint }}
              />
            </motion.div>
          </div>
        )}

        {overlayText && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className={cn(
              "z-20 order-3 flex items-center justify-center text-center md:col-start-3 md:justify-start",
              watermarkText && "md:self-end md:pb-8"
            )}
          >
            <h1
              className={cn(
                "text-[clamp(2rem,10vw,3.5rem)] font-extrabold uppercase leading-[0.95] md:text-[clamp(1.5rem,3.7vw,3.25rem)]",
                dark ? "text-tshabu-paper" : "text-foreground"
              )}
            >
              {overlayText.part1}
              <br />
              {overlayText.part2}
            </h1>
          </motion.div>
        )}
      </div>

      <footer className={cn("z-30 flex w-full max-w-7xl items-center justify-between", hideFooter && "sr-only")}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="flex items-center space-x-4"
        >
          {socialLinks.map((link, index) => (
            <SocialIcon key={index} href={link.href} icon={link.icon} label={link.label} dark={dark} />
          ))}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.3 }}
          className={cn("text-sm font-medium", dark ? "text-tshabu-paper/80" : "text-foreground/80")}
        >
          {locationText}
        </motion.div>
      </footer>
    </>
  );

  if (streamImages && streamImages.length > 0) {
    return (
      <ImageStreamHero
        images={streamImages}
        className={cn(baseClassName, "[&_img]:contrast-110")}
      >
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 z-0",
            dark ? "bg-tshabu-black/45" : "bg-background/50"
          )}
        />
        {content}
      </ImageStreamHero>
    );
  }

  return <div className={baseClassName}>{content}</div>;
};
