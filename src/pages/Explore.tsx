import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { LayoutGrid, List, Table as TableIcon } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { CountryCard } from "@/components/CountryCard";
import { CountryTable } from "@/components/CountryTable";
import { FilterPanel } from "@/components/FilterPanel";
import { Flag } from "@/components/Flag";
import { Money, MoneyRange } from "@/components/Money";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { COUNTRIES, type Country } from "@/data/countries";
import { Filters, filterCountries } from "@/lib/recommend";
import { japanVibe } from "@/lib/japanVibe";
import { difficultyFor, DIFFICULTY_META, terrainsFor } from "@/lib/terrains";
import { TerrainChips } from "@/components/TerrainChips";
import { cn } from "@/lib/utils";
import { Toggle } from "@/components/ui/toggle";
import { VibeMatcher } from "@/components/VibeMatcher";

type View = "grid" | "list" | "table";
type Sort = "name" | "daily-asc" | "daily-desc" | "week-asc" | "week-desc" | "tourists" | "jp";

const SORTERS: Record<Sort, (a: Country, b: Country) => number> = {
  "name": (a, b) => a.name.localeCompare(b.name),
  "daily-asc": (a, b) => a.dailyCost - b.dailyCost,
  "daily-desc": (a, b) => b.dailyCost - a.dailyCost,
  "week-asc": (a, b) => a.costRange[0] - b.costRange[0],
  "week-desc": (a, b) => b.costRange[1] - a.costRange[1],
  "tourists": (a, b) => b.touristCount - a.touristCount,
  "jp": (a, b) => japanVibe(b.slug) - japanVibe(a.slug),
};

const Explore = () => {
  useEffect(() => { document.title = "Explore countries — TripAdvisor"; }, []);

  const [filters, setFilters] = useState<Filters>({
    query: "", region: "all", budgetMax: 3500, vegFriendly: false,
    vibe: "any", japanLike: false, terrains: [],
  });
  const [view, setView] = useState<View>("grid");
  const [sort, setSort] = useState<Sort>("jp");
  const [isGrouped, setIsGrouped] = useState(false);

  const filtered = useMemo(() => {
    const arr = filterCountries(COUNTRIES, filters);
    return [...arr].sort(SORTERS[sort]);
  }, [filters, sort]);

  const grouped = useMemo(() => {
    if (!isGrouped) return { "All Destinations": filtered };
    const groups: Record<string, typeof COUNTRIES> = {};
    filtered.forEach(c => {
      if (!groups[c.region]) groups[c.region] = [];
      groups[c.region].push(c);
    });
    return groups;
  }, [filtered, isGrouped]);

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <div className="container mx-auto py-10">
        <header className="mb-8">
          <p className="text-xs uppercase tracking-wider text-primary font-semibold mb-1">Explore</p>
          <h1 className="font-display text-4xl font-bold">{COUNTRIES.length} countries to consider</h1>
          <p className="text-muted-foreground mt-2">Filter by budget, vibe, region, and more — find your perfect fit.</p>
        </header>

        <div className="grid lg:grid-cols-[300px_1fr] gap-8">
          <aside className="lg:sticky lg:top-20 self-start h-fit space-y-6">
            <VibeMatcher />
            <div className="glass-card p-5">
              <h2 className="font-display font-bold text-sm uppercase tracking-wide mb-4 text-muted-foreground">Filters</h2>
              <FilterPanel filters={filters} setFilters={setFilters} layout="sidebar" />
            </div>
          </aside>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <p className="text-sm text-muted-foreground">{filtered.length} of {COUNTRIES.length} match</p>
              <div className="flex items-center gap-2">
                <Select value={sort} onValueChange={(v) => setSort(v as Sort)}>
                  <SelectTrigger className="h-9 w-[180px] bg-surface"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jp">Sort: JP vibe ↓</SelectItem>
                    <SelectItem value="name">Sort: Name A→Z</SelectItem>
                    <SelectItem value="daily-asc">Sort: Daily ↑</SelectItem>
                    <SelectItem value="daily-desc">Sort: Daily ↓</SelectItem>
                    <SelectItem value="week-asc">Sort: 7-day ↑</SelectItem>
                    <SelectItem value="week-desc">Sort: 7-day ↓</SelectItem>
                    <SelectItem value="tourists">Sort: Popularity ↓</SelectItem>
                  </SelectContent>
                </Select>
                <div className="inline-flex rounded-lg border border-border/60 bg-surface p-1 gap-0.5">
                   <ViewBtn icon={<LayoutGrid className="h-4 w-4" />} active={view === "grid"} onClick={() => setView("grid")} label="Grid" />
                   <ViewBtn icon={<List className="h-4 w-4" />} active={view === "list"} onClick={() => setView("list")} label="List" />
                   <ViewBtn icon={<TableIcon className="h-4 w-4" />} active={view === "table"} onClick={() => setView("table")} label="Table" />
                </div>
                <Toggle 
                   pressed={isGrouped} 
                   onPressedChange={setIsGrouped}
                   className="rounded-lg h-9 border border-border/60 bg-surface text-xs font-bold data-[state=on]:bg-primary/10 data-[state=on]:text-primary"
                >
                   <Layers className="h-3.5 w-3.5 mr-2" /> Group
                </Toggle>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <p className="text-muted-foreground">No countries match these filters. Try widening your budget or vibe.</p>
              </div>
            ) : (
              <div className="space-y-12">
                {Object.entries(grouped).map(([groupName, groupItems]) => (
                  <div key={groupName} className="space-y-6">
                    {isGrouped && (
                      <div className="flex items-center gap-4">
                        <h2 className="font-display text-xl font-bold flex items-center gap-2">
                           <Flag emoji={groupItems[0].flag} size={24} /> {groupName}
                           <span className="text-xs text-muted-foreground font-medium ml-2">{groupItems.length} destinations</span>
                        </h2>
                        <div className="h-px bg-border/40 flex-1" />
                        <div className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/5 px-2 py-1 rounded">
                           Avg: <Money usd={groupItems.reduce((s, c) => s + c.dailyCost, 0) / groupItems.length} /> / day
                        </div>
                      </div>
                    )}
                    
                    {view === "grid" ? (
                      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                        {groupItems.map((c) => <CountryCard key={c.slug} country={c} />)}
                      </div>
                    ) : view === "list" ? (
                      <div className="space-y-2">
                        {groupItems.map((c) => <ListRow key={c.slug} country={c} />)}
                      </div>
                    ) : (
                      <CountryTable countries={groupItems} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function ViewBtn({ icon, active, onClick, label }: { icon: React.ReactNode; active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      className={cn(
        "inline-flex items-center justify-center h-7 w-8 rounded-md transition-colors",
        active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary",
      )}
    >
      {icon}
    </button>
  );
}

function ListRow({ country: c }: { country: Country }) {
  const d = difficultyFor(c);
  return (
    <Link
      to={`/country/${c.slug}`}
      className="glass-card hover-lift flex flex-wrap items-center gap-4 px-4 py-3 group"
    >
      <Flag emoji={c.flag} size={32} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-2">
          <h3 className="font-display font-bold text-base group-hover:text-primary">{c.name}</h3>
          <span className="text-xs text-muted-foreground">{c.region}</span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-1">{c.blurb}</p>
        <div className="mt-1.5"><TerrainChips terrains={terrainsFor(c)} max={5} /></div>
      </div>
      <div className="grid grid-cols-3 gap-3 text-xs sm:min-w-[280px]">
        <Cell label="Daily"><Money usd={c.dailyCost} /></Cell>
        <Cell label="7-day"><MoneyRange range={c.costRange} /></Cell>
        <Cell label="JP vibe">{japanVibe(c.slug)}/100</Cell>
      </div>
      <span className={cn("chip", DIFFICULTY_META[d].tone)}>{DIFFICULTY_META[d].label}</span>
    </Link>
  );
}

function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-semibold tabular-nums">{children}</div>
    </div>
  );
}

export default Explore;
