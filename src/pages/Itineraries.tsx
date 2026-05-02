import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin, Mountain, Search, Route as RouteIcon, Plus, LayoutGrid, List as ListIcon, Table as TableIcon, Layers, Zap, Info, ArrowUpRight } from "lucide-react";
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

type View = "grid" | "list" | "matrix" | "table";

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
        (!q || 
          `${i.title} ${i.region} ${i.blurb} ${i.countrySlug} ${i.type} ${i.terrains.join(' ')} ${i.tags?.join(' ')}`
            .toLowerCase()
            .includes(q)
        ),
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
               <h1 className="font-display text-4xl md:text-5xl font-black tracking-tighter">Ready-made itineraries</h1>
               <p className="text-muted-foreground mt-2 max-w-2xl leading-relaxed font-medium">
                  Search by metadata like <span className="text-foreground font-bold">mountains</span>, <span className="text-foreground font-bold">India</span>, <span className="text-foreground font-bold">Asia</span>, or <span className="text-foreground font-bold">city</span>. Hand-built routes for goated immersion.
               </p>
            </div>
            <Button asChild className="rounded-2xl bg-primary shadow-glow shrink-0 h-14 px-8 font-black text-lg">
               <Link to="/planner" className="flex items-center gap-2">
                 <Plus className="h-6 w-6" /> BUILD CUSTOM TRIP
               </Link>
            </Button>
          </div>
        </header>

        <div className="glass-card p-4 mb-10 flex flex-wrap items-center gap-6 border-primary/5 shadow-elevated">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              value={query} 
              onChange={(e) => setQuery(e.target.value)} 
              placeholder="Search mountains, India, Asia, neon, zen…" 
              className="pl-11 h-12 bg-surface-muted/30 rounded-2xl border-border/40 font-bold" 
            />
          </div>
          
          <div className="flex-1 min-w-[220px] space-y-2">
             <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Duration Range</span>
                <span className="text-sm font-black text-primary">{dayRange[0]} – {dayRange[1]} Days</span>
             </div>
             <Slider value={dayRange} min={1} max={14} step={1} onValueChange={(v) => setDayRange(v as [number, number])} />
          </div>

          <div className="flex items-center gap-3">
             <div className="inline-flex rounded-2xl border border-border/40 bg-surface-muted/30 p-1.5 gap-1 shadow-inner">
                <ViewBtn icon={<LayoutGrid className="h-4 w-4" />} active={view === "grid"} onClick={() => setView("grid")} />
                <ViewBtn icon={<ListIcon className="h-4 w-4" />} active={view === "list"} onClick={() => setView("list")} />
                <ViewBtn icon={<TableIcon className="h-4 w-4" />} active={view === "table"} onClick={() => setView("table")} />
                <ViewBtn icon={<Zap className="h-4 w-4" />} active={view === "matrix"} onClick={() => setView("matrix")} />
             </div>
             <Toggle 
                pressed={isGrouped} 
                onPressedChange={setIsGrouped}
                className="rounded-2xl h-11 border border-border/40 bg-surface-muted/30 text-[10px] font-black uppercase tracking-widest data-[state=on]:bg-primary/10 data-[state=on]:text-primary px-4 shadow-sm"
             >
                <Layers className="h-4 w-4 mr-2" /> Group
             </Toggle>
          </div>

          <div className="flex flex-wrap gap-3">
             <Select value={diff} onValueChange={(v) => setDiff(v as never)}>
               <SelectTrigger className="w-[160px] h-11 bg-surface-muted/30 rounded-2xl border-border/40 font-bold"><SelectValue /></SelectTrigger>
               <SelectContent>
                 <SelectItem value="all">All difficulty</SelectItem>
                 <SelectItem value="easy">Easy</SelectItem>
                 <SelectItem value="moderate">Moderate</SelectItem>
                 <SelectItem value="hard">Hard</SelectItem>
               </SelectContent>
             </Select>
             <Select value={sort} onValueChange={(v) => setSort(v as never)}>
               <SelectTrigger className="w-[160px] h-11 bg-surface-muted/30 rounded-2xl border-border/40 font-bold"><SelectValue /></SelectTrigger>
               <SelectContent>
                 <SelectItem value="days">Sort: Days ↑</SelectItem>
                 <SelectItem value="budget">Sort: Budget ↑</SelectItem>
                 <SelectItem value="km">Sort: Distance ↑</SelectItem>
               </SelectContent>
             </Select>
          </div>
        </div>

        <div className="space-y-20">
          {Object.entries(grouped).map(([groupName, groupItems]) => (
            groupItems.length > 0 && (
              <div key={groupName} className="space-y-8">
                {isGrouped && (
                  <div className="flex items-center gap-6">
                    <h2 className="font-display text-3xl font-black tracking-tight">{groupName}</h2>
                    <div className="h-px bg-gradient-to-r from-border/60 to-transparent flex-1" />
                    <span className="text-[11px] font-black uppercase tracking-widest text-primary bg-primary/5 px-3 py-1 rounded-full">{groupItems.length} Explorations</span>
                  </div>
                )}

                {view === "grid" ? (
                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {groupItems.map((it) => <ItineraryCard key={it.slug} it={it} />)}
                  </div>
                ) : view === "matrix" ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
                    {groupItems.map((it) => <ItineraryMatrixCell key={it.slug} it={it} />)}
                  </div>
                ) : view === "table" ? (
                  <div className="glass-card overflow-hidden border-border/40 shadow-elevated p-0">
                    <table className="w-full text-left">
                      <thead className="bg-surface-muted/50 border-b border-border/40">
                        <tr>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Trip</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Region</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Days</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Budget</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Difficulty</th>
                          <th className="px-6 py-4"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/20">
                        {groupItems.map((it) => <ItineraryTableRow key={it.slug} it={it} />)}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {groupItems.map((it) => <ItineraryListRow key={it.slug} it={it} />)}
                  </div>
                )}
              </div>
            )
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="glass-card p-24 text-center text-muted-foreground border-dashed border-2 border-border/40 bg-surface-muted/10">
            <RouteIcon className="h-16 w-16 mx-auto mb-6 opacity-20 text-primary" />
            <h3 className="text-xl font-black text-foreground mb-2">No exploration nodes found</h3>
            <p className="font-bold opacity-60">Your query returned 0 valid itineraries. Try wider search parameters.</p>
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
        "inline-flex items-center justify-center h-8 w-10 rounded-xl transition-all shadow-sm",
        active ? "bg-primary text-white shadow-glow" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
      )}
    >
      {icon}
    </button>
  );
}

function ItineraryCard({ it }: { it: Itinerary }) {
  const km = Math.round(totalKm(it));
  const cost = totalCost(it);
  const d = DIFFICULTY_META[it.difficulty];
  const friction = it.type === "base-camp" ? 2 : it.difficulty === "hard" ? 8 : 5;
  const photoUrl = getPhotoUrl(it.slug.split('-')[0], 800, 500);

  return (
    <Link
      to={`/itinerary/${it.slug}`}
      className="glass-card hover-lift p-0 overflow-hidden group border-primary/5 flex flex-col h-full shadow-elevated"
    >
      <div className="h-48 relative overflow-hidden shrink-0">
         <img src={photoUrl} alt={it.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
         <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
         
         {it.type === "base-camp" && (
            <div className="absolute top-4 left-4 bg-emerald-500/90 backdrop-blur-md text-[9px] font-black px-2.5 py-1 text-white rounded border border-white/10 uppercase tracking-[0.2em] shadow-glow">
              Base-Camp
            </div>
         )}
         
         <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
            <div className="flex items-center gap-3">
               <Flag emoji={it.flag} size={28} className="shadow-lg border-2 border-white/20" />
               <span className={cn("text-[9px] font-black uppercase px-2.5 py-1 rounded-lg border border-white/10 backdrop-blur-md text-white", d.tone)}>{d.label}</span>
            </div>
            <div className="text-right">
               <span className="text-[10px] font-black text-white/60 uppercase tracking-widest block mb-0.5">Budget</span>
               <span className="text-xl font-black text-primary shadow-glow drop-shadow-md"><Money usd={cost} /></span>
            </div>
         </div>
      </div>

      <div className="p-6 flex flex-col flex-1 space-y-5">
        <div className="min-w-0">
          <h2 className="font-display text-xl font-black leading-tight group-hover:text-primary transition-colors line-clamp-1 tracking-tight">{it.title}</h2>
          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] mt-1.5 flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-primary/60" />{it.region}</p>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed italic font-medium">{it.blurb}</p>
        
        <div className="pt-2">
           <TerrainChips terrains={it.terrains} max={5} />
        </div>

        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border/40 mt-auto">
          <Stat icon={<Calendar className="h-3.5 w-3.5" />} label="Days" value={`${it.days}`} />
          <Stat icon={<RouteIcon className="h-3.5 w-3.5" />} label="Dist" value={`${km}k`} />
          <Stat icon={<Clock className="h-3.5 w-3.5" />} label="Friction" value={`${friction}/10`} />
        </div>
      </div>
    </Link>
  );
}

function ItineraryTableRow({ it }: { it: Itinerary }) {
  const d = DIFFICULTY_META[it.difficulty];
  return (
    <tr className="group hover:bg-primary/5 transition-colors">
       <td className="px-6 py-4">
          <div className="flex items-center gap-4">
             <Flag emoji={it.flag} size={24} />
             <span className="font-black text-sm tracking-tight">{it.title}</span>
          </div>
       </td>
       <td className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">{it.region}</td>
       <td className="px-6 py-4 text-center font-black text-sm">{it.days}</td>
       <td className="px-6 py-4 text-right">
          <span className="font-black text-primary"><Money usd={totalCost(it)} /></span>
       </td>
       <td className="px-6 py-4 text-center">
          <span className={cn("text-[9px] font-black uppercase px-2.5 py-1 rounded-full border shadow-sm", d.tone)}>{d.label}</span>
       </td>
       <td className="px-6 py-4 text-right">
          <Link to={`/itinerary/${it.slug}`} className="h-9 w-9 rounded-xl bg-surface-muted flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm group/btn">
             <ArrowUpRight className="h-4 w-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
          </Link>
       </td>
    </tr>
  );
}

function ItineraryListRow({ it }: { it: Itinerary }) {
  const cost = totalCost(it);
  const d = DIFFICULTY_META[it.difficulty];

  return (
    <Link
      to={`/itinerary/${it.slug}`}
      className="glass-card hover-lift p-4 flex flex-wrap items-center gap-6 border-primary/5 group shadow-sm"
    >
      <Flag emoji={it.flag} size={36} className="shadow-md" />
      <div className="flex-1 min-w-[250px]">
         <h3 className="font-display font-black text-lg group-hover:text-primary transition-colors tracking-tight">{it.title}</h3>
         <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em] mt-0.5">{it.region}</p>
      </div>
      <div className="flex items-center gap-10">
         <div className="text-right">
            <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest mb-1">TOTAL BUDGET</p>
            <p className="text-lg font-black text-primary tracking-tighter"><Money usd={cost} /></p>
         </div>
         <div className="text-right">
            <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest mb-1">DURATION</p>
            <p className="text-lg font-black text-foreground tracking-tighter">{it.days} Days</p>
         </div>
         <span className={cn("text-[9px] font-black uppercase px-3 py-1.5 rounded-xl border shadow-sm", d.tone)}>{d.label}</span>
      </div>
    </Link>
  );
}

function ItineraryMatrixCell({ it }: { it: Itinerary }) {
  const photoUrl = getPhotoUrl(it.slug.split('-')[0], 500, 400);
  const d = DIFFICULTY_META[it.difficulty];

  return (
    <Link
      to={`/itinerary/${it.slug}`}
      className="glass-card p-0 overflow-hidden hover-lift group border-primary/10 h-40 relative shadow-elevated"
    >
       <img src={photoUrl} alt={it.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
       <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
       <div className="absolute bottom-3 left-4 right-4">
          <div className="flex items-center gap-2 mb-1">
             <Flag emoji={it.flag} size={16} />
             <span className={cn("text-[8px] font-black uppercase px-2 rounded-lg border border-white/10 backdrop-blur-md text-white shadow-sm", d.tone)}>{d.label}</span>
          </div>
          <h3 className="font-display font-black text-xs text-white leading-tight line-clamp-1 tracking-tight drop-shadow-md">{it.title}</h3>
          <div className="text-sm font-black text-primary shadow-glow mt-0.5"><Money usd={totalCost(it)} /></div>
       </div>
    </Link>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-surface-muted/30 px-3 py-2 border border-border/40 shadow-inner group/stat hover:border-primary/20 transition-colors">
      <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-muted-foreground font-black mb-1">{icon}{label}</div>
      <div className="text-sm font-black text-foreground tabular-nums group-hover:text-primary transition-colors">{value}</div>
    </div>
  );
}

export default Itineraries;
