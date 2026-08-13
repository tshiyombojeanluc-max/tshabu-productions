import type { Project } from "@/lib/data";
import { ProjectCard } from "@/components/site/project-card";
import { Reveal } from "@/components/site/reveal";
import { cn } from "@/lib/utils";

const pattern = [
  "md:col-span-7",
  "md:col-span-5 md:mt-24",
  "md:col-span-5",
  "md:col-span-7 md:mt-24",
];

export function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-12">
      {projects.map((project, i) => (
        <Reveal
          key={project.slug}
          delay={(i % 4) * 0.05}
          className={cn("col-span-1", pattern[i % pattern.length])}
        >
          <ProjectCard project={project} priority={i < 2} />
        </Reveal>
      ))}
    </div>
  );
}
