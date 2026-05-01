import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin, Mountain, Search, Route as RouteIcon } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { Flag } from "@/components/Flag";
import { Money } from "@/components/Money";
import { TerrainChips } from "@/components/TerrainChips";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ITINERARIES, totalCost, totalHours, totalKm } from "@/lib/itineraries";
import { DIFFICULTY_META } from "@/lib/terrains";
import { cn } from "@/lib/utils";

const Itineraries = () => {
  useEffect(() => { document.title = "Trip itineraries — TripAdvisor"; }, []);

  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"days" | "budget" | "km">("days");
  const [diff, setDiff] = useState<"all" | "easy" | "moderate" | "hard">("all");

  const list = useMemo(() => {
    const q = query.toLowerCase();
    let arr = ITINERARIES.filter(
      (i) =>
        (diff === "all" || i.difficulty === diff) &&
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
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Hand-built routes with km, hours, and per-day cost — copy & tweak instead of starting from a blank page.
          </p>
        </header>

        <div className="glass-card p-4 mb-6 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search Srinagar, Japan, beaches…" className="pl-9 bg-surface" />
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
            return (
              <Link
                key={it.slug}
                to={`/itinerary/${it.slug}`}
                className="glass-card hover-lift p-5 flex flex-col gap-3 group"
              >
                <div className="flex items-start gap-3">
                  <Flag emoji={it.flag} size={36} />
                  <div className="min-w-0 flex-1">
                    <h2 className="font-display text-lg font-bold leading-snug group-hover:text-primary transition-colors">{it.title}</h2>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><MapPin className="h-3 w-3" />{it.region}</p>
                  </div>
                  <span className={cn("chip whitespace-nowrap", d.tone)}>{d.label}</span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{it.blurb}</p>
                <TerrainChips terrains={it.terrains} max={5} />
                <div className="grid grid-cols-3 gap-2 mt-auto">
                  <Stat icon={<Calendar className="h-3 w-3" />} label="Days" value={`${it.days}`} />
                  <Stat icon={<RouteIcon className="h-3 w-3" />} label="Distance" value={`${km} km`} />
                  <Stat icon={<Clock className="h-3 w-3" />} label="Active hrs" value={`${hr}h`} />
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
