"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MinimalistHeroProps {
  logoText: string;
  navLinks: { label: string; href: string }[];
  mainText: string;
  readMoreLink: string;
  imageSrc: string;
  imageAlt: string;
  overlayText: {
    part1: string;
    part2: string;
  };
  socialLinks: { icon: React.ReactNode; href: string }[];
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
  dark,
}: {
  href: string;
  icon: React.ReactNode;
  dark?: boolean;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
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
}: MinimalistHeroProps) => {
  return (
    <div
      className={cn(
        "relative flex h-screen w-full flex-col items-center justify-between overflow-hidden p-8 font-sans md:p-12",
        dark ? "bg-tshabu-black text-tshabu-paper" : "bg-background text-foreground",
        className
      )}
    >
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

      <div className="relative grid w-full max-w-7xl flex-grow grid-cols-1 items-center md:grid-cols-3">
        {watermarkText && (
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, -14, 0] }}
            transition={{
              opacity: { duration: 1, delay: 0.3 },
              y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 },
            }}
            className="pointer-events-none absolute inset-x-0 top-[-32px] bottom-auto z-0 flex h-[460px] select-none flex-col items-center justify-between py-4 text-center font-sans md:top-0 md:bottom-0 md:h-auto md:justify-center md:py-0"
          >
            <span
              className={cn(
                "font-script text-[clamp(3.5rem,15vw,11rem)] leading-[0.9] normal-case",
                dark ? "text-tshabu-paper/[0.18]" : "text-foreground/[0.22]"
              )}
            >
              {watermarkText[0]}
            </span>
            <span
              className={cn(
                "text-[clamp(1.75rem,7vw,5rem)] font-extrabold uppercase leading-[0.9] tracking-[0.15em]",
                dark ? "text-tshabu-paper/[0.16]" : "text-foreground/[0.2]"
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
          className="z-20 order-2 md:order-1 text-center md:text-left"
        >
          <p className={cn("mx-auto max-w-xs text-sm leading-relaxed md:mx-0", dark ? "text-tshabu-paper/80" : "text-foreground/80")}>
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
        </motion.div>

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
          <div className="relative z-10 h-[336px] w-[336px] overflow-hidden rounded-full md:h-[384px] md:w-[384px] lg:h-[432px] lg:w-[432px]">
            <motion.img
              src={imageSrc}
              alt={imageAlt}
              className={cn("h-full w-full object-cover", grayscaleImage && "grayscale contrast-125")}
              style={{ scale: imageZoom, transformOrigin: imageFocalPoint }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = `https://placehold.co/400x600/111111/f7f7f5?text=Image+Not+Found`;
              }}
            />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="z-20 order-3 flex items-center justify-center text-center md:justify-start"
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
      </div>

      <footer className={cn("z-30 flex w-full max-w-7xl items-center justify-between", hideFooter && "sr-only")}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="flex items-center space-x-4"
        >
          {socialLinks.map((link, index) => (
            <SocialIcon key={index} href={link.href} icon={link.icon} dark={dark} />
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
    </div>
  );
};
