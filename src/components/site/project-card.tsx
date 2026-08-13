"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Project } from "@/lib/data";
import { cn } from "@/lib/utils";

const aspectClass: Record<Project["coverAspect"], string> = {
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
  square: "aspect-square",
};

export function ProjectCard({
  project,
  className,
  priority = false,
}: {
  project: Project;
  className?: string;
  priority?: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={`/work/${project.slug}`}
      className={cn("group block", className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={cn("relative w-full overflow-hidden bg-tshabu-charcoal", aspectClass[project.coverAspect])}>
        <Image
          src={project.coverImage}
          alt={`${project.name} — ${project.category}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={priority}
          className={cn(
            "object-cover grayscale transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
            hovered && "scale-[1.05]"
          )}
        />
        <div
          className={cn(
            "absolute inset-0 bg-black/0 transition-colors duration-500",
            hovered && "bg-black/20"
          )}
        />
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h3 className="text-lg font-medium uppercase tracking-tight transition-transform duration-500 group-hover:translate-x-1 sm:text-xl">
          {project.name}
        </h3>
        <span className="label-caps whitespace-nowrap text-tshabu-graphite">{project.year}</span>
      </div>
      <p className="label-caps mt-1 text-tshabu-graphite">{project.category}</p>
    </Link>
  );
}
