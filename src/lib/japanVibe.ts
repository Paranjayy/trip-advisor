import { Country, COUNTRIES } from "@/data/countries";
import { terrainsFor, difficultyFor } from "./terrains";

const JAPAN = COUNTRIES.find((c) => c.slug === "japan")!;
const JP_TERRAINS = new Set(terrainsFor(JAPAN));
const JP_TAGS = new Set(JAPAN.tags);

function rawSimilarity(a: Country, b: Country): number {
  const at = new Set(terrainsFor(a));
  const bt = new Set(terrainsFor(b));
  const interT = [...at].filter((x) => bt.has(x)).length;
  const unionT = new Set([...at, ...bt]).size;
  const tScore = unionT === 0 ? 0 : interT / unionT; // 0..1

  const tagInter = a.tags.filter((t) => b.tags.includes(t)).length;
  const tagScore = tagInter / Math.max(a.tags.length, b.tags.length);

  const vegMap = { easy: 0, medium: 1, hard: 2 } as const;
  const vegDiff = Math.abs(vegMap[a.vegScore] - vegMap[b.vegScore]); // 0..2
  const vegScore = 1 - vegDiff / 2;

  const costDiff = Math.abs(a.dailyCost - b.dailyCost);
  const costScore = Math.max(0, 1 - costDiff / 200);

  const tourScore = Math.min(1, Math.min(a.touristCount, b.touristCount) / 25);

  const dMap = { easy: 0, moderate: 1, hard: 2 } as const;
  const diffScore = 1 - Math.abs(dMap[difficultyFor(a)] - dMap[difficultyFor(b)]) / 2;

  const vibeScore = a.vibe === b.vibe ? 1 : a.vibe === "balanced" || b.vibe === "balanced" ? 0.6 : 0.3;

  return (
    tScore * 0.32 +
    tagScore * 0.18 +
    vegScore * 0.10 +
    costScore * 0.15 +
    tourScore * 0.08 +
    diffScore * 0.07 +
    vibeScore * 0.10
  );
}

/** Map slug -> Japan-likeness 0..100, normalized across the dataset. */
export const JAPAN_VIBE: Record<string, number> = (() => {
  const raws = COUNTRIES.map((c) => ({ slug: c.slug, raw: c.slug === "japan" ? 1 : rawSimilarity(c, JAPAN) }));
  const others = raws.filter((r) => r.slug !== "japan").map((r) => r.raw);
  const min = Math.min(...others);
  const max = Math.max(...others);
  const out: Record<string, number> = {};
  for (const r of raws) {
    if (r.slug === "japan") { out[r.slug] = 100; continue; }
    const norm = max === min ? 0.5 : (r.raw - min) / (max - min);
    out[r.slug] = Math.round(15 + norm * 80); // 15..95
  }
  return out;
})();

export function japanVibe(slug: string): number {
  return JAPAN_VIBE[slug] ?? 0;
}

/** Top-N most similar countries to `slug` (excluding itself). */
export function similarCountries(slug: string, n = 4): { country: Country; score: number }[] {
  const me = COUNTRIES.find((c) => c.slug === slug);
  if (!me) return [];
  const scored = COUNTRIES.filter((c) => c.slug !== slug).map((c) => ({
    country: c,
    score: Math.round(rawSimilarity(c, me) * 100),
  }));
  return scored.sort((a, b) => b.score - a.score).slice(0, n);
}
