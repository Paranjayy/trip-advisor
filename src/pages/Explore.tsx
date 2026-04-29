import { useMemo, useState, useEffect } from "react";
import { SiteNav } from "@/components/SiteNav";
import { CountryCard } from "@/components/CountryCard";
import { FilterPanel } from "@/components/FilterPanel";
import { COUNTRIES } from "@/data/countries";
import { Filters, filterCountries } from "@/lib/recommend";

const Explore = () => {
  useEffect(() => {
    document.title = "Explore countries — GlobeWise";
  }, []);

  const [filters, setFilters] = useState<Filters>({
    query: "",
    region: "all",
    budgetMax: 3500,
    vegFriendly: false,
    vibe: "any",
    japanLike: false,
  });

  const filtered = useMemo(() => filterCountries(COUNTRIES, filters), [filters]);

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
            <p className="text-sm text-muted-foreground mb-4">{filtered.length} of {COUNTRIES.length} countries match</p>
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((c) => <CountryCard key={c.slug} country={c} />)}
            </div>
            {filtered.length === 0 && (
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
