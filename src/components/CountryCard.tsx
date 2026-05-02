import React from "react";
import { Link } from "react-router-dom";
import { Heart, Plane, Utensils, Users } from "lucide-react";
import { Country } from "@/data/countries";
import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";
import { Money, MoneyRange } from "@/components/Money";
import { TerrainChips } from "@/components/TerrainChips";
import { Flag } from "@/components/Flag";
import { terrainsFor, difficultyFor, DIFFICULTY_META } from "@/lib/terrains";
import { japanVibe } from "@/lib/japanVibe";

const vegLabel = { easy: "Veg easy", medium: "Veg medium", hard: "Veg hard" } as const;
const vegStyle = {
  easy: "bg-success-soft text-success",
  medium: "bg-warn-soft text-warn",
  hard: "bg-danger-soft text-danger",
} as const;

export function CountryCard({ country }: { country: Country }) {
  const { isFavorite, toggle } = useFavorites();
  const fav = isFavorite(country.slug);

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
          <Flag emoji={country.flag} size={36} />
          <div className="min-w-0">
            <h3 className="font-display text-lg font-bold leading-tight truncate">{country.name}</h3>
            <p className="text-xs text-muted-foreground">{country.region}</p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">{country.blurb}</p>

        <div className="grid grid-cols-2 gap-3 mt-auto">
          <Stat label="7-day cost" value={<MoneyRange range={country.costRange} />} />
          <Stat label="Daily" value={<Money usd={country.dailyCost} />} />
          <Stat label="Flights" value={<MoneyRange range={country.flightCostRange} />} icon={<Plane className="h-3 w-3" />} />
          <Stat label="Tourists" value={`${country.touristCount}M/yr`} icon={<Users className="h-3 w-3" />} />
        </div>

        <TerrainChips terrains={terrainsFor(country)} max={5} />

        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className={cn("chip", vegStyle[country.vegScore])}>
            <Utensils className="h-3 w-3" />
            {vegLabel[country.vegScore]}
          </span>
          <span className="chip bg-primary-soft text-primary">JP {japanVibe(country.slug)}/100</span>
          
          <div className="flex items-center gap-1.5 ml-auto">
             <div className="flex gap-0.5">
                {[...Array(3)].map((_, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "h-2 w-1 rounded-full",
                      i < (country.predictability / 3) ? "bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.5)]" : "bg-border/30"
                    )} 
                  />
                ))}
             </div>
             <div className={cn("h-1.5 w-1.5 rounded-full animate-pulse shadow-[0_0_8px_currentColor]", country.predictability > 7 ? "text-green-500 bg-green-500" : "text-amber-500 bg-amber-500")} />
          </div>
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
