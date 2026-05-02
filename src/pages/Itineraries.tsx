import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin, Mountain, Search, Route as RouteIcon, Plus } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { Flag } from "@/components/Flag";
import { Money } from "@/components/Money";
import { TerrainChips } from "@/components/TerrainChips";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ITINERARIES, totalCost, totalHours, totalKm } from "@/lib/itineraries";
import { DIFFICULTY_META } from "@/lib/terrains";
import { cn } from "@/lib/utils";

const Itineraries = () => {
  useEffect(() => { document.title = "Trip itineraries — TripAdvisor"; }, []);

  const [query, setQuery] = useState("");
  const [maxDays, setMaxDays] = useState(14);
  const [sort, setSort] = useState<"days" | "budget" | "km">("days");
  const [diff, setDiff] = useState<"all" | "easy" | "moderate" | "hard">("all");
  const [filterType, setFilterType] = useState<"all" | "base-camp" | "road-trip">("all");

  const list = useMemo(() => {
    const q = query.toLowerCase();
    let arr = ITINERARIES.filter(
      (i) =>
        (diff === "all" || i.difficulty === diff) &&
        (filterType === "all" || i.type === filterType) &&
        (i.days <= maxDays) &&
        (!q || `${i.title} ${i.region} ${i.blurb}`.toLowerCase().includes(q)),
    );
    arr = [...arr].sort((a, b) => {
      if (sort === "days") return a.days - b.days;
      if (sort === "budget") return totalCost(a) - totalCost(b);
      return totalKm(a) - totalKm(b);
    });
    return arr;
  }, [query, sort, diff]);

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <div className="container mx-auto py-10">
        <header className="mb-8">
          <p className="text-xs uppercase tracking-wider text-primary font-semibold mb-1 inline-flex items-center gap-1.5">
            <RouteIcon className="h-3.5 w-3.5" /> Day-by-day plans
          </p>
          <h1 className="font-display text-4xl font-bold">Ready-made itineraries</h1>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
            <p className="text-muted-foreground max-w-2xl">
              Hand-built routes with km, hours, and per-day cost — copy & tweak instead of starting from a blank page.
            </p>
            <Button asChild className="rounded-xl bg-primary shadow-glow shrink-0">
               <Link to="/planner" className="flex items-center gap-2">
                 <Plus className="h-4 w-4" /> Build Custom Itinerary
               </Link>
            </Button>
          </div>
        </header>

        <div className="glass-card p-4 mb-6 flex flex-wrap items-center gap-6">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search Srinagar, Japan, beaches…" className="pl-9 bg-surface" />
          </div>
          
          <div className="flex-1 min-w-[200px] space-y-2">
             <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Max Duration</span>
                <span className="text-xs font-bold text-primary">{maxDays} Days</span>
             </div>
             <Slider value={[maxDays]} min={1} max={14} step={1} onValueChange={(v) => setMaxDays(v[0])} />
          </div>

          <div className="flex bg-surface rounded-xl p-1 border border-border/40">
             {(["all", "base-camp", "road-trip"] as const).map((t) => (
               <button
                 key={t}
                 onClick={() => setFilterType(t)}
                 className={cn(
                   "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                   filterType === t ? "bg-primary text-primary-foreground shadow-glow" : "text-muted-foreground hover:text-foreground"
                 )}
               >
                 {t.replace("-", " ")}
               </button>
             ))}
          </div>
          <Select value={diff} onValueChange={(v) => setDiff(v as never)}>
            <SelectTrigger className="w-[160px] bg-surface"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All difficulty</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={(v) => setSort(v as never)}>
            <SelectTrigger className="w-[160px] bg-surface"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="days">Sort: Days ↑</SelectItem>
              <SelectItem value="budget">Sort: Budget ↑</SelectItem>
              <SelectItem value="km">Sort: Distance ↑</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {list.map((it) => {
            const km = Math.round(totalKm(it));
            const hr = Math.round(totalHours(it));
            const cost = totalCost(it);
            const d = DIFFICULTY_META[it.difficulty];
            const friction = it.type === "base-camp" ? 2 : it.difficulty === "hard" ? 8 : 5;
            
            return (
              <Link
                key={it.slug}
                to={`/itinerary/${it.slug}`}
                className="glass-card hover-lift p-5 flex flex-col gap-3 group relative overflow-hidden"
              >
                {it.type === "base-camp" && (
                  <div className="absolute -right-8 top-4 rotate-45 bg-emerald-500 text-[10px] font-black px-8 py-1 text-white shadow-lg uppercase tracking-tighter z-10">
                    Base-Camp
                  </div>
                )}
                
                {it.type === "base-camp" && (
              <div className="mt-4 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex items-center gap-3">
                 <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                 <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-tight">Recovery Buffer: +2 Days Recommended</p>
              </div>
            )}

            <div className="flex flex-wrap gap-1.5 mt-4">
                  <Flag emoji={it.flag} size={36} />
                  <div className="min-w-0 flex-1">
                    <h2 className="font-display text-lg font-bold leading-snug group-hover:text-primary transition-colors">{it.title}</h2>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><MapPin className="h-3 w-3" />{it.region}</p>
                  </div>
                  <span className={cn("chip whitespace-nowrap", d.tone)}>{d.label}</span>
                </div>

                {it.connectionNote && (
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-2 flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary mt-1 shrink-0 shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                    <div>
                       <p className="text-[10px] font-black text-primary uppercase tracking-tighter">Lineage connection</p>
                       <p className="text-xs italic text-muted-foreground">{it.connectionNote}</p>
                    </div>
                  </div>
                )}

                <p className="text-sm text-muted-foreground line-clamp-2">{it.blurb}</p>
                <TerrainChips terrains={it.terrains} max={5} />
                <div className="grid grid-cols-3 gap-2 mt-auto">
                  <Stat icon={<Calendar className="h-3 w-3" />} label="Days" value={`${it.days}`} />
                  <Stat icon={<RouteIcon className="h-3 w-3" />} label="Distance" value={`${km} km`} />
                  <Stat icon={<Clock className="h-3 w-3" />} label="Friction" value={`${friction}/10`} />
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <span className="text-xs text-muted-foreground">Per-person budget</span>
                  <span className="font-bold text-primary"><Money usd={cost} /></span>
                </div>
              </Link>
            );
          })}
        </div>

        {list.length === 0 && (
          <div className="glass-card p-12 text-center text-muted-foreground">No itineraries match — try a wider search.</div>
        )}
      </div>
    </div>
  );
};

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg bg-surface-muted px-2 py-1.5">
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-muted-foreground">{icon}{label}</div>
      <div className="text-sm font-semibold mt-0.5 tabular-nums">{value}</div>
    </div>
  );
}

export default Itineraries;
