import { Link } from "react-router-dom";
import { Heart, Plane, Utensils, Users } from "lucide-react";
import { Country } from "@/data/countries";
import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";
import { Money, MoneyRange } from "@/components/Money";
import { getVibeRank } from "@/lib/recommend";

const vegLabel = { easy: "Veg easy", medium: "Veg medium", hard: "Veg hard" } as const;
const vegStyle = {
  easy: "bg-success-soft text-success",
  medium: "bg-warn-soft text-warn",
  hard: "bg-danger-soft text-danger",
} as const;

/** Map tag names to a single display emoji for the variety strip */
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

function varietyEmojis(tags: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const tag of tags) {
    const emoji = TAG_EMOJI[tag];
    if (emoji && !seen.has(emoji)) {
      seen.add(emoji);
      result.push(emoji);
    }
    if (result.length >= 4) break;
  }
  return result;
}

export function CountryCard({ country, tripDays = 7 }: { country: Country; tripDays?: number }) {
  const { isFavorite, toggle } = useFavorites();
  const fav = isFavorite(country.slug);
  const { rank, topPercent, total } = getVibeRank(country.similarityScore);
  const vibeLabel = rank === 1 ? "🌸 Benchmark" : `Top ${topPercent}%`;
  const emojis = varietyEmojis(country.tags);
  const tripCost = country.dailyCost * tripDays;

  return (
    <article className="glass-card hover-lift group relative flex flex-col p-5 animate-fade-in">
      <button
        onClick={(e) => {
          e.preventDefault();
          toggle(country.slug);
        }}
        aria-label={fav ? "Remove from favorites" : "Save to favorites"}
        className={cn(
          "absolute top-4 right-4 z-10 grid h-9 w-9 place-items-center rounded-full border border-border/60 bg-background/80 backdrop-blur transition-colors",
          fav ? "text-accent" : "text-muted-foreground hover:text-accent",
        )}
      >
        <Heart className={cn("h-4 w-4", fav && "fill-accent")} />
      </button>

      <Link to={`/country/${country.slug}`} className="flex flex-col gap-4 flex-1">
        <div className="flex items-start gap-3">
          <span className="text-4xl leading-none" aria-hidden>{country.flag}</span>
          <div className="min-w-0">
            <h3 className="font-display text-lg font-bold leading-tight truncate">{country.name}</h3>
            <p className="text-xs text-muted-foreground">{country.region}</p>
          </div>
        </div>

        {emojis.length > 0 && (
          <div className="flex gap-1.5 -mt-1">
            {emojis.map((e) => (
              <span key={e} className="text-base leading-none" aria-hidden>{e}</span>
            ))}
          </div>
        )}

        <p className="text-sm text-muted-foreground line-clamp-2">{country.blurb}</p>

        <div className="grid grid-cols-2 gap-3 mt-auto">
          <Stat label={`${tripDays}d cost`} value={<Money usd={tripCost} />} />
          <Stat label="Daily" value={<Money usd={country.dailyCost} />} />
          <Stat label="Flights" value={<MoneyRange range={country.flightCostRange} />} icon={<Plane className="h-3 w-3" />} />
          <Stat label="Tourists" value={`${country.touristCount}M/yr`} icon={<Users className="h-3 w-3" />} />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className={cn("chip", vegStyle[country.vegScore])}>
            <Utensils className="h-3 w-3" />
            {vegLabel[country.vegScore]}
          </span>
          <span
            className="chip bg-primary-soft text-primary"
            title={`Ranks #${rank} of ${total} countries for Japan-like vibe`}
          >
            🌸 {vibeLabel}
          </span>
        </div>
      </Link>
    </article>
  );
}

function Stat({ label, value, icon }: { label: string; value: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-surface-muted px-3 py-2">
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-muted-foreground">
        {icon}{label}
      </div>
      <div className="text-sm font-semibold mt-0.5">{value}</div>
    </div>
  );
}
