import { Country, COUNTRIES } from "@/data/countries";
import type { Terrain } from "./terrains";

export type LocalTrip = {
  name: string;
  region: string;
  days: number;
  /** approx per-person budget in USD for the local trip (excluding intl. flights) */
  budgetUsd: number;
  vibe: string;
  terrains: Terrain[];
  blurb: string;
};

/** Manually curated India local trips — what makes the dataset feel real. */
const INDIA_TRIPS: LocalTrip[] = [
  { name: "Goa beaches", region: "West India", days: 5, budgetUsd: 220, vibe: "Chill",
    terrains: ["beaches","nightlife","food"], blurb: "Susegad cafés, sunset shacks, scooter to Anjuna." },
  { name: "Manali + Kasol", region: "Himachal", days: 6, budgetUsd: 180, vibe: "Mountain",
    terrains: ["mountains","snow","wellness"], blurb: "Pine-forest cafés, Parvati valley treks, snow-line in winter." },
  { name: "Leh–Ladakh circuit", region: "Ladakh", days: 9, budgetUsd: 380, vibe: "Adventure",
    terrains: ["mountains","desert","snow","wellness"], blurb: "Pangong, Nubra dunes, monasteries at 11,000ft." },
  { name: "Spiti Valley", region: "Himachal", days: 8, budgetUsd: 320, vibe: "Adventure",
    terrains: ["mountains","desert","snow"], blurb: "Cold desert villages, Key Monastery, Chandratal." },
  { name: "Rishikesh + Haridwar", region: "Uttarakhand", days: 4, budgetUsd: 140, vibe: "Spiritual",
    terrains: ["mountains","wellness","jungle"], blurb: "Ganga aarti, yoga ashrams, white-water rafting." },
  { name: "Auli skiing", region: "Uttarakhand", days: 4, budgetUsd: 220, vibe: "Snow",
    terrains: ["snow","ski","mountains"], blurb: "Cheapest skiing in India with Nanda Devi views." },
  { name: "Jaipur–Udaipur–Jodhpur", region: "Rajasthan", days: 8, budgetUsd: 360, vibe: "Heritage",
    terrains: ["history","desert","city"], blurb: "Pink, blue, golden cities and Lake Pichola palaces." },
  { name: "Jaisalmer desert camp", region: "Rajasthan", days: 4, budgetUsd: 160, vibe: "Desert",
    terrains: ["desert","history"], blurb: "Camel safari, dune camping, golden fort." },
  { name: "Kerala backwaters", region: "South India", days: 6, budgetUsd: 280, vibe: "Chill",
    terrains: ["beaches","jungle","wellness","food"], blurb: "Alleppey houseboat, Munnar tea hills, Ayurveda." },
  { name: "Andaman Islands", region: "Andaman", days: 7, budgetUsd: 520, vibe: "Beach",
    terrains: ["beaches","islands","diving"], blurb: "Radhanagar beach, Havelock scuba, bioluminescence." },
  { name: "Meghalaya living-root bridges", region: "Northeast", days: 6, budgetUsd: 260, vibe: "Adventure",
    terrains: ["jungle","mountains","wellness"], blurb: "Cherrapunji, Dawki river, double-decker root bridge." },
  { name: "Sikkim + Darjeeling", region: "Northeast", days: 7, budgetUsd: 300, vibe: "Mountain",
    terrains: ["mountains","snow","wellness","food"], blurb: "Kanchenjunga sunrise, toy train, monasteries." },
  { name: "Varanasi spiritual", region: "Uttar Pradesh", days: 3, budgetUsd: 110, vibe: "Spiritual",
    terrains: ["history","wellness"], blurb: "Sunrise boat on the Ganges, evening aarti at Dashashwamedh." },
  { name: "Hampi ruins", region: "Karnataka", days: 4, budgetUsd: 140, vibe: "Heritage",
    terrains: ["history","mountains"], blurb: "Boulder landscapes and Vijayanagara empire ruins." },
  { name: "Pondicherry + Auroville", region: "South India", days: 4, budgetUsd: 200, vibe: "Chill",
    terrains: ["beaches","city","wellness","food"], blurb: "French quarter cafés, Matrimandir, Serenity beach." },
  { name: "Gokarna beaches", region: "Karnataka", days: 4, budgetUsd: 160, vibe: "Chill",
    terrains: ["beaches","wellness"], blurb: "Backpacker beaches — Om, Kudle, Half-moon — minus the Goa party." },
  { name: "Coorg coffee country", region: "Karnataka", days: 4, budgetUsd: 200, vibe: "Nature",
    terrains: ["mountains","jungle","wellness"], blurb: "Coffee plantations, Abbey falls, homestay weekends." },
  { name: "Kashmir valley", region: "Kashmir", days: 7, budgetUsd: 360, vibe: "Mountain",
    terrains: ["mountains","snow","wellness","lakes"], blurb: "Dal lake shikara, Gulmarg gondola, Pahalgam meadows." },
  { name: "Mumbai + Pune", region: "Maharashtra", days: 4, budgetUsd: 240, vibe: "City",
    terrains: ["city","food","nightlife","history"], blurb: "Marine drive, Bandra cafés, Ajanta-Ellora day trip." },
  { name: "Tamil temple circuit", region: "Tamil Nadu", days: 6, budgetUsd: 220, vibe: "Heritage",
    terrains: ["history","wellness","food"], blurb: "Madurai, Thanjavur, Rameswaram — Dravidian temples." },
];

const CURATED: Record<string, LocalTrip[]> = {
  india: INDIA_TRIPS,
};

/** Generate ~5 local trips from a country's existing highlights + cost. */
function generate(c: Country): LocalTrip[] {
  const dailyShare = c.dailyCost;
  return c.highlights.map((h, i) => {
    const days = 3 + ((i + c.slug.length) % 4); // 3..6 days
    const budget = Math.round(days * dailyShare * (0.85 + (i % 3) * 0.1));
    return {
      name: h.name,
      region: c.region,
      days,
      budgetUsd: budget,
      vibe: c.vibe === "adventure" ? "Adventure" : c.vibe === "chill" ? "Chill" : "Balanced",
      terrains: [],
      blurb: h.blurb,
    };
  });
}

export function localTripsFor(c: Country): LocalTrip[] {
  return CURATED[c.slug] ?? generate(c);
}

/** Search across all local trips (used by global search later). */
export function allLocalTrips(): { trip: LocalTrip; country: Country }[] {
  return COUNTRIES.flatMap((c) => localTripsFor(c).map((trip) => ({ trip, country: c })));
}
