import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Heart, Plane, Users, Calendar, Tag, MapPin, Utensils, Sparkles, Minus, Plus } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { CostBreakdownChart } from "@/components/CostBreakdownChart";
import { PriceTrendChart } from "@/components/PriceTrendChart";
import { MonthHeatmapStrip } from "@/components/MonthHeatmapStrip";
import { Button } from "@/components/ui/button";
import { Money, MoneyRange } from "@/components/Money";
import { getCountry, MONTHS } from "@/data/countries";
import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";
import { getVibeRank, getSimilarCountries } from "@/lib/recommend";
import { CountryCard } from "@/components/CountryCard";

const monthNames = (ms: number[]) => ms.map((m) => MONTHS[m - 1]).join(", ");

/** Same emoji map as CountryCard — kept co-located for clarity */
const TAG_EMOJI: Record<string, string> = {
  beach: "🏖️",
  mountains: "🏔️",
  mountain: "🏔️",
  ski: "⛷️",
  desert: "🏜️",
  nature: "🌿",
  jungle: "🌿",
  city: "🏙️",
  diving: "🤿",
  safari: "🦁",
  wildlife: "🦁",
  spiritual: "🛕",
  wine: "🍷",
  food: "🍜",
  history: "🏛️",
  culture: "🏛️",
  adventure: "⚡",
  wellness: "🧘",
  snow: "❄️",
  nightlife: "🌃",
};

const CountryDetail = () => {
  const { slug } = useParams();
  const country = slug ? getCountry(slug) : undefined;
  const { isFavorite, toggle } = useFavorites();

  useEffect(() => {
    if (country) document.title = `${country.name} travel guide — GlobeWise`;
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
  const [tripDays, setTripDays] = useState(7);
  const { rank, topPercent, total } = getVibeRank(country.similarityScore);
  const similarCountries = getSimilarCountries(country, 3);

  // Scaled costs based on selected trip duration
  const scaledStay = Math.round(country.costBreakdown.stay / 7 * tripDays);
  const scaledFood = Math.round(country.costBreakdown.food / 7 * tripDays);
  const scaledTransport = Math.round(country.costBreakdown.transport / 7 * tripDays);
  const tripTotal = country.costBreakdown.flights + scaledStay + scaledFood + scaledTransport;
  const scaledCountry = {
    ...country,
    costBreakdown: {
      flights: country.costBreakdown.flights,
      stay: scaledStay,
      food: scaledFood,
      transport: scaledTransport,
    },
  };

  /** Deduplicated variety emoji from tags */
  const varietyEmojis = (() => {
    const seen = new Set<string>();
    const out: { tag: string; emoji: string }[] = [];
    for (const tag of country.tags) {
      const emoji = TAG_EMOJI[tag];
      if (emoji && !seen.has(emoji)) {
        seen.add(emoji);
        out.push({ tag, emoji });
      }
    }
    return out;
  })();

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      {/* Hero band */}
      <section className="bg-gradient-hero border-b border-border/60">
        <div className="container mx-auto py-10">
          <Link to="/explore" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" /> All countries
          </Link>
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-4 mb-3">
                <span className="text-6xl">{country.flag}</span>
                <div>
                  <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight">{country.name}</h1>
                  <p className="text-muted-foreground flex items-center gap-1.5 mt-1">
                    <MapPin className="h-4 w-4" /> {country.region}
                  </p>
                </div>
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl">{country.blurb}</p>
              {varietyEmojis.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {varietyEmojis.map(({ tag, emoji }) => (
                    <span key={tag} className="inline-flex items-center gap-1 chip bg-secondary text-secondary-foreground text-sm">
                      <span aria-hidden>{emoji}</span>{tag}
                    </span>
                  ))}
                </div>
              )}
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
        {/* Trip duration picker + Quick stats */}
        <div className="lg:col-span-3 space-y-4">
          {/* Day picker */}
          <div className="glass-card p-4 flex flex-wrap items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground">Trip duration:</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline" size="icon" className="h-8 w-8 rounded-lg"
                onClick={() => setTripDays(d => Math.max(1, d - 1))}
              >
                <Minus className="h-3.5 w-3.5" />
              </Button>
              <span className="font-display text-xl font-bold w-16 text-center">{tripDays} {tripDays === 1 ? "day" : "days"}</span>
              <Button
                variant="outline" size="icon" className="h-8 w-8 rounded-lg"
                onClick={() => setTripDays(d => Math.min(30, d + 1))}
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 ml-2">
              {[3, 5, 7, 10, 14, 21].map(d => (
                <button
                  key={d}
                  onClick={() => setTripDays(d)}
                  className={cn(
                    "px-3 py-1 rounded-lg text-xs font-medium border transition-colors",
                    tripDays === d
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border/60 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  )}
                >
                  {d}d
                </button>
              ))}
            </div>
            <span className="ml-auto text-sm text-muted-foreground">
              Est. total: <span className="font-semibold text-foreground"><Money usd={tripTotal} /></span>
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label={`${tripDays}-day cost`} value={<Money usd={tripTotal} />} sub="incl. flights" />
            <StatCard label="Daily cost" value={<Money usd={country.dailyCost} />} sub="avg" />
            <StatCard label="Flights" value={<MoneyRange range={country.flightCostRange} />} icon={<Plane className="h-4 w-4" />} />
            <StatCard label="Tourists" value={`${country.touristCount}M/yr`} icon={<Users className="h-4 w-4" />} />
          </div>
        </div>

        {/* Cost breakdown */}
        <article className="glass-card p-6 lg:col-span-2">
          <h2 className="font-display text-xl font-bold mb-1">Cost breakdown</h2>
          <p className="text-sm text-muted-foreground mb-4">Estimated {tripDays}-day trip per person (flights + stay + food + transport)</p>
          <CostBreakdownChart country={scaledCountry} />
        </article>

        {/* Months */}
        <article className="glass-card p-6 space-y-4">
          <h2 className="font-display text-xl font-bold flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" /> Timing
          </h2>
          <MonthRow label="Best months" months={country.bestMonths} tone="success" />
          <MonthRow label="Cheapest" months={country.cheapestMonths} tone="primary" />
          <MonthRow label="Peak / pricey" months={country.peakMonths} tone="warn" />
          <p className="text-xs text-muted-foreground pt-1">{country.vegScore === "easy" ? "🌱 Vegetarian-friendly" : country.vegScore === "medium" ? "🥗 Some veg options" : "🍖 Limited veg options"}</p>
        </article>

        {/* Price trend */}
        <article className="glass-card p-6 lg:col-span-3">
          <h2 className="font-display text-xl font-bold mb-1">Monthly price trend</h2>
          <p className="text-sm text-muted-foreground mb-4">Relative price index by month — 100 is average. Lower = cheaper.</p>
          <PriceTrendChart country={country} />
          <div className="mt-6">
            <MonthHeatmapStrip monthlyPriceIndex={country.monthlyPriceIndex} bestMonths={country.bestMonths} />
          </div>
        </article>

        {/* Highlights */}
        <article className="glass-card p-6 lg:col-span-2">
          <h2 className="font-display text-xl font-bold mb-4">Key destinations</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {country.highlights.map((h) => (
              <div key={h.name} className="rounded-xl border border-border/60 p-4 hover:border-primary/40 hover:bg-primary-soft/30 transition-colors space-y-2">
                <h3 className="font-semibold flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-primary" /> {h.name}</h3>
                <p className="text-sm text-muted-foreground">{h.blurb}</p>
                {h.stats && h.stats.length > 0 && (
                  <dl className="grid grid-cols-1 gap-1 pt-1 border-t border-border/40">
                    {h.stats.map((s) => (
                      <div key={s.label} className="flex justify-between text-xs">
                        <dt className="text-muted-foreground">{s.label}</dt>
                        <dd className="font-medium text-foreground">{s.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
            ))}
          </div>
        </article>

        {/* Tags + similarity */}
        <article className="glass-card p-6 space-y-5">
          <div>
            <h2 className="font-display text-xl font-bold flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-primary" /> Japan-like vibe
            </h2>
            <div className="flex items-center gap-3">
              <div className="text-4xl font-display font-extrabold text-primary">{country.similarityScore}</div>
              <div className="flex-1">
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full bg-gradient-primary" style={{ width: `${country.similarityScore}%` }} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">/ 100 vs. Japan vibe</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {rank === 1
                ? "🌸 The benchmark — this is Japan itself"
                : `Ranks #${rank} of ${total} countries · top ${topPercent}% for Japan-like feel`}
            </p>
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
          <div className="text-xs text-muted-foreground">
            Best months: <span className="text-foreground font-medium">{monthNames(country.bestMonths)}</span>
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

export default CountryDetail;
