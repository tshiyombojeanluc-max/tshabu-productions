import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-4 border border-dashed border-border px-6 py-20 text-center">
      {icon && <div className="text-tshabu-graphite/40">{icon}</div>}
      <div>
        <p className="text-lg font-medium">{title}</p>
        {description && <p className="mt-1 max-w-sm text-sm text-tshabu-graphite">{description}</p>}
      </div>
      {action}
    </div>
  );
}
