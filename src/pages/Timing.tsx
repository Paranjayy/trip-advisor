import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SiteNav } from "@/components/SiteNav";
import { COUNTRIES, MONTHS } from "@/data/countries";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const Timing = () => {
  useEffect(() => {
    document.title = "Best months to travel — TripAdvisor";
  }, []);

  const [sortBy, setSortBy] = useState<"alpha" | "cheap" | "expensive">("alpha");

  const sorted = useMemo(() => {
    const arr = [...COUNTRIES];
    if (sortBy === "alpha") arr.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "cheap") arr.sort((a, b) => Math.min(...a.monthlyPriceIndex) - Math.min(...b.monthlyPriceIndex));
    if (sortBy === "expensive") arr.sort((a, b) => Math.max(...b.monthlyPriceIndex) - Math.max(...a.monthlyPriceIndex));
    return arr;
  }, [sortBy]);

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <div className="container mx-auto py-10">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-primary font-semibold mb-1">Timing</p>
            <h1 className="font-display text-4xl font-bold">When to go where</h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              A 12-month price heatmap across every country. Green = cheap shoulder season, amber = peak prices, dot = ideal weather.
            </p>
          </div>
          <div className="w-full sm:w-auto">
            <Label className="text-xs text-muted-foreground">Sort by</Label>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
              <SelectTrigger className="w-full sm:w-56 mt-1.5 bg-surface"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="alpha">Alphabetical</SelectItem>
                <SelectItem value="cheap">Cheapest single month</SelectItem>
                <SelectItem value="expensive">Most expensive peak</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </header>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 mb-6 text-xs">
          <LegendDot className="bg-success/80" label="Cheap (<85)" />
          <LegendDot className="bg-secondary border border-border" label="Average" />
          <LegendDot className="bg-warn/80" label="Peak (>120)" />
          <LegendDot className="bg-accent" label="Best weather" />
        </div>

        <div className="glass-card overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm">
            <thead className="bg-surface-muted">
              <tr>
                <th className="text-left p-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground sticky left-0 bg-surface-muted">Country</th>
                {MONTHS.map((m) => (
                  <th key={m} className="p-2 font-semibold text-xs text-muted-foreground">{m}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((c) => (
                <tr key={c.slug} className="border-t border-border/40 hover:bg-surface-muted/50 transition-colors">
                  <td className="p-3 sticky left-0 bg-card hover:bg-surface-muted/50">
                    <Link to={`/country/${c.slug}`} className="font-medium hover:text-primary flex items-center gap-2 whitespace-nowrap">
                      <span className="text-lg">{c.flag}</span> {c.name}
                    </Link>
                  </td>
                  {c.monthlyPriceIndex.map((v, i) => {
                    const m = i + 1;
                    const isBest = c.bestMonths.includes(m);
                    const cls =
                      v < 85
                        ? "bg-success/80 text-white"
                        : v > 120
                        ? "bg-warn/80 text-white"
                        : "bg-secondary text-secondary-foreground";
                    return (
                      <td key={i} className="p-1">
                        <div
                          className={cn("relative h-8 rounded-md grid place-items-center text-[10px] font-semibold", cls)}
                          title={`${MONTHS[i]}: ${v}${isBest ? " · best weather" : ""}`}
                        >
                          {v}
                          {isBest && <span className="absolute top-0.5 right-0.5 h-1.5 w-1.5 rounded-full bg-accent ring-1 ring-card" />}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

function LegendDot({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn("h-3 w-3 rounded", className)} /> {label}
    </span>
  );
}

export default Timing;
