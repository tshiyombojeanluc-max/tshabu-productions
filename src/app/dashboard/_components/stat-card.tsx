import type { ReactNode } from "react";

export function StatCard({ label, value, icon }: { label: string; value: number | string; icon?: ReactNode }) {
  return (
    <div className="flex items-center justify-between border border-border bg-card p-6">
      <div>
        <p className="label-caps mb-2">{label}</p>
        <p className="text-4xl font-semibold tracking-tight">{value}</p>
      </div>
      {icon && <div className="text-tshabu-graphite/50">{icon}</div>}
    </div>
  );
}
