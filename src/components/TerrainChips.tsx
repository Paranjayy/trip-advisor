import { TERRAIN_META, type Terrain } from "@/lib/terrains";
import { cn } from "@/lib/utils";

export function TerrainChips({
  terrains,
  max,
  size = "sm",
}: { terrains: Terrain[]; max?: number; size?: "sm" | "md" }) {
  if (!terrains?.length) return null;
  const shown = max ? terrains.slice(0, max) : terrains;
  const extra = max && terrains.length > max ? terrains.length - max : 0;
  const padding = size === "md" ? "px-2.5 py-1" : "px-2 py-0.5";
  const text = size === "md" ? "text-xs" : "text-[10px]";
  const icon = size === "md" ? "h-3.5 w-3.5" : "h-3 w-3";

  return (
    <div className="flex flex-wrap items-center gap-1">
      {shown.map((t) => {
        const m = TERRAIN_META[t];
        if (!m) return null;
        const Icon = m.icon;
        return (
          <span key={t} title={m.label} className={cn("inline-flex items-center gap-1 rounded-full font-medium", padding, text, m.tone)}>
            <Icon className={icon} />
            <span className="hidden sm:inline">{m.label}</span>
          </span>
        );
      })}
      {extra > 0 && (
        <span className={cn("inline-flex items-center rounded-full bg-secondary text-secondary-foreground font-medium", padding, text)}>
          +{extra}
        </span>
      )}
    </div>
  );
}
