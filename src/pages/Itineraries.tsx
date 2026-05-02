import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin, Mountain, Search, Route as RouteIcon, Plus, LayoutGrid, List as ListIcon, Table as TableIcon, Layers, Zap } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { Flag } from "@/components/Flag";
import { Money } from "@/components/Money";
import { TerrainChips } from "@/components/TerrainChips";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { ITINERARIES, totalCost, totalHours, totalKm, type Itinerary } from "@/lib/itineraries";
import { DIFFICULTY_META } from "@/lib/terrains";
import { cn } from "@/lib/utils";
import { getPhotoUrl } from "@/lib/photos";

type View = "grid" | "list" | "matrix";

const Itineraries = () => {
  useEffect(() => { document.title = "Trip itineraries — TripAdvisor"; }, []);

  const [query, setQuery] = useState("");
  const [dayRange, setDayRange] = useState<[number, number]>([1, 14]);
  const [sort, setSort] = useState<"days" | "budget" | "km">("days");
  const [diff, setDiff] = useState<"all" | "easy" | "moderate" | "hard">("all");
  const [filterType, setFilterType] = useState<"all" | "base-camp" | "road-trip">("all");
  const [view, setView] = useState<View>("grid");
  const [isGrouped, setIsGrouped] = useState(false);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    let arr = ITINERARIES.filter(
      (i) =>
        (diff === "all" || i.difficulty === diff) &&
        (filterType === "all" || i.type === filterType) &&
        (i.days >= dayRange[0] && i.days <= dayRange[1]) &&
        (!q || `${i.title} ${i.region} ${i.blurb}`.toLowerCase().includes(q)),
    );
    arr = [...arr].sort((a, b) => {
      if (sort === "days") return a.days - b.days;
      if (sort === "budget") return totalCost(a) - totalCost(b);
      return totalKm(a) - totalKm(b);
    });
    return arr;
  }, [query, sort, diff, filterType, dayRange]);

  const grouped = useMemo(() => {
    if (!isGrouped) return { "All Explorations": filtered };
    const groups: Record<string, Itinerary[]> = {};
    filtered.forEach(it => {
      const region = it.region.split(',').pop()?.trim() || "Global";
      if (!groups[region]) groups[region] = [];
      groups[region].push(it);
    });
    return groups;
  }, [filtered, isGrouped]);

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <div className="container mx-auto py-10 px-4 md:px-6">
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
               <p className="text-xs uppercase tracking-wider text-primary font-semibold mb-1 inline-flex items-center gap-1.5">
                 <RouteIcon className="h-3.5 w-3.5" /> Day-by-day plans
               </p>
               <h1 className="font-display text-4xl font-bold">Ready-made itineraries</h1>
               <p className="text-muted-foreground mt-2 max-w-2xl leading-relaxed">
                  Hand-built routes with km, hours, and per-day cost — copy & tweak instead of starting from a blank page.
               </p>
            </div>
            <Button asChild className="rounded-xl bg-primary shadow-glow shrink-0 h-12 px-6 font-bold">
               <Link to="/planner" className="flex items-center gap-2">
                 <Plus className="h-5 w-5" /> Build Custom Itinerary
               </Link>
            </Button>
          </div>
        </header>

        <div className="glass-card p-4 mb-10 flex flex-wrap items-center gap-6 border-primary/5">
          <div className="relative flex-1 min-w-[280px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search Srinagar, Japan, beaches…" className="pl-10 h-11 bg-surface-muted/50 rounded-xl border-border/40" />
          </div>
          
          <div className="flex-1 min-w-[220px] space-y-2">
             <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Duration Range</span>
                <span className="text-xs font-bold text-primary">{dayRange[0]} – {dayRange[1]} Days</span>
             </div>
             <Slider value={dayRange} min={1} max={14} step={1} onValueChange={(v) => setDayRange(v as [number, number])} />
          </div>

          <div className="flex items-center gap-3">
             <div className="inline-flex rounded-xl border border-border/40 bg-surface-muted/50 p-1 gap-1">
                <ViewBtn icon={<LayoutGrid className="h-4 w-4" />} active={view === "grid"} onClick={() => setView("grid")} />
                <ViewBtn icon={<ListIcon className="h-4 w-4" />} active={view === "list"} onClick={() => setView("list")} />
                <ViewBtn icon={<Zap className="h-4 w-4" />} active={view === "matrix"} onClick={() => setView("matrix")} />
             </div>
             <Toggle 
                pressed={isGrouped} 
                onPressedChange={setIsGrouped}
                className="rounded-xl h-10 border border-border/40 bg-surface-muted/50 text-xs font-bold data-[state=on]:bg-primary/10 data-[state=on]:text-primary px-3"
             >
                <Layers className="h-3.5 w-3.5 mr-2" /> Group
             </Toggle>
          </div>

          <div className="flex flex-wrap gap-3">
             <Select value={diff} onValueChange={(v) => setDiff(v as never)}>
               <SelectTrigger className="w-[160px] h-10 bg-surface-muted/50 rounded-xl border-border/40"><SelectValue /></SelectTrigger>
               <SelectContent>
                 <SelectItem value="all">All difficulty</SelectItem>
                 <SelectItem value="easy">Easy</SelectItem>
                 <SelectItem value="moderate">Moderate</SelectItem>
                 <SelectItem value="hard">Hard</SelectItem>
               </SelectContent>
             </Select>
             <Select value={sort} onValueChange={(v) => setSort(v as never)}>
               <SelectTrigger className="w-[160px] h-10 bg-surface-muted/50 rounded-xl border-border/40"><SelectValue /></SelectTrigger>
               <SelectContent>
                 <SelectItem value="days">Sort: Days ↑</SelectItem>
                 <SelectItem value="budget">Sort: Budget ↑</SelectItem>
                 <SelectItem value="km">Sort: Distance ↑</SelectItem>
               </SelectContent>
             </Select>
          </div>
        </div>

        <div className="space-y-16">
          {Object.entries(grouped).map(([groupName, groupItems]) => (
            groupItems.length > 0 && (
              <div key={groupName} className="space-y-8">
                {isGrouped && (
                  <div className="flex items-center gap-4">
                    <h2 className="font-display text-2xl font-black">{groupName}</h2>
                    <div className="h-px bg-border/40 flex-1" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{groupItems.length} Routes</span>
                  </div>
                )}

                {view === "grid" ? (
                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {groupItems.map((it) => <ItineraryCard key={it.slug} it={it} />)}
                  </div>
                ) : view === "matrix" ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    {groupItems.map((it) => <ItineraryMatrixCell key={it.slug} it={it} />)}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {groupItems.map((it) => <ItineraryListRow key={it.slug} it={it} />)}
                  </div>
                )}
              </div>
            )
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="glass-card p-20 text-center text-muted-foreground border-dashed">
            <RouteIcon className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p className="font-bold">No itineraries match your filters — try widening your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

function ViewBtn({ icon, active, onClick }: { icon: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center h-8 w-9 rounded-lg transition-all",
        active ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
      )}
    >
      {icon}
    </button>
  );
}

function ItineraryCard({ it }: { it: Itinerary }) {
  const km = Math.round(totalKm(it));
  const hr = Math.round(totalHours(it));
  const cost = totalCost(it);
  const d = DIFFICULTY_META[it.difficulty];
  const friction = it.type === "base-camp" ? 2 : it.difficulty === "hard" ? 8 : 5;
  const photoUrl = getPhotoUrl(it.slug.split('-')[0], 600, 400);

  return (
    <Link
      to={`/itinerary/${it.slug}`}
      className="glass-card hover-lift p-0 overflow-hidden group border-primary/5 flex flex-col h-full shadow-elevated"
    >
      <div className="h-40 relative overflow-hidden shrink-0">
         <img src={photoUrl} alt={it.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
         <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
         
         {it.type === "base-camp" && (
            <div className="absolute top-3 left-3 bg-emerald-500/90 backdrop-blur-md text-[9px] font-black px-2 py-1 text-white rounded border border-white/10 uppercase tracking-widest shadow-glow">
              Base-Camp
            </div>
         )}
         
         <div className="absolute bottom-3 left-4 flex items-center gap-2">
            <Flag emoji={it.flag} size={24} className="shadow-lg border border-white/20" />
            <span className={cn("text-[9px] font-black uppercase px-2 py-1 rounded-full border border-white/10 backdrop-blur-md text-white", d.tone.replace('bg-', 'bg-').replace('text-', 'text-'))}>{d.label}</span>
         </div>
      </div>

      <div className="p-5 flex flex-col flex-1 space-y-4">
        <div className="min-w-0">
          <h2 className="font-display text-lg font-bold leading-tight group-hover:text-primary transition-colors line-clamp-1">{it.title}</h2>
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1 flex items-center gap-1.5"><MapPin className="h-3 w-3" />{it.region}</p>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed italic">{it.blurb}</p>
        
        <div className="pt-2">
           <TerrainChips terrains={it.terrains} max={4} />
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/40 mt-auto">
          <Stat icon={<Calendar className="h-3 w-3" />} label="Days" value={`${it.days}`} />
          <Stat icon={<RouteIcon className="h-3 w-3" />} label="Dist" value={`${km}k`} />
          <Stat icon={<Clock className="h-3 w-3" />} label="Friction" value={`${friction}/10`} />
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Budget</span>
          <span className="font-black text-primary text-lg"><Money usd={cost} /></span>
        </div>
      </div>
    </Link>
  );
}

function ItineraryListRow({ it }: { it: Itinerary }) {
  const cost = totalCost(it);
  const d = DIFFICULTY_META[it.difficulty];

  return (
    <Link
      to={`/itinerary/${it.slug}`}
      className="glass-card hover-lift p-3 flex flex-wrap items-center gap-4 border-primary/5 group"
    >
      <Flag emoji={it.flag} size={28} />
      <div className="flex-1 min-w-[200px]">
         <h3 className="font-display font-bold text-sm group-hover:text-primary transition-colors">{it.title}</h3>
         <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{it.region}</p>
      </div>
      <div className="flex items-center gap-6">
         <div className="text-right">
            <p className="text-[9px] font-black uppercase text-muted-foreground mb-0.5">Budget</p>
            <p className="text-xs font-black text-foreground"><Money usd={cost} /></p>
         </div>
         <div className="text-right">
            <p className="text-[9px] font-black uppercase text-muted-foreground mb-0.5">Duration</p>
            <p className="text-xs font-black text-foreground">{it.days} Days</p>
         </div>
         <span className={cn("text-[8px] font-black uppercase px-2 py-1 rounded-full border", d.tone)}>{d.label}</span>
      </div>
    </Link>
  );
}

function ItineraryMatrixCell({ it }: { it: Itinerary }) {
  const photoUrl = getPhotoUrl(it.slug.split('-')[0], 400, 300);
  const d = DIFFICULTY_META[it.difficulty];

  return (
    <Link
      to={`/itinerary/${it.slug}`}
      className="glass-card p-0 overflow-hidden hover-lift group border-primary/10 h-32 relative"
    >
       <img src={photoUrl} alt={it.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
       <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
       <div className="absolute bottom-2 left-3 right-3">
          <div className="flex items-center gap-1.5 mb-0.5">
             <Flag emoji={it.flag} size={14} />
             <span className={cn("text-[7px] font-black uppercase px-1 rounded-full border border-white/10 backdrop-blur-md text-white", d.tone)}>{d.label}</span>
          </div>
          <h3 className="font-display font-bold text-[10px] text-white leading-tight line-clamp-1">{it.title}</h3>
          <div className="text-[9px] font-black text-primary"><Money usd={totalCost(it)} /></div>
       </div>
    </Link>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-surface-muted/50 px-2.5 py-1.5 border border-border/40">
      <div className="flex items-center gap-1 text-[8px] uppercase tracking-widest text-muted-foreground font-black mb-0.5">{icon}{label}</div>
      <div className="text-xs font-black text-foreground tabular-nums">{value}</div>
    </div>
  );
}

export default Itineraries;
