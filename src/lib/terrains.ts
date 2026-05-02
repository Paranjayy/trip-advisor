import {
  Mountain, Waves, Building2, Trees, Snowflake, Utensils, Music, Landmark,
  Bird, Anchor, Sparkles, Sun, Flame, Compass, GlassWater, Ship,
  type LucideIcon,
} from "lucide-react";
import type { Country } from "@/data/countries";

export type Terrain =
  | "mountains" | "beaches" | "city" | "jungle" | "snow" | "desert"
  | "food" | "nightlife" | "history" | "wildlife" | "diving" | "surf"
  | "ski" | "wellness" | "lakes" | "islands" | "volcanoes" | "wine"
  // Extended tags used by curated itineraries — rendered via fallback meta.
  | "culture" | "rural" | "road-trip" | "technology" | "tech"
  | "peaks" | "rivers" | "boulders" | "beach";

export const TERRAIN_LIST: Terrain[] = [
  "mountains","beaches","city","jungle","snow","desert","food","nightlife",
  "history","wildlife","diving","surf","ski","wellness","lakes","islands",
  "volcanoes","wine",
];

export const TERRAIN_META: Record<Terrain, { label: string; icon: LucideIcon; tone: string }> = {
  mountains: { label: "Mountains", icon: Mountain,   tone: "bg-primary-soft text-primary" },
  beaches:   { label: "Beaches",   icon: Waves,      tone: "bg-success-soft text-success" },
  city:      { label: "City",      icon: Building2,  tone: "bg-secondary text-secondary-foreground" },
  jungle:    { label: "Jungle",    icon: Trees,      tone: "bg-success-soft text-success" },
  snow:      { label: "Snow",      icon: Snowflake,  tone: "bg-primary-soft text-primary" },
  desert:    { label: "Desert",    icon: Sun,        tone: "bg-warn-soft text-warn" },
  food:      { label: "Food",      icon: Utensils,   tone: "bg-accent-soft text-accent" },
  nightlife: { label: "Nightlife", icon: Music,      tone: "bg-accent-soft text-accent" },
  history:   { label: "History",   icon: Landmark,   tone: "bg-warn-soft text-warn" },
  wildlife:  { label: "Wildlife",  icon: Bird,       tone: "bg-success-soft text-success" },
  diving:    { label: "Diving",    icon: Anchor,     tone: "bg-primary-soft text-primary" },
  surf:      { label: "Surf",      icon: Ship,       tone: "bg-primary-soft text-primary" },
  ski:       { label: "Ski",       icon: Snowflake,  tone: "bg-primary-soft text-primary" },
  wellness:  { label: "Wellness",  icon: Sparkles,   tone: "bg-success-soft text-success" },
  lakes:     { label: "Lakes",     icon: GlassWater, tone: "bg-primary-soft text-primary" },
  islands:   { label: "Islands",   icon: Compass,    tone: "bg-success-soft text-success" },
  volcanoes: { label: "Volcanoes", icon: Flame,      tone: "bg-accent-soft text-accent" },
  wine:      { label: "Wine",      icon: GlassWater, tone: "bg-accent-soft text-accent" },
  // Extended (curated itinerary tags)
  culture:    { label: "Culture",    icon: Landmark,   tone: "bg-warn-soft text-warn" },
  rural:      { label: "Rural",      icon: Trees,      tone: "bg-success-soft text-success" },
  "road-trip":{ label: "Road Trip",  icon: Compass,    tone: "bg-primary-soft text-primary" },
  technology: { label: "Tech",       icon: Sparkles,   tone: "bg-secondary text-secondary-foreground" },
  tech:       { label: "Tech",       icon: Sparkles,   tone: "bg-secondary text-secondary-foreground" },
  peaks:      { label: "Peaks",      icon: Mountain,   tone: "bg-primary-soft text-primary" },
  rivers:     { label: "Rivers",     icon: GlassWater, tone: "bg-primary-soft text-primary" },
  boulders:   { label: "Boulders",   icon: Mountain,   tone: "bg-warn-soft text-warn" },
  beach:      { label: "Beach",      icon: Waves,      tone: "bg-success-soft text-success" },
};

export type Difficulty = "easy" | "moderate" | "hard";
export const DIFFICULTY_META: Record<Difficulty, { label: string; tone: string; blurb: string }> = {
  easy:     { label: "Easy",     tone: "bg-success-soft text-success", blurb: "Smooth visa, English ok, easy logistics." },
  moderate: { label: "Moderate", tone: "bg-warn-soft text-warn",       blurb: "Some planning needed — visa or language." },
  hard:     { label: "Hard",     tone: "bg-danger-soft text-danger",   blurb: "Trickier visa, remote, or rugged travel." },
};

/** Hand-picked overrides where pure tag-mapping isn't enough. */
const OVERRIDES: Record<string, Terrain[]> = {
  japan: ["city","food","mountains","snow","ski","wellness","history","islands"],
  taiwan: ["city","food","mountains","beaches","wellness","history"],
  vietnam: ["food","beaches","mountains","jungle","history","city"],
  thailand: ["beaches","islands","food","jungle","city","wellness","diving"],
  indonesia: ["beaches","islands","volcanoes","jungle","wellness","surf","diving"],
  "sri-lanka": ["beaches","mountains","wildlife","jungle","history","wellness"],
  malaysia: ["food","city","jungle","beaches","islands","diving"],
  georgia: ["mountains","wine","food","history","ski"],
  turkey: ["history","city","beaches","food","mountains"],
  poland: ["city","history","mountains","food"],
  hungary: ["city","wellness","food","wine","history"],
  romania: ["mountains","history","jungle","wildlife"],
  spain: ["food","city","beaches","history","wine","nightlife"],
  portugal: ["beaches","city","wine","surf","food","history"],
  czechia: ["city","history","food","wellness"],
  morocco: ["desert","mountains","city","history","beaches","food"],
  egypt: ["history","desert","diving","beaches"],
  philippines: ["beaches","islands","diving","jungle","surf","volcanoes"],
  "south-korea": ["city","food","mountains","snow","ski","beaches"],
  singapore: ["city","food","wellness"],
  uae: ["city","desert","beaches","food"],
  china: ["city","mountains","history","food","wildlife"],
  greece: ["beaches","islands","history","food","wine"],
  india: ["mountains","beaches","desert","jungle","wildlife","food","history","wellness","city","snow"],
  nepal: ["mountains","snow","wildlife","jungle","wellness"],
  italy: ["food","city","history","beaches","wine","mountains","ski"],
  france: ["food","city","wine","mountains","ski","beaches","history"],
  germany: ["city","food","mountains","history","wine"],
  netherlands: ["city","food","wellness"],
  uk: ["city","history","food","mountains"],
  ireland: ["mountains","city","food","history"],
  iceland: ["mountains","volcanoes","snow","wildlife","wellness"],
  norway: ["mountains","snow","wildlife","ski","wellness"],
  sweden: ["city","mountains","snow","food","wellness"],
  switzerland: ["mountains","snow","ski","lakes","wellness"],
  austria: ["mountains","city","ski","snow","wine","food"],
  croatia: ["beaches","islands","history","wine","food"],
  albania: ["beaches","mountains","history"],
  bulgaria: ["mountains","ski","history","beaches"],
  serbia: ["city","nightlife","food","mountains","ski"],
  armenia: ["mountains","wine","history"],
  kazakhstan: ["mountains","desert","city"],
  uzbekistan: ["history","desert","city","food"],
  jordan: ["desert","history","diving"],
  israel: ["history","city","food","beaches","desert","wellness"],
  "saudi-arabia": ["desert","history","city"],
  qatar: ["city","desert","food"],
  "south-africa": ["wildlife","wine","beaches","mountains","city","surf"],
  kenya: ["wildlife","beaches","mountains"],
  tanzania: ["wildlife","beaches","mountains","islands"],
  namibia: ["desert","wildlife","mountains"],
  rwanda: ["wildlife","jungle","mountains"],
  ethiopia: ["mountains","history","wildlife"],
  tunisia: ["beaches","desert","history"],
  usa: ["city","mountains","beaches","desert","food","nightlife","ski"],
  canada: ["mountains","snow","ski","wildlife","city","lakes"],
  mexico: ["beaches","food","history","jungle","diving"],
  cuba: ["beaches","city","nightlife","history"],
  "dominican-republic": ["beaches","diving","jungle"],
  "costa-rica": ["jungle","beaches","wildlife","surf","volcanoes","wellness"],
  guatemala: ["volcanoes","jungle","history","mountains"],
  panama: ["beaches","city","jungle","diving"],
  brazil: ["beaches","jungle","city","nightlife","wildlife"],
  argentina: ["mountains","wine","city","food","ski"],
  chile: ["mountains","desert","wine","ski"],
  peru: ["mountains","history","food","jungle"],
  colombia: ["beaches","city","mountains","jungle"],
  ecuador: ["mountains","wildlife","jungle","beaches","volcanoes"],
  bolivia: ["mountains","desert","wildlife"],
  australia: ["beaches","wildlife","city","desert","diving","surf"],
  "new-zealand": ["mountains","snow","ski","beaches","wildlife"],
  fiji: ["beaches","islands","diving","wellness"],
  mongolia: ["desert","mountains","wildlife"],
  bhutan: ["mountains","wellness","snow"],
  cambodia: ["history","beaches","jungle"],
  laos: ["mountains","jungle","wellness","food"],
  myanmar: ["history","mountains","beaches"],
  maldives: ["beaches","islands","diving","wellness"],
  russia: ["city","history","mountains","snow"],
};

const DIFFICULTY_OVERRIDES: Record<string, Difficulty> = {
  bhutan: "hard", "saudi-arabia": "hard", russia: "hard", ethiopia: "hard",
  myanmar: "hard", mongolia: "hard", bolivia: "hard", rwanda: "moderate",
  iran: "hard", pakistan: "hard", india: "moderate", nepal: "moderate",
  egypt: "moderate", morocco: "moderate", uzbekistan: "moderate",
  kazakhstan: "moderate", namibia: "moderate", tanzania: "moderate",
  kenya: "moderate", peru: "moderate", colombia: "moderate", brazil: "moderate",
  vietnam: "easy", thailand: "easy", japan: "easy", taiwan: "easy",
  singapore: "easy", uae: "easy", qatar: "easy", malaysia: "easy",
};

export function terrainsFor(c: Country): Terrain[] {
  if (OVERRIDES[c.slug]) return OVERRIDES[c.slug];
  // fallback: derive from tags
  const out = new Set<Terrain>();
  const t = c.tags.join(" ");
  if (/beach/i.test(t)) out.add("beaches");
  if (/city/i.test(t)) out.add("city");
  if (/food/i.test(t)) out.add("food");
  if (/wine/i.test(t)) out.add("wine");
  if (/history/i.test(t)) out.add("history");
  if (/desert/i.test(t)) out.add("desert");
  if (/diving/i.test(t)) out.add("diving");
  if (/nature/i.test(t)) out.add("mountains");
  if (/adventure/i.test(t)) out.add("mountains");
  if (/wellness|spiritual/i.test(t)) out.add("wellness");
  if (/safari/i.test(t)) out.add("wildlife");
  if (/ski/i.test(t)) { out.add("ski"); out.add("snow"); }
  if (/nightlife/i.test(t)) out.add("nightlife");
  if (out.size === 0) out.add("city");
  return [...out];
}

export function difficultyFor(c: Country): Difficulty {
  if (DIFFICULTY_OVERRIDES[c.slug]) return DIFFICULTY_OVERRIDES[c.slug];
  if (c.region === "Europe" || c.region === "Oceania") return "easy";
  if (c.region === "Africa" || c.region === "Central Asia" || c.region === "South America") return "moderate";
  return "easy";
}
