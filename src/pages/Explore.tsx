import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { LayoutGrid, List, ArrowUpDown, Plane, Users, Utensils } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { CountryCard } from "@/components/CountryCard";
import { FilterPanel } from "@/components/FilterPanel";
import { TerrainChips } from "@/components/TerrainChips";
import { Money, MoneyRange } from "@/components/Money";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { COUNTRIES } from "@/data/countries";
import { Filters, filterCountries } from "@/lib/recommend";
import { japanVibe } from "@/lib/japanVibe";
import { terrainsFor, difficultyFor, DIFFICULTY_META } from "@/lib/terrains";
import { cn } from "@/lib/utils";

type SortKey = "default" | "daily_asc" | "daily_desc" | "jp_desc" | "tourists_desc" | "name_asc" | "budget_asc";

function sortCountries(items: ReturnType<typeof filterCountries>, key: SortKey) {
  const arr = [...items];
  switch (key) {
    case "daily_asc": return arr.sort((a, b) => a.dailyCost - b.dailyCost);
    case "daily_desc": return arr.sort((a, b) => b.dailyCost - a.dailyCost);
    case "jp_desc": return arr.sort((a, b) => japanVibe(b.slug) - japanVibe(a.slug));
    case "tourists_desc": return arr.sort((a, b) => b.touristCount - a.touristCount);
    case "name_asc": return arr.sort((a, b) => a.name.localeCompare(b.name));
    case "budget_asc": return arr.sort((a, b) => a.costRange[0] - b.costRange[0]);
    default: return arr;
  }
}

const Explore = () => {
  useEffect(() => {
    document.title = "Explore countries — TripAdvisor";
  }, []);

  const [filters, setFilters] = useState<Filters>({
    query: "",
    region: "all",
    budgetMax: 3500,
    tripDays: 7,
    vegFriendly: false,
    vibe: "any",
    japanLike: false,
    terrains: [],
  });

  const [sort, setSort] = useState<SortKey>("default");
  const [view, setView] = useState<"grid" | "list">("grid");

  const filtered = useMemo(() => filterCountries(COUNTRIES, filters), [filters]);
  const sorted = useMemo(() => sortCountries(filtered, sort), [filtered, sort]);

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
          <aside className="lg:sticky lg:top-20 self-start glass-card p-5 h-fit">
            <h2 className="font-display font-bold text-sm uppercase tracking-wide mb-4 text-muted-foreground">Filters</h2>
            <FilterPanel filters={filters} setFilters={setFilters} layout="sidebar" />
          </aside>

          <div>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{sorted.length}</span> of {COUNTRIES.length} countries match
              </p>
              <div className="flex items-center gap-2">
                {/* Sort */}
                <div className="flex items-center gap-1.5">
                  <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                  <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
                    <SelectTrigger className="h-8 text-xs bg-surface w-44">
                      <SelectValue placeholder="Sort by…" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Best match</SelectItem>
                      <SelectItem value="daily_asc">Daily cost ↑</SelectItem>
                      <SelectItem value="daily_desc">Daily cost ↓</SelectItem>
                      <SelectItem value="budget_asc">7-day budget ↑</SelectItem>
                      <SelectItem value="jp_desc">JP vibe ↓</SelectItem>
                      <SelectItem value="tourists_desc">Most visited</SelectItem>
                      <SelectItem value="name_asc">A → Z</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* View toggle */}
                <div className="flex rounded-lg border border-border overflow-hidden">
                  <button
                    onClick={() => setView("grid")}
                    className={cn("px-2.5 py-1.5 transition-colors", view === "grid" ? "bg-primary text-primary-foreground" : "bg-surface hover:bg-secondary")}
                    title="Grid view"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setView("list")}
                    className={cn("px-2.5 py-1.5 transition-colors", view === "list" ? "bg-primary text-primary-foreground" : "bg-surface hover:bg-secondary")}
                    title="List view"
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {view === "grid" ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {sorted.map((c) => <CountryCard key={c.slug} country={c} tripDays={filters.tripDays} />)}
              </div>
            ) : (
              <div className="glass-card overflow-hidden divide-y divide-border/50">
                {sorted.map((c) => {
                  const d = difficultyFor(c);
                  return (
                    <Link
                      key={c.slug}
                      to={`/country/${c.slug}`}
                      className="flex items-center gap-4 px-5 py-4 hover:bg-secondary/40 transition-colors group"
                    >
                      <span className="text-3xl shrink-0">{c.flag}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold group-hover:text-primary transition-colors">{c.name}</h3>
                          <span className="text-xs text-muted-foreground">{c.region}</span>
                          <span className={cn("chip text-[10px]", DIFFICULTY_META[d].tone)}>{DIFFICULTY_META[d].label}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{c.blurb}</p>
                        <div className="mt-1.5"><TerrainChips terrains={terrainsFor(c)} max={4} /></div>
                      </div>
                      <div className="shrink-0 text-right space-y-1 text-xs">
                        <div className="font-bold text-primary text-sm"><Money usd={c.dailyCost} /><span className="font-normal text-muted-foreground">/day</span></div>
                        <div className="flex items-center gap-1 text-muted-foreground justify-end">
                          <Plane className="h-3 w-3" /> <MoneyRange range={c.flightCostRange} />
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground justify-end">
                          <Users className="h-3 w-3" /> {c.touristCount}M/yr
                        </div>
                        <div className="chip bg-primary-soft text-primary text-[10px]">JP {japanVibe(c.slug)}/100</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {sorted.length === 0 && (
              <div className="glass-card p-12 text-center">
                <p className="text-muted-foreground">No countries match these filters. Try widening your budget or vibe.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
