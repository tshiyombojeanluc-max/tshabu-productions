import { cn } from "@/lib/utils";
import { Reveal } from "@/components/site/reveal";

export function SectionHeading({
  label,
  title,
  className,
  dark = false,
}: {
  label: string;
  title: string;
  className?: string;
  dark?: boolean;
}) {
  return (
    <Reveal className={cn("max-w-3xl", className)}>
      <p className={cn("label-caps mb-4", dark && "text-tshabu-paper/50")}>{label}</p>
      <h2
        className={cn(
          "text-4xl font-semibold uppercase leading-[1.05] tracking-tight sm:text-5xl md:text-6xl",
          dark && "text-tshabu-paper"
        )}
      >
        {title}
      </h2>
    </Reveal>
  );
}
