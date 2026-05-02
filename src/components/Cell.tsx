import React from "react";

export function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-semibold tabular-nums text-sm">{children}</div>
    </div>
  );
}
