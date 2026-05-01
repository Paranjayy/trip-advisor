import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SiteNav } from "@/components/SiteNav";
import { COUNTRIES, MONTHS } from "@/data/countries";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Search, Filter, Layers, ListFilter, LayoutGrid, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";

const Timing = () => {
  useEffect(() => {
    document.title = "Best months to travel — TripAdvisor";
  }, []);

  const [sortBy, setSortBy] = useState<"alpha" | "cheap" | "expensive">("alpha");
  const [region, setRegion] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [isGrouped, setIsGrouped] = useState(false);

  const filtered = useMemo(() => {
    let arr = COUNTRIES.filter(c => {
      const matchesQuery = c.name.toLowerCase().includes(query.toLowerCase()) || 
                          c.region.toLowerCase().includes(query.toLowerCase());
      const matchesRegion = region === "all" || c.region === region;
      return matchesQuery && matchesRegion;
    });

    if (sortBy === "alpha") arr.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "cheap") arr.sort((a, b) => Math.min(...a.monthlyPriceIndex) - Math.min(...b.monthlyPriceIndex));
    if (sortBy === "expensive") arr.sort((a, b) => Math.max(...b.monthlyPriceIndex) - Math.max(...a.monthlyPriceIndex));
    
    return arr;
  }, [query, region, sortBy]);

  const grouped = useMemo(() => {
    if (!isGrouped) return { "All Destinations": filtered };
    const groups: Record<string, typeof COUNTRIES> = {};
    filtered.forEach(c => {
      if (!groups[c.region]) groups[c.region] = [];
      groups[c.region].push(c);
    });
    return groups;
  }, [filtered, isGrouped]);

  const regions = useMemo(() => Array.from(new Set(COUNTRIES.map(c => c.region))), []);

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <div className="container mx-auto py-10">
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-wider text-primary font-semibold mb-1 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> Global Timing Heatmap
              </p>
              <h1 className="font-display text-4xl font-bold">When to go where</h1>
              <p className="text-muted-foreground mt-2 max-w-2xl font-medium">
                A 12-month price & weather matrix. Green = low cost, amber = peak, <span className="text-accent font-bold">●</span> = ideal climate.
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    value={query} 
                    onChange={(e) => setQuery(e.target.value)} 
                    placeholder="Search country..." 
                    className="pl-9 w-64 bg-surface rounded-xl border-border/40" 
                  />
               </div>
               <Select value={region} onValueChange={setRegion}>
                  <SelectTrigger className="w-40 bg-surface rounded-xl border-border/40 font-semibold">
                    <div className="flex items-center gap-2">
                       <Filter className="h-3.5 w-3.5" />
                       <SelectValue placeholder="Region" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="all">All Regions</SelectItem>
                     {regions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
               </Select>
               <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                  <SelectTrigger className="w-44 bg-surface rounded-xl border-border/40 font-semibold">
                    <div className="flex items-center gap-2">
                       <ListFilter className="h-3.5 w-3.5" />
                       <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="alpha">Alphabetical</SelectItem>
                     <SelectItem value="cheap">Lowest Budget</SelectItem>
                     <SelectItem value="expensive">Highest Peak</SelectItem>
                  </SelectContent>
               </Select>
               <Toggle 
                 pressed={isGrouped} 
                 onPressedChange={setIsGrouped}
                 className="rounded-xl border border-border/40 data-[state=on]:bg-primary/10 data-[state=on]:text-primary"
               >
                  <LayoutGrid className="h-4 w-4 mr-2" /> Group
               </Toggle>
            </div>
          </div>
        </header>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 mb-6 text-xs">
          <LegendDot className="bg-success/80" label="Cheap (<85)" />
          <LegendDot className="bg-secondary border border-border" label="Average" />
          <LegendDot className="bg-warn/80" label="Peak (>120)" />
          <LegendDot className="bg-accent" label="Best weather" />
        </div>

        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] text-sm">
              <thead className="bg-surface-muted/50">
                <tr>
                  <th className="text-left p-4 font-semibold text-[10px] uppercase tracking-widest text-muted-foreground sticky left-0 bg-surface-muted z-10 w-48">Destination</th>
                  {MONTHS.map((m) => (
                    <th key={m} className="p-2 font-black text-[10px] uppercase tracking-widest text-muted-foreground text-center">{m.slice(0, 3)}</th>
                  ))}
                  <th className="p-2 font-black text-[10px] uppercase tracking-widest text-primary text-center">Score</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(grouped).map(([groupName, groupItems]) => (
                  <React.Fragment key={groupName}>
                    {isGrouped && (
                      <tr className="bg-primary/5">
                        <td colSpan={MONTHS.length + 2} className="p-3 text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                           <Layers className="h-3 w-3" /> {groupName} ({groupItems.length})
                        </td>
                      </tr>
                    )}
                    {groupItems.map((c) => {
                      const avgPrice = c.monthlyPriceIndex.reduce((a, b) => a + b, 0) / 12;
                      const score = Math.round(100 - (avgPrice / 2) + (c.bestMonths.length * 5));
                      return (
                        <tr key={c.slug} className="border-t border-border/40 hover:bg-surface-muted/30 transition-colors group">
                          <td className="p-4 sticky left-0 bg-card/90 backdrop-blur-md z-10 group-hover:bg-surface-muted/30 border-r border-border/40 shadow-[4px_0_10px_-5px_rgba(0,0,0,0.1)]">
                            <Link to={`/country/${c.slug}`} className="font-bold hover:text-primary flex items-center gap-2 whitespace-nowrap group-hover:translate-x-1 transition-transform">
                              <span className="text-xl filter drop-shadow-sm">{c.flag}</span> 
                              <div className="flex flex-col">
                                <span className="leading-none">{c.name}</span>
                                <span className="text-[9px] text-muted-foreground font-medium mt-1">{c.vibe}</span>
                              </div>
                            </Link>
                          </td>
                          {c.monthlyPriceIndex.map((v, i) => {
                            const m = i + 1;
                            const isBest = c.bestMonths.includes(m);
                            const cls =
                              v < 85
                                ? "bg-success/20 text-success border-success/30"
                                : v > 120
                                ? "bg-warn/20 text-warn border-warn/30"
                                : "bg-secondary/40 text-secondary-foreground border-border/40";
                            return (
                              <td key={i} className="p-1.5">
                                <div
                                  className={cn(
                                    "relative h-10 rounded-xl grid place-items-center text-[11px] font-black border transition-all hover:scale-105", 
                                    cls,
                                    isBest && "ring-2 ring-accent ring-offset-2 ring-offset-background"
                                  )}
                                  title={`${MONTHS[i]}: ${v}${isBest ? " · best weather" : ""}`}
                                >
                                  {v}
                                  {isBest && (
                                    <div className="absolute -top-1 -right-1 bg-accent text-white rounded-full p-0.5 shadow-sm">
                                      <CheckCircle2 className="h-2 w-2" />
                                    </div>
                                  )}
                                </div>
                              </td>
                            );
                          })}
                          <td className="p-2 text-center">
                             <div className="h-10 w-10 rounded-full border-2 border-primary/20 flex items-center justify-center mx-auto">
                                <span className="text-[11px] font-black text-primary">{score}</span>
                             </div>
                          </td>
                        </tr>
                      );
                    })}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
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
