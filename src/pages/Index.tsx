import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Sparkles, TrendingUp, Wallet } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { CountryCard } from "@/components/CountryCard";
import { FilterPanel } from "@/components/FilterPanel";
import { Flag } from "@/components/Flag";
import { Button } from "@/components/ui/button";
import { COUNTRIES } from "@/data/countries";
import { Filters, filterCountries, recommend } from "@/lib/recommend";
import { CyberGlobe } from "@/components/CyberGlobe";
import { cn } from "@/lib/utils";

const Index = () => {
  const [filters, setFilters] = useState<Filters>({
    query: "",
    region: "all",
    budgetMax: 2000,
    vegFriendly: false,
    vibe: "any",
    japanLike: false,
    terrains: [],
  });

  const filtered = useMemo(() => filterCountries(COUNTRIES, filters), [filters]);

  const recs = useMemo(
    () =>
      recommend({
        budget: filters.budgetMax,
        month: new Date().getMonth() + 1,
        vibe: filters.vibe,
        vegFriendly: filters.vegFriendly,
        japanLike: filters.japanLike,
      }),
    [filters],
  );

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="container mx-auto py-16 md:py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border/60 text-xs font-medium text-muted-foreground shadow-card">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              Smart travel planning, no spreadsheet required
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05]">
              Find <span className="text-primary">where to go</span> next.
              <br />
              By budget, by month, by vibe.
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl">
              Compare 79+ countries on real costs, weather windows, vegetarian-friendliness,
              terrain variety, and how Japan-like they feel — in one calm dashboard.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-xl bg-primary hover:bg-primary/90 shadow-glow">
                <Link to="/explore">Explore countries <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-xl">
                <Link to="/timing">Find the cheapest month</Link>
              </Button>
            </div>

            <div className="flex flex-wrap gap-6 pt-4 text-sm">
              <HeroStat icon={<Wallet className="h-4 w-4 text-primary" />} value="79+" label="Countries" />
              <HeroStat icon={<TrendingUp className="h-4 w-4 text-accent" />} value="12-mo" label="Price trends" />
              <HeroStat icon={<Sparkles className="h-4 w-4 text-success" />} value="Smart" label="Recommendations" />
            </div>
          </div>

          <div className="relative animate-fade-in delay-200">
            <div className="absolute -inset-4 bg-primary/10 blur-3xl rounded-full opacity-50" />
            <div className="relative rounded-3xl overflow-hidden shadow-elevated border border-border/40 bg-[#0a0a0c] aspect-[4/3] lg:aspect-auto lg:h-[450px]">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(var(--primary),0.1)_0%,_transparent_70%)]" />
               <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
               
               {/* Simplified Discovery Map SVG */}
               <svg viewBox="0 0 800 500" className="absolute inset-0 w-full h-full p-8 opacity-60">
                 <path d="M150,150 Q200,100 250,150 T350,150" className="fill-none stroke-primary/20 stroke-[0.5] stroke-dash-2" />
                 <g className="fill-primary/10 stroke-primary/20 stroke-[0.5]">
                    {/* Abstract Continent Shapes */}
                    <path d="M100,100 L250,80 L300,150 L200,250 L80,200 Z" />
                    <path d="M400,120 L550,100 L600,200 L450,300 L380,220 Z" />
                    <path d="M150,300 L250,320 L220,420 L120,400 Z" />
                    <path d="M500,320 L650,350 L600,450 L480,420 Z" />
                 </g>
                 {/* Discovery Pins */}
                 {[
                   { x: 180, y: 150, color: "fill-primary" },
                   { x: 480, y: 180, color: "fill-accent" },
                   { x: 220, y: 350, color: "fill-success" },
                   { x: 550, y: 380, color: "fill-warn" },
                   { x: 300, y: 220, color: "fill-primary" }
                 ].map((p, i) => (
                   <g key={i}>
                      <circle cx={p.x} cy={p.y} r="12" className={cn(p.color, "opacity-10 animate-ping")} style={{ animationDelay: `${i * 0.5}s` }} />
                      <circle cx={p.x} cy={p.y} r="4" className={cn(p.color, "shadow-glow")} />
                   </g>
                 ))}
               </svg>

               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center space-y-2">
                     <div className="h-16 w-16 rounded-2xl bg-background/50 backdrop-blur-md border border-white/10 flex items-center justify-center mx-auto shadow-elevated">
                        <MapPin className="h-8 w-8 text-primary animate-bounce" />
                     </div>
                     <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Discovery Radar Active</p>
                  </div>
               </div>
            </div>
            <div className="absolute -bottom-6 -right-6 glass-card p-4 shadow-elevated animate-float">
               <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Live Global Pulse Active</span>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter band */}
      <section className="container mx-auto -mt-8 relative z-10">
        <div className="glass-card p-6 shadow-elevated">
          <FilterPanel filters={filters} setFilters={setFilters} />
        </div>
      </section>

      {/* Recommendations */}
      <section className="container mx-auto py-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-wider text-accent font-semibold mb-1">Smart picks for you</p>
            <h2 className="font-display text-3xl font-bold">Top 3 right now</h2>
          </div>
          <Link to="/explore" className="text-sm font-medium text-primary hover:underline hidden sm:inline">
            See all →
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {recs.map(({ country, reasons }, i) => (
            <article key={country.slug} className="glass-card hover-lift p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 px-3 py-1 rounded-bl-2xl bg-gradient-primary text-primary-foreground text-xs font-bold">
                #{i + 1} match
              </div>
              <div className="mb-3"><Flag emoji={country.flag} size={48} /></div>
              <h3 className="font-display text-xl font-bold">{country.name}</h3>
              <p className="text-xs text-muted-foreground mb-4">{country.region}</p>
              <ul className="space-y-1.5 mb-5">
                {reasons.map((r, j) => (
                  <li key={j} className="text-sm flex gap-2">
                    <span className="text-success mt-0.5">✓</span>
                    <span className="text-muted-foreground">{r}</span>
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline" className="w-full rounded-xl">
                <Link to={`/country/${country.slug}`}>View details</Link>
              </Button>
            </article>
          ))}
        </div>
      </section>

      {/* Featured grid */}
      <section className="container mx-auto pb-20">
        <div className="flex items-end justify-between mb-6">
          <h2 className="font-display text-3xl font-bold">Browse destinations</h2>
          <span className="text-sm text-muted-foreground">{filtered.length} matching</span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.slice(0, 8).map((c) => (
            <CountryCard key={c.slug} country={c} />
          ))}
        </div>
        <div className="text-center mt-8">
          <Button asChild size="lg" variant="outline" className="rounded-xl">
            <Link to="/explore">View all {COUNTRIES.length} countries <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border/60 py-8 text-center text-sm text-muted-foreground">
        Built for travelers who like decisions made simple. © TripAdvisor
      </footer>
    </div>
  );
};

function HeroStat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <div>
        <div className="font-bold text-foreground">{value}</div>
        <div className="text-xs text-muted-foreground -mt-0.5">{label}</div>
      </div>
    </div>
  );
}

export default Index;
