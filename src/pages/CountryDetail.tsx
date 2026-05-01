import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Heart, Plane, Users, Calendar, Tag, MapPin, Utensils, Sparkles, Compass } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { CostBreakdownChart } from "@/components/CostBreakdownChart";
import { PriceTrendChart } from "@/components/PriceTrendChart";
import { MonthHeatmapStrip } from "@/components/MonthHeatmapStrip";
import { Button } from "@/components/ui/button";
import { Money, MoneyRange } from "@/components/Money";
import { TerrainChips } from "@/components/TerrainChips";
import { Flag } from "@/components/Flag";
import { TripCalculator } from "@/components/TripCalculator";
import { getCountry, MONTHS } from "@/data/countries";
import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";
import { terrainsFor, difficultyFor, DIFFICULTY_META, TERRAIN_META } from "@/lib/terrains";
import { japanVibe, similarCountries } from "@/lib/japanVibe";
import { localTripsFor } from "@/lib/localTrips";
import { ITINERARIES } from "@/lib/itineraries";
import { Route as RouteIcon, Clock as ClockIcon, CheckCircle2, AlertCircle, Info, ShieldCheck, Zap } from "lucide-react";
import { WeatherChart } from "@/components/WeatherChart";
import { DegreesOfSeparation } from "@/components/DegreesOfSeparation";
import { PassportStatus } from "@/components/PassportStatus";
import { getWeather } from "@/lib/weather";

const monthNames = (ms: number[]) => ms.map((m) => MONTHS[m - 1]).join(", ");

const CountryDetail = () => {
  const { slug } = useParams();
  const country = slug ? getCountry(slug) : undefined;
  const { isFavorite, toggle } = useFavorites();

  useEffect(() => {
    if (country) document.title = `${country.name} travel guide — TripAdvisor`;
  }, [country]);

  if (!country) {
    return (
      <div className="min-h-screen bg-background">
        <SiteNav />
        <div className="container mx-auto py-20 text-center">
          <h1 className="font-display text-3xl font-bold mb-4">Country not found</h1>
          <Button asChild><Link to="/explore">Back to explore</Link></Button>
        </div>
      </div>
    );
  }

  const fav = isFavorite(country.slug);
  const terrains = terrainsFor(country);
  const diff = difficultyFor(country);
  const jp = japanVibe(country.slug);
  const similar = similarCountries(country.slug, 4);
  const trips = localTripsFor(country);
  const itineraries = ITINERARIES.filter((i) => i.countrySlug === country.slug);

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      <section className="bg-gradient-hero border-b border-border/60">
        <div className="container mx-auto py-10">
          <Link to="/explore" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" /> All countries
          </Link>
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-4 mb-3">
                <Flag emoji={country.flag} size={56} />
                <div>
                  <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight">{country.name}</h1>
                  <p className="text-muted-foreground flex items-center gap-1.5 mt-1">
                    <MapPin className="h-4 w-4" /> {country.region}
                  </p>
                </div>
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl">{country.blurb}</p>
              <div className="flex flex-wrap items-center gap-2 mt-4">
                <span className={cn("chip", DIFFICULTY_META[diff].tone)}>{DIFFICULTY_META[diff].label} difficulty</span>
                <span className="chip bg-primary-soft text-primary">JP vibe {jp}/100</span>
                <Link to={`/map?focus=${country.slug}`} className="chip bg-secondary text-secondary-foreground hover:bg-secondary/80">
                  <Compass className="h-3 w-3" /> Show on map
                </Link>
              </div>
            </div>
            <Button
              onClick={() => toggle(country.slug)}
              variant={fav ? "default" : "outline"}
              size="lg"
              className={cn("rounded-xl", fav && "bg-accent hover:bg-accent/90 text-accent-foreground")}
            >
              <Heart className={cn("h-4 w-4 mr-2", fav && "fill-accent-foreground")} />
              {fav ? "Saved" : "Save trip"}
            </Button>
          </div>
        </div>
      </section>

      <div className="container mx-auto py-10 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="7-day cost" value={<MoneyRange range={country.costRange} />} sub="per person" />
          <StatCard label="Daily cost" value={<Money usd={country.dailyCost} />} sub="avg" />
          <StatCard label="Flights" value={<MoneyRange range={country.flightCostRange} />} icon={<Plane className="h-4 w-4" />} />
          <StatCard label="Tourists" value={`${country.touristCount}M/yr`} icon={<Users className="h-4 w-4" />} />
        </div>

        {/* Terrains & variety */}
        <article className="glass-card p-6 lg:col-span-3">
          <h2 className="font-display text-xl font-bold mb-1">Variety & terrain</h2>
          <p className="text-sm text-muted-foreground mb-4">What kind of trip you can build here.</p>
          <div className="flex flex-wrap gap-2">
            {terrains.map((t) => {
              const m = TERRAIN_META[t];
              const Icon = m.icon;
              return (
                <span key={t} className={cn("inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium", m.tone)}>
                  <Icon className="h-4 w-4" /> {m.label}
                </span>
              );
            })}
          </div>
        </article>

        <article className="glass-card p-6 lg:col-span-2">
          <h2 className="font-display text-xl font-bold mb-1">Cost breakdown</h2>
          <p className="text-sm text-muted-foreground mb-4">Estimated 7-day trip per person</p>
          <CostBreakdownChart country={country} />
        </article>

        {/* Weather & Timing */}
        <article className="glass-card p-6 lg:col-span-3">
           <div className="grid md:grid-cols-[1fr_300px] gap-8">
              <div>
                 <h2 className="font-display text-xl font-bold mb-1">Weather & Seasonality</h2>
                 <p className="text-sm text-muted-foreground mb-6">12-month climate averages — plan your packing and vibe.</p>
                 <WeatherChart slug={country.slug} />
              </div>
              <div className="space-y-6 pt-4">
                 <div className="p-4 rounded-2xl bg-secondary/30 border border-border/40">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-primary mb-3">Live Condition (Mock)</h3>
                    <div className="flex items-center gap-4">
                       <Zap className="h-8 w-8 text-primary animate-pulse" />
                       <div>
                          <p className="text-2xl font-black">{getWeather(country.slug, new Date().getMonth() + 1).tempHigh}°C</p>
                          <p className="text-xs font-bold text-muted-foreground">Optimal Planning Window</p>
                       </div>
                    </div>
                 </div>
                 <div className="space-y-3">
                    <MonthRow label="Best months" months={country.bestMonths} tone="success" />
                    <MonthRow label="Cheapest" months={country.cheapestMonths} tone="primary" />
                    <MonthRow label="Peak / pricey" months={country.peakMonths} tone="warn" />
                 </div>
              </div>
           </div>
        </article>

        {/* Calculator */}
        <article className="glass-card p-6 lg:col-span-2">
          <TripCalculator country={country} />
        </article>

        {/* Key stats */}
        <article className="glass-card p-6 space-y-5">
          <div>
            <h2 className="font-display text-xl font-bold flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-primary" /> Japan similarity
            </h2>
            <div className="flex items-center gap-3">
              <div className="text-4xl font-display font-extrabold text-primary">{jp}</div>
              <div className="flex-1">
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full bg-gradient-primary" style={{ width: `${jp}%` }} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">/ 100 — relative to all 79 countries</p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">Difficulty</h3>
            <span className={cn("chip", DIFFICULTY_META[diff].tone)}>{DIFFICULTY_META[diff].label}</span>
            <p className="text-xs text-muted-foreground mt-2">{DIFFICULTY_META[diff].blurb}</p>
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2 flex items-center gap-1.5">
              <Utensils className="h-3.5 w-3.5" /> Veg score
            </h3>
            <p className="text-sm capitalize font-medium">{country.vegScore}</p>
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2 flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5" /> Tags
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {country.tags.map((t) => (
                <span key={t} className="chip bg-secondary text-secondary-foreground">{t}</span>
              ))}
            </div>
          </div>
        </article>

        <article className="glass-card p-6 lg:col-span-3">
          <h2 className="font-display text-xl font-bold mb-1">Monthly price trend</h2>
          <p className="text-sm text-muted-foreground mb-4">Relative price index by month — 100 is average. Lower = cheaper.</p>
          <PriceTrendChart country={country} />
          <div className="mt-6">
            <MonthHeatmapStrip monthlyPriceIndex={country.monthlyPriceIndex} bestMonths={country.bestMonths} />
          </div>
        </article>

        {/* Day-by-day itineraries */}
        {itineraries.length > 0 && (
          <article className="glass-card p-6 lg:col-span-3">
            <div className="flex items-end justify-between mb-4 flex-wrap gap-2">
              <div>
                <h2 className="font-display text-xl font-bold mb-1 inline-flex items-center gap-2">
                  <RouteIcon className="h-5 w-5 text-primary" /> Day-by-day itineraries
                </h2>
                <p className="text-sm text-muted-foreground">Hand-built routes with km, hours and per-day cost.</p>
              </div>
              <Button asChild variant="outline" size="sm"><Link to="/itinerary">Browse all</Link></Button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {itineraries.map((it) => (
                <Link key={it.slug} to={`/itinerary/${it.slug}`} className="rounded-xl border border-border/60 p-4 hover:border-primary/50 hover:bg-primary-soft/30 transition-colors">
                  <h3 className="font-semibold leading-snug">{it.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{it.blurb}</p>
                  <div className="flex flex-wrap gap-1.5 mt-3 text-xs">
                    <span className="chip bg-primary-soft text-primary">{it.days} days</span>
                    <span className="chip bg-secondary text-secondary-foreground"><RouteIcon className="h-3 w-3" />{Math.round(it.plan.reduce((s,d)=>s+d.stops.reduce((s2,st)=>s2+st.km,0),0))} km</span>
                    <span className="chip bg-secondary text-secondary-foreground"><ClockIcon className="h-3 w-3" />{Math.round(it.plan.reduce((s,d)=>s+d.stops.reduce((s2,st)=>s2+st.hours,0),0))}h</span>
                  </div>
                </Link>
              ))}
            </div>
          </article>
        )}

        {/* Local trips */}
        <article className="glass-card p-6 lg:col-span-3">
          <h2 className="font-display text-xl font-bold mb-1">Local trips & sub-destinations</h2>
          <p className="text-sm text-muted-foreground mb-5">
            {trips.length} curated mini-trips inside {country.name}. Budget shown is per person, in your selected currency.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {trips.map((t) => (
              <div key={t.name} className="rounded-xl border border-border/60 p-4 hover:border-primary/40 hover:bg-primary-soft/30 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold">{t.name}</h3>
                    <p className="text-xs text-muted-foreground">{t.region} · {t.vibe}</p>
                  </div>
                  <span className="chip bg-primary-soft text-primary whitespace-nowrap">{t.days} days</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{t.blurb}</p>
                {t.terrains.length > 0 && (
                  <div className="mt-3"><TerrainChips terrains={t.terrains} max={4} /></div>
                )}
                <div className="mt-3 text-sm font-bold text-primary"><Money usd={t.budgetUsd} /> <span className="font-normal text-xs text-muted-foreground">est. budget</span></div>
              </div>
            ))}
          </div>
        </article>

        {/* Must Plan & Highlights */}
        <article className="glass-card p-6 lg:col-span-2">
           <h2 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
              <Compass className="h-5 w-5 text-primary" /> Must See & Things to Do
           </h2>
           <div className="grid sm:grid-cols-2 gap-4">
              {country.highlights.map((h, i) => (
                <div key={h.name} className="group relative overflow-hidden rounded-2xl border border-border/60 bg-surface hover:border-primary/40 transition-all p-5">
                   <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-125 transition-transform">
                      <span className="text-4xl font-black">0{i+1}</span>
                   </div>
                   <h3 className="font-black text-lg mb-2 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" /> {h.name}
                   </h3>
                   <p className="text-sm text-muted-foreground leading-relaxed">{h.blurb}</p>
                   <div className="mt-4 flex items-center gap-2">
                      <span className="text-[9px] font-black uppercase tracking-widest bg-primary/10 text-primary px-2 py-0.5 rounded">Vibe: {country.vibe}</span>
                      <span className="text-[9px] font-black uppercase tracking-widest bg-secondary text-secondary-foreground px-2 py-0.5 rounded">Priority: High</span>
                   </div>
                </div>
              ))}
           </div>
        </article>

        <article className="glass-card p-6">
           <h2 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-accent" /> Essential Logistics
           </h2>
           <div className="space-y-6">
              <PassportStatus destinationSlug={country.slug} />
              <div className="space-y-3">
                 <LogisticsRow icon={<Plane className="h-4 w-4" />} title="Visa Policy" desc="Check the passport tool above for your specific nationality." />
                 <LogisticsRow icon={<Utensils className="h-4 w-4" />} title="Water" desc="Stick to bottled water. High humidity in most regions." />
                 <LogisticsRow icon={<Info className="h-4 w-4" />} title="SIM Cards" desc="Local SIMs available at airports. Cheap 4G data." />
                 <LogisticsRow icon={<AlertCircle className="h-4 w-4" />} title="Transport" desc="Use local ride-sharing apps (Grab/Uber) for safety." />
              </div>
           </div>
           <div className="mt-8 pt-6 border-t border-border/60">
              <DegreesOfSeparation slug={country.slug} />
           </div>
        </article>

        {/* Similar countries */}
        <article className="glass-card p-6">
          <h2 className="font-display text-xl font-bold mb-1">Similar vibe</h2>
          <p className="text-sm text-muted-foreground mb-4">Countries with overlapping terrain, cost & feel.</p>
          <div className="space-y-2">
            {similar.map(({ country: s, score }) => (
              <Link key={s.slug} to={`/country/${s.slug}`} className="flex items-center gap-3 rounded-xl p-2 hover:bg-secondary/60 transition-colors">
                <Flag emoji={s.flag} size={28} />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{s.name}</div>
                  <div className="text-xs text-muted-foreground"><Money usd={s.dailyCost} />/day · {s.region}</div>
                </div>
                <span className="chip bg-primary-soft text-primary">{score}%</span>
              </Link>
            ))}
          </div>
          <div className="text-xs text-muted-foreground pt-3">
            Best months here: <span className="text-foreground font-medium">{monthNames(country.bestMonths)}</span>
          </div>
        </article>
      </div>
    </div>
  );
};

function StatCard({ label, value, sub, icon }: { label: string; value: React.ReactNode; sub?: string; icon?: React.ReactNode }) {
  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground uppercase tracking-wide">{icon}{label}</div>
      <div className="font-display text-xl font-bold mt-1">{value}</div>
      {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
    </div>
  );
}

function MonthRow({ label, months, tone }: { label: string; months: number[]; tone: "success" | "primary" | "warn" }) {
  const toneCls = {
    success: "bg-success-soft text-success",
    primary: "bg-primary-soft text-primary",
    warn: "bg-warn-soft text-warn",
  }[tone];
  return (
    <div>
      <div className="text-xs text-muted-foreground mb-1.5">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {months.map((m) => (
          <span key={m} className={cn("chip", toneCls)}>{MONTHS[m - 1]}</span>
        ))}
      </div>
    </div>
  );
}

function LogisticsRow({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-muted/50 border border-border/40 hover:border-accent/40 transition-colors group">
       <div className="h-8 w-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
          {icon}
       </div>
       <div>
          <h4 className="text-xs font-black uppercase tracking-widest text-foreground">{title}</h4>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
       </div>
    </div>
  );
}

export default CountryDetail;
