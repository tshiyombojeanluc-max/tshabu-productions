import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-3xl font-semibold uppercase tracking-tight sm:text-4xl">{title}</h1>
        {description && <p className="mt-2 max-w-xl text-sm text-tshabu-graphite">{description}</p>}
      </div>
      {action}
    </div>
  );
}
