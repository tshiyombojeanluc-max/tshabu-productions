"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export interface ScrollAdventurePage {
  leftBgImage: string | null;
  rightBgImage: string | null;
  leftContent: { heading: string; description: React.ReactNode } | null;
  rightContent: { heading: string; description: React.ReactNode } | null;
}

interface ScrollAdventureProps {
  pages: ScrollAdventurePage[];
  className?: string;
}

/**
 * Split-screen scroll-hijack showreel. Wheel/keyboard capture is scoped to
 * this component's own container (not `window`) and only engages while the
 * component is in view, so it can be embedded inside a longer page without
 * blocking scroll to the content above or below it.
 */
export default function ScrollAdventure({ pages, className }: ScrollAdventureProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const numOfPages = pages.length;
  const animTime = 900;
  const scrolling = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting && entry.intersectionRatio > 0.6),
      { threshold: [0, 0.6, 1] }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const navigateUp = () => {
      setCurrentPage((p) => Math.max(1, p - 1));
    };

    const navigateDown = () => {
      setCurrentPage((p) => Math.min(numOfPages, p + 1));
    };

    const handleWheel = (e: WheelEvent) => {
      if (!isInView) return;
      const goingDown = e.deltaY > 0;
      const atEnd = goingDown && currentPage === numOfPages;
      const atStart = !goingDown && currentPage === 1;
      if (atEnd || atStart) return;
      e.preventDefault();
      if (scrolling.current) return;
      scrolling.current = true;
      if (goingDown) {
        navigateDown();
      } else {
        navigateUp();
      }
      setTimeout(() => (scrolling.current = false), animTime);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isInView || scrolling.current) return;
      if (e.key === "ArrowUp") {
        scrolling.current = true;
        navigateUp();
        setTimeout(() => (scrolling.current = false), animTime);
      } else if (e.key === "ArrowDown") {
        scrolling.current = true;
        navigateDown();
        setTimeout(() => (scrolling.current = false), animTime);
      }
    };

    // Touch devices never fire `wheel` events, so swiping needs its own
    // handling — mirrors the wheel logic above, including releasing back to
    // native scroll at the first/last slide.
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0]?.clientY ?? null;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isInView || touchStartY.current === null) return;
      const currentY = e.touches[0]?.clientY;
      if (currentY === undefined) return;
      const deltaY = touchStartY.current - currentY;
      const goingDown = deltaY > 0;
      const atEnd = goingDown && currentPage === numOfPages;
      const atStart = !goingDown && currentPage === 1;
      if (atEnd || atStart) return;
      e.preventDefault();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isInView || touchStartY.current === null) return;
      const endY = e.changedTouches[0]?.clientY;
      const startY = touchStartY.current;
      touchStartY.current = null;
      if (endY === undefined || scrolling.current) return;
      const deltaY = startY - endY;
      if (Math.abs(deltaY) < 40) return;
      const goingDown = deltaY > 0;
      const atEnd = goingDown && currentPage === numOfPages;
      const atStart = !goingDown && currentPage === 1;
      if (atEnd || atStart) return;
      scrolling.current = true;
      if (goingDown) {
        navigateDown();
      } else {
        navigateUp();
      }
      setTimeout(() => (scrolling.current = false), animTime);
    };

    node.addEventListener("wheel", handleWheel, { passive: false });
    node.addEventListener("touchstart", handleTouchStart, { passive: true });
    node.addEventListener("touchmove", handleTouchMove, { passive: false });
    node.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      node.removeEventListener("wheel", handleWheel);
      node.removeEventListener("touchstart", handleTouchStart);
      node.removeEventListener("touchmove", handleTouchMove);
      node.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentPage, isInView, numOfPages]);

  return (
    <div
      ref={containerRef}
      className={cn("relative h-screen w-full overflow-hidden bg-tshabu-black", className)}
    >
      {pages.map((page, i) => {
        const idx = i + 1;
        const isActive = currentPage === idx;
        const upOff = "translateY(-100%)";
        const downOff = "translateY(100%)";
        const leftTrans = isActive ? "translateY(0)" : downOff;
        const rightTrans = isActive ? "translateY(0)" : upOff;

        return (
          <div key={idx} className="absolute inset-0">
            <div
              className="absolute top-0 left-0 h-full w-1/2 transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ transform: leftTrans }}
            >
              <div
                className="h-full w-full bg-cover bg-center bg-no-repeat grayscale"
                style={{ backgroundImage: page.leftBgImage ? `url(${page.leftBgImage})` : undefined }}
              >
                <div className="absolute inset-0 bg-black/35" />
                <div className="relative flex h-full flex-col items-center justify-center p-8 text-center text-tshabu-paper">
                  {page.leftContent && (
                    <>
                      <p className="label-caps mb-4 text-tshabu-paper/70">{page.leftContent.heading}</p>
                      <p className="max-w-sm text-lg leading-relaxed">{page.leftContent.description}</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div
              className="absolute top-0 left-1/2 h-full w-1/2 transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ transform: rightTrans }}
            >
              <div
                className="h-full w-full bg-cover bg-center bg-no-repeat grayscale"
                style={{ backgroundImage: page.rightBgImage ? `url(${page.rightBgImage})` : undefined }}
              >
                <div className="absolute inset-0 bg-black/35" />
                <div className="relative flex h-full flex-col items-center justify-center p-8 text-center text-tshabu-paper">
                  {page.rightContent && (
                    <>
                      <p className="label-caps mb-4 text-tshabu-paper/70">{page.rightContent.heading}</p>
                      <p className="max-w-sm text-lg leading-relaxed">{page.rightContent.description}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
        {pages.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setCurrentPage(i + 1)}
            className={cn(
              "h-1.5 rounded-none transition-all",
              currentPage === i + 1 ? "w-6 bg-tshabu-paper" : "w-1.5 bg-tshabu-paper/40"
            )}
          />
        ))}
      </div>
    </div>
  );
}
