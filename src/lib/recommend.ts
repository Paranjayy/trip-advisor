import { Country, COUNTRIES, MONTHS } from "@/data/countries";
import { japanVibe } from "@/lib/japanVibe";

export type RecInput = {
  budget: number; // 7-day USD per person target
  month: number; // 1-12
  vibe: "any" | "chill" | "adventure" | "balanced";
  vegFriendly: boolean;
  japanLike: boolean;
};

export type Recommendation = {
  country: Country;
  score: number;
  reasons: string[];
};

export function recommend(input: RecInput): Recommendation[] {
  const scored = COUNTRIES.map((c) => {
    const reasons: string[] = [];
    let score = 0;

    // Budget fit (max 40)
    const [lo, hi] = c.costRange;
    if (input.budget >= lo && input.budget <= hi) {
      score += 40;
      reasons.push(`Fits your $${input.budget} budget perfectly`);
    } else if (input.budget >= hi) {
      score += 32;
      reasons.push(`Comfortably under your $${input.budget} budget`);
    } else if (input.budget >= lo * 0.8) {
      score += 20;
      reasons.push(`Slightly tight but doable on $${input.budget}`);
    } else {
      score += Math.max(0, 20 - Math.round((lo - input.budget) / 80));
    }

    // Month fit (max 30)
    const idx = c.monthlyPriceIndex[input.month - 1];
    if (c.bestMonths.includes(input.month)) {
      score += 30;
      reasons.push(`${MONTHS[input.month - 1]} is one of the best months to go`);
    } else if (c.cheapestMonths.includes(input.month)) {
      score += 22;
      reasons.push(`${MONTHS[input.month - 1]} is shoulder season — cheaper prices`);
    } else if (c.peakMonths.includes(input.month)) {
      score += 8;
      reasons.push(`Heads up: ${MONTHS[input.month - 1]} is peak pricing`);
    } else {
      score += idx < 100 ? 18 : 12;
    }

    // Vibe (max 15)
    if (input.vibe === "any" || input.vibe === c.vibe) {
      score += 15;
      if (input.vibe !== "any") reasons.push(`Matches your "${c.vibe}" vibe`);
    } else if (c.vibe === "balanced") {
      score += 10;
    }

    // Veg (max 10)
    if (input.vegFriendly) {
      if (c.vegScore === "easy") {
        score += 10;
        reasons.push("Excellent vegetarian options");
      } else if (c.vegScore === "medium") {
        score += 5;
      }
    } else {
      score += 5;
    }

    // Japan-likeness (max 15) — uses dynamic similarity
    const jp = japanVibe(c.slug);
    if (input.japanLike) {
      score += Math.round((jp / 100) * 15);
      if (jp >= 70) reasons.push(`Strong Japan-like vibe (${jp}/100)`);
    } else {
      score += 7;
    }

    return { country: c, score, reasons: reasons.slice(0, 3) };
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, 3);
}

import { terrainsFor, type Terrain } from "@/lib/terrains";

export type Filters = {
  query: string;
  region: string; // "all" or region name
  budgetMax: number;
  vegFriendly: boolean;
  vibe: "any" | "chill" | "adventure" | "balanced";
  japanLike: boolean;
  terrains?: Terrain[]; // any-of match
};

export function filterCountries(items: Country[], f: Filters): Country[] {
  return items.filter((c) => {
    if (f.query && !`${c.name} ${c.region} ${c.tags.join(" ")}`.toLowerCase().includes(f.query.toLowerCase())) return false;
    if (f.region !== "all" && c.region !== f.region) return false;
    if (c.costRange[0] > f.budgetMax) return false;
    if (f.vegFriendly && c.vegScore === "hard") return false;
    if (f.vibe !== "any" && c.vibe !== f.vibe && c.vibe !== "balanced") return false;
    if (f.japanLike && japanVibe(c.slug) < 60) return false;
    if (f.terrains && f.terrains.length > 0) {
      const ts = new Set(terrainsFor(c));
      if (!f.terrains.some((t) => ts.has(t))) return false;
    }
    return true;
  });
}
