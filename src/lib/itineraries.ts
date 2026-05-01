import type { Terrain } from "./terrains";

export type ItineraryStop = {
  /** Place name */
  place: string;
  /** Activity headline */
  activity: string;
  /** Optional sub-notes */
  notes?: string;
  /** Hours spent on this stop (incl. travel from previous) */
  hours: number;
  /** Km travelled to reach this stop from the previous one */
  km: number;
  /** Mode of transport used to reach this stop */
  mode: "walk" | "car" | "bus" | "train" | "flight" | "boat" | "bike";
  /** Per-person USD cost (transport + activity + meals share) */
  costUsd: number;
};

export type ItineraryDay = {
  day: number;
  title: string;
  base: string; // city/town you sleep in tonight
  stops: ItineraryStop[];
  stayUsd: number; // cost of one night's accommodation per person
};

export type Itinerary = {
  slug: string;
  title: string;
  countrySlug: string;
  region: string;
  flag: string;
  days: number;
  bestMonths: number[];
  difficulty: "easy" | "moderate" | "hard";
  terrains: Terrain[];
  blurb: string;
  /** Total per-person budget USD (excludes intl. flights) */
  totalUsd: number;
  highlights: string[];
  plan: ItineraryDay[];
};

/** ---------- Curated itineraries ---------- */

export const ITINERARIES: Itinerary[] = [
  {
    slug: "srinagar-kashmir-7d",
    title: "Srinagar & Kashmir Valley — 7 days",
    countrySlug: "india",
    region: "Kashmir, India",
    flag: "🇮🇳",
    days: 7,
    bestMonths: [4, 5, 6, 9, 10],
    difficulty: "moderate",
    terrains: ["mountains", "lakes", "wellness", "snow"],
    blurb:
      "Houseboats on Dal Lake, alpine meadows of Sonamarg & Pahalgam, and the Gulmarg gondola with views to K2 on a clear day.",
    totalUsd: 540,
    highlights: ["Shikara at sunrise on Dal Lake", "Gulmarg Gondola Phase II (3,979m)", "Aru & Betaab valleys", "Mughal gardens — Nishat & Shalimar"],
    plan: [
      {
        day: 1, title: "Arrive Srinagar — settle on Dal Lake", base: "Srinagar (houseboat)",
        stayUsd: 35,
        stops: [
          { place: "SXR airport → Dal Lake", activity: "Transfer + houseboat check-in", hours: 1.5, km: 18, mode: "car", costUsd: 8 },
          { place: "Dal Lake", activity: "Sunset shikara to lotus gardens", hours: 2, km: 4, mode: "boat", costUsd: 12 },
          { place: "Lal Chowk / Polo View", activity: "Wazwan dinner & Kashmiri kahwa", hours: 2, km: 6, mode: "car", costUsd: 14 },
        ],
      },
      {
        day: 2, title: "Old Srinagar + Mughal gardens", base: "Srinagar (houseboat)",
        stayUsd: 35,
        stops: [
          { place: "Hazratbal & Jamia Masjid", activity: "Old town walk through papier-mâché bazaar", hours: 3, km: 9, mode: "car", costUsd: 6 },
          { place: "Nishat Bagh", activity: "Mughal terrace garden, Zabarwan views", hours: 1.5, km: 11, mode: "car", costUsd: 4 },
          { place: "Shalimar Bagh", activity: "Shah Jahan's chinar-lined garden", hours: 1.5, km: 4, mode: "car", costUsd: 3 },
          { place: "Pari Mahal", activity: "Sunset over Dal from the hilltop ruin", hours: 1.5, km: 8, mode: "car", costUsd: 4 },
        ],
      },
      {
        day: 3, title: "Gulmarg gondola day", base: "Gulmarg",
        stayUsd: 45,
        stops: [
          { place: "Srinagar → Tangmarg", activity: "Drive through paddy fields & pine forest", hours: 1.75, km: 51, mode: "car", costUsd: 14 },
          { place: "Gulmarg Gondola Phase 1", activity: "Cable-car to Kongdoori (3,080m)", hours: 1.5, km: 5, mode: "car", costUsd: 12 },
          { place: "Gulmarg Phase 2", activity: "World's 2nd-highest gondola to Apharwat (3,979m)", hours: 2, km: 5, mode: "car", costUsd: 22 },
          { place: "Strawberry Valley", activity: "Pony ride through alpine meadow", hours: 1.5, km: 4, mode: "walk", costUsd: 8 },
        ],
      },
      {
        day: 4, title: "Pahalgam & Betaab Valley", base: "Pahalgam",
        stayUsd: 38,
        stops: [
          { place: "Gulmarg → Pahalgam", activity: "Cross-valley drive via Anantnag", hours: 4.5, km: 145, mode: "car", costUsd: 28 },
          { place: "Saffron fields, Pampore", activity: "Quick stop at the world's saffron capital", hours: 0.75, km: 0, mode: "car", costUsd: 4 },
          { place: "Betaab Valley", activity: "Riverside walk at the Bollywood-famous valley", hours: 2, km: 15, mode: "car", costUsd: 6 },
          { place: "Lidder River", activity: "Optional rafting (Grade II–III)", hours: 1.5, km: 3, mode: "car", costUsd: 14 },
        ],
      },
      {
        day: 5, title: "Aru & Chandanwari excursion", base: "Pahalgam",
        stayUsd: 38,
        stops: [
          { place: "Aru Valley", activity: "Pine-forest meadow, gateway to Kolahoi glacier", hours: 3, km: 12, mode: "car", costUsd: 8 },
          { place: "Chandanwari", activity: "Snow bridge & start of Amarnath yatra", hours: 2.5, km: 16, mode: "car", costUsd: 9 },
          { place: "Pahalgam market", activity: "Walnut wood shopping, kahwa break", hours: 1.5, km: 4, mode: "walk", costUsd: 6 },
        ],
      },
      {
        day: 6, title: "Sonamarg — meadow of gold", base: "Srinagar (houseboat)",
        stayUsd: 35,
        stops: [
          { place: "Pahalgam → Sonamarg", activity: "Long scenic drive via Srinagar bypass", hours: 5, km: 175, mode: "car", costUsd: 30 },
          { place: "Thajiwas Glacier", activity: "Pony ride or 4km hike to glacier viewpoint", hours: 3, km: 4, mode: "walk", costUsd: 18 },
          { place: "Zoji La viewpoint", activity: "Highest pass on Srinagar–Leh highway", hours: 1, km: 12, mode: "car", costUsd: 5 },
          { place: "Sonamarg → Srinagar", activity: "Return drive along Sindh river", hours: 2.5, km: 80, mode: "car", costUsd: 14 },
        ],
      },
      {
        day: 7, title: "Doodhpathri & departure", base: "Srinagar",
        stayUsd: 0,
        stops: [
          { place: "Doodhpathri", activity: "Less-touristed milk-meadow day-trip", hours: 4, km: 42, mode: "car", costUsd: 18 },
          { place: "Srinagar Old Town", activity: "Last walk: Shah-e-Hamdan & Khanqah", hours: 2, km: 14, mode: "car", costUsd: 6 },
          { place: "SXR airport", activity: "Departure", hours: 1, km: 16, mode: "car", costUsd: 8 },
        ],
      },
    ],
  },

  {
    slug: "leh-ladakh-9d",
    title: "Leh–Ladakh circuit — 9 days",
    countrySlug: "india",
    region: "Ladakh, India",
    flag: "🇮🇳",
    days: 9,
    bestMonths: [6, 7, 8, 9],
    difficulty: "hard",
    terrains: ["mountains", "desert", "snow", "wellness"],
    blurb: "High-altitude desert circuit: Pangong, Nubra dunes, monasteries clinging to cliffs. Acclimatize for 2 days before driving.",
    totalUsd: 720,
    highlights: ["Khardung La (5,359m)", "Pangong Tso", "Nubra dunes & double-hump camels", "Hemis & Thiksey monasteries"],
    plan: [
      { day: 1, title: "Arrive Leh — acclimatize", base: "Leh", stayUsd: 28,
        stops: [
          { place: "Leh airport → guesthouse", activity: "Rest, hydrate, no exertion (3,500m)", hours: 6, km: 6, mode: "car", costUsd: 5 },
          { place: "Leh Main Bazaar", activity: "Short evening walk for thukpa & momos", hours: 1.5, km: 1, mode: "walk", costUsd: 8 },
        ] },
      { day: 2, title: "Leh acclimatization day", base: "Leh", stayUsd: 28,
        stops: [
          { place: "Shanti Stupa", activity: "Sunrise viewpoint over Leh", hours: 1.5, km: 4, mode: "car", costUsd: 4 },
          { place: "Leh Palace", activity: "9-storey royal ruin", hours: 2, km: 1, mode: "walk", costUsd: 3 },
          { place: "Hall of Fame", activity: "Indian Army museum, Kargil exhibits", hours: 1.5, km: 5, mode: "car", costUsd: 4 },
        ] },
      { day: 3, title: "Sham Valley loop", base: "Leh", stayUsd: 28,
        stops: [
          { place: "Magnetic Hill", activity: "Optical-illusion hill", hours: 1, km: 30, mode: "car", costUsd: 6 },
          { place: "Sangam (Indus + Zanskar)", activity: "Two-toned river confluence", hours: 1, km: 5, mode: "car", costUsd: 4 },
          { place: "Likir Monastery", activity: "Massive gold Maitreya Buddha", hours: 1.5, km: 25, mode: "car", costUsd: 5 },
          { place: "Alchi", activity: "11th-century murals", hours: 1.5, km: 16, mode: "car", costUsd: 4 },
        ] },
      { day: 4, title: "Leh → Nubra via Khardung La", base: "Hunder", stayUsd: 32,
        stops: [
          { place: "Khardung La (5,359m)", activity: "World's highest motorable pass photo stop (15 min max)", hours: 2.5, km: 39, mode: "car", costUsd: 18 },
          { place: "Diskit Monastery", activity: "Giant 32m Maitreya facing Pakistan", hours: 1.5, km: 79, mode: "car", costUsd: 22 },
          { place: "Hunder dunes", activity: "Bactrian camel ride on cold-desert dunes", hours: 2, km: 8, mode: "car", costUsd: 14 },
        ] },
      { day: 5, title: "Turtuk village day-trip", base: "Hunder", stayUsd: 32,
        stops: [
          { place: "Turtuk", activity: "Last village before Pakistan, Balti culture", hours: 3, km: 90, mode: "car", costUsd: 26 },
          { place: "Sand-dune sunset Hunder", activity: "Photographer's golden hour", hours: 1.5, km: 90, mode: "car", costUsd: 18 },
        ] },
      { day: 6, title: "Nubra → Pangong via Shyok", base: "Pangong", stayUsd: 30,
        stops: [
          { place: "Shyok river road", activity: "Spectacular gorge drive (rough)", hours: 6, km: 165, mode: "car", costUsd: 35 },
          { place: "Pangong Tso (3 Idiots point)", activity: "Sunset on the colour-changing lake", hours: 2, km: 15, mode: "car", costUsd: 8 },
        ] },
      { day: 7, title: "Pangong sunrise → Leh via Chang La", base: "Leh", stayUsd: 28,
        stops: [
          { place: "Pangong sunrise", activity: "Worth waking up at 5am for", hours: 1.5, km: 0, mode: "walk", costUsd: 0 },
          { place: "Chang La (5,360m)", activity: "Second-highest motorable pass", hours: 2, km: 95, mode: "car", costUsd: 20 },
          { place: "Hemis Monastery", activity: "Largest & richest Ladakhi gompa", hours: 1.5, km: 60, mode: "car", costUsd: 14 },
          { place: "Thiksey Monastery", activity: "'Mini-Potala' silhouette at sunset", hours: 1.5, km: 18, mode: "car", costUsd: 6 },
        ] },
      { day: 8, title: "Tso Moriri or rest day", base: "Leh", stayUsd: 28,
        stops: [
          { place: "Stok Palace", activity: "Royal museum of Ladakh", hours: 2, km: 16, mode: "car", costUsd: 6 },
          { place: "Leh cafés", activity: "Apricot pie & souvenir shopping", hours: 3, km: 2, mode: "walk", costUsd: 18 },
        ] },
      { day: 9, title: "Departure", base: "Leh", stayUsd: 0,
        stops: [
          { place: "IXL airport", activity: "Early-morning flight (only AM departures)", hours: 1, km: 6, mode: "car", costUsd: 5 },
        ] },
    ],
  },

  {
    slug: "japan-classic-10d",
    title: "Japan classic — Tokyo · Hakone · Kyoto · Osaka — 10 days",
    countrySlug: "japan",
    region: "Honshu, Japan",
    flag: "🇯🇵",
    days: 10,
    bestMonths: [3, 4, 10, 11],
    difficulty: "easy",
    terrains: ["city", "food", "history", "wellness", "mountains"],
    blurb: "First-timer's dream loop: neon Tokyo, Mt Fuji onsen, Kyoto temples, Osaka street food. Use a 7-day JR Pass.",
    totalUsd: 1850,
    highlights: ["Shibuya scramble at night", "Mt Fuji from Hakone Ropeway", "Fushimi Inari at dawn", "Dotonbori takoyaki crawl"],
    plan: [
      { day: 1, title: "Arrive Tokyo — Shinjuku night", base: "Tokyo (Shinjuku)", stayUsd: 95,
        stops: [
          { place: "Narita → Shinjuku", activity: "N'EX train", hours: 1.5, km: 79, mode: "train", costUsd: 22 },
          { place: "Omoide Yokocho", activity: "Yakitori alley dinner", hours: 2, km: 1, mode: "walk", costUsd: 28 },
          { place: "Tokyo Metro Govt Bldg obs.", activity: "Free 202m skyline view", hours: 1, km: 1, mode: "walk", costUsd: 0 },
        ] },
      { day: 2, title: "Shibuya · Harajuku · Meiji", base: "Tokyo", stayUsd: 95,
        stops: [
          { place: "Meiji Jingu", activity: "Forest shrine in city centre", hours: 1.5, km: 4, mode: "train", costUsd: 2 },
          { place: "Takeshita Street", activity: "Crepes & quirky kawaii shopping", hours: 1.5, km: 1, mode: "walk", costUsd: 14 },
          { place: "Shibuya scramble + Sky", activity: "Famous crossing + 230m rooftop", hours: 3, km: 2, mode: "walk", costUsd: 26 },
        ] },
      { day: 3, title: "Asakusa · Akihabara · teamLab", base: "Tokyo", stayUsd: 95,
        stops: [
          { place: "Sensō-ji + Nakamise", activity: "Tokyo's oldest temple", hours: 2, km: 9, mode: "train", costUsd: 3 },
          { place: "Akihabara", activity: "Anime, electronics, retro arcades", hours: 2.5, km: 6, mode: "train", costUsd: 12 },
          { place: "teamLab Borderless Azabudai", activity: "Immersive digital art", hours: 3, km: 8, mode: "train", costUsd: 28 },
        ] },
      { day: 4, title: "Tokyo → Hakone (onsen)", base: "Hakone", stayUsd: 145,
        stops: [
          { place: "Romancecar to Hakone-Yumoto", activity: "Limited express through mountains", hours: 1.5, km: 92, mode: "train", costUsd: 20 },
          { place: "Hakone loop", activity: "Cable car + ropeway over Owakudani sulphur valley", hours: 3, km: 15, mode: "train", costUsd: 38 },
          { place: "Lake Ashi pirate ship", activity: "Mt Fuji views (clear days)", hours: 1.5, km: 6, mode: "boat", costUsd: 14 },
          { place: "Ryokan onsen + kaiseki", activity: "Hot-spring bath, multi-course dinner", hours: 4, km: 0, mode: "walk", costUsd: 0 },
        ] },
      { day: 5, title: "Hakone → Kyoto by Shinkansen", base: "Kyoto", stayUsd: 90,
        stops: [
          { place: "Odawara → Kyoto", activity: "Shinkansen Hikari", hours: 2.5, km: 360, mode: "train", costUsd: 95 },
          { place: "Gion district", activity: "Evening walk through Geisha quarter", hours: 2, km: 3, mode: "walk", costUsd: 8 },
          { place: "Pontocho alley", activity: "Riverside dinner street", hours: 2, km: 1, mode: "walk", costUsd: 32 },
        ] },
      { day: 6, title: "Fushimi · Arashiyama", base: "Kyoto", stayUsd: 90,
        stops: [
          { place: "Fushimi Inari", activity: "10,000 vermillion torii gates (start before 7am)", hours: 3, km: 6, mode: "train", costUsd: 4 },
          { place: "Arashiyama bamboo grove", activity: "Iconic green tunnel + Tenryū-ji", hours: 3, km: 18, mode: "train", costUsd: 6 },
          { place: "Iwatayama monkey park", activity: "Hike up for snow-monkey close-ups", hours: 2, km: 2, mode: "walk", costUsd: 5 },
        ] },
      { day: 7, title: "Higashiyama temple walk", base: "Kyoto", stayUsd: 90,
        stops: [
          { place: "Kiyomizu-dera", activity: "Stilted hilltop temple", hours: 2, km: 5, mode: "bus", costUsd: 4 },
          { place: "Sannenzaka & Ninenzaka", activity: "Preserved sloped lanes", hours: 2, km: 1, mode: "walk", costUsd: 12 },
          { place: "Yasaka shrine + Maruyama", activity: "Traditional shrine gardens", hours: 2, km: 1, mode: "walk", costUsd: 4 },
          { place: "Nishiki Market", activity: "'Kyoto's kitchen' street-food crawl", hours: 1.5, km: 3, mode: "walk", costUsd: 18 },
        ] },
      { day: 8, title: "Day trip — Nara", base: "Kyoto", stayUsd: 90,
        stops: [
          { place: "Nara Park deer", activity: "Bow-greeting deer & shika senbei", hours: 2, km: 42, mode: "train", costUsd: 10 },
          { place: "Tōdai-ji", activity: "Giant bronze Buddha hall", hours: 1.5, km: 1, mode: "walk", costUsd: 5 },
          { place: "Kasuga Taisha", activity: "Lantern-lined forest shrine", hours: 1.5, km: 2, mode: "walk", costUsd: 4 },
        ] },
      { day: 9, title: "Kyoto → Osaka", base: "Osaka", stayUsd: 70,
        stops: [
          { place: "Kyoto → Osaka", activity: "Quick local train", hours: 0.75, km: 56, mode: "train", costUsd: 6 },
          { place: "Osaka Castle", activity: "Hilltop keep + park", hours: 2, km: 5, mode: "train", costUsd: 8 },
          { place: "Dotonbori", activity: "Glico sign, takoyaki, kushikatsu crawl", hours: 3, km: 3, mode: "walk", costUsd: 30 },
        ] },
      { day: 10, title: "Departure", base: "Osaka", stayUsd: 0,
        stops: [
          { place: "Namba → KIX airport", activity: "Nankai Rapi:t express", hours: 1, km: 49, mode: "train", costUsd: 12 },
        ] },
    ],
  },

  {
    slug: "thailand-island-hop-8d",
    title: "Thailand island hop — Bangkok · Krabi · Phi Phi — 8 days",
    countrySlug: "thailand",
    region: "Andaman & central Thailand",
    flag: "🇹🇭",
    days: 8,
    bestMonths: [11, 12, 1, 2, 3],
    difficulty: "easy",
    terrains: ["beaches", "islands", "food", "diving", "city"],
    blurb: "Two days of street food in Bangkok, then sleeper train south for Krabi limestone karsts and Phi Phi snorkeling.",
    totalUsd: 780,
    highlights: ["Wat Arun at golden hour", "Railay long-tail beach", "Maya Bay (The Beach)", "Tiger Cave temple stairs"],
    plan: [
      { day: 1, title: "Bangkok — Old City", base: "Bangkok", stayUsd: 32,
        stops: [
          { place: "Grand Palace + Wat Pho", activity: "Reclining Buddha & royal complex", hours: 3, km: 10, mode: "car", costUsd: 18 },
          { place: "Wat Arun by ferry", activity: "Cross river, climb the temple of dawn", hours: 2, km: 1, mode: "boat", costUsd: 5 },
          { place: "Khao San Road", activity: "Backpacker street, pad thai stalls", hours: 2, km: 4, mode: "car", costUsd: 12 },
        ] },
      { day: 2, title: "Markets + nightlife", base: "Bangkok", stayUsd: 32,
        stops: [
          { place: "Chatuchak weekend market", activity: "8,000 stalls, plan 3+ hrs", hours: 4, km: 12, mode: "train", costUsd: 22 },
          { place: "Chinatown food crawl", activity: "Yaowarat oyster omelette + mango sticky rice", hours: 3, km: 6, mode: "car", costUsd: 18 },
        ] },
      { day: 3, title: "Bangkok → Krabi", base: "Ao Nang", stayUsd: 38,
        stops: [
          { place: "DMK → Krabi airport", activity: "1.5hr flight south", hours: 2, km: 780, mode: "flight", costUsd: 55 },
          { place: "Ao Nang beach", activity: "Sunset & seafood BBQ", hours: 3, km: 22, mode: "car", costUsd: 24 },
        ] },
      { day: 4, title: "Railay + Tiger Cave", base: "Ao Nang", stayUsd: 38,
        stops: [
          { place: "Railay long-tail", activity: "Boat to Phra Nang cave + west beach", hours: 4, km: 5, mode: "boat", costUsd: 18 },
          { place: "Tiger Cave (Wat Tham Suea)", activity: "1,237 steps to summit Buddha", hours: 3, km: 18, mode: "car", costUsd: 10 },
        ] },
      { day: 5, title: "4-island tour", base: "Ao Nang", stayUsd: 38,
        stops: [
          { place: "Chicken / Tup / Poda / Phra Nang", activity: "Speedboat snorkel hop", hours: 7, km: 35, mode: "boat", costUsd: 32 },
        ] },
      { day: 6, title: "Krabi → Phi Phi", base: "Koh Phi Phi", stayUsd: 48,
        stops: [
          { place: "Krabi pier → Phi Phi", activity: "Ferry 90 min", hours: 2, km: 42, mode: "boat", costUsd: 18 },
          { place: "Viewpoint hike", activity: "Climb to Phi Phi Don viewpoint 2", hours: 2, km: 2, mode: "walk", costUsd: 4 },
          { place: "Loh Dalum sunset", activity: "Beachfront fire shows", hours: 3, km: 1, mode: "walk", costUsd: 22 },
        ] },
      { day: 7, title: "Maya Bay tour", base: "Koh Phi Phi", stayUsd: 48,
        stops: [
          { place: "Maya Bay + Bamboo Island", activity: "Early-bird boat to beat crowds", hours: 6, km: 28, mode: "boat", costUsd: 38 },
          { place: "Monkey Bay snorkel", activity: "Reef + cheeky macaques", hours: 1.5, km: 4, mode: "boat", costUsd: 0 },
        ] },
      { day: 8, title: "Return + departure", base: "Phuket", stayUsd: 0,
        stops: [
          { place: "Phi Phi → Phuket airport", activity: "Ferry + transfer", hours: 4, km: 88, mode: "boat", costUsd: 30 },
        ] },
    ],
  },
];

export function getItinerary(slug: string) {
  return ITINERARIES.find((i) => i.slug === slug);
}

/** Helpers for summary stats */
export function totalKm(it: Itinerary): number {
  return it.plan.reduce((s, d) => s + d.stops.reduce((s2, st) => s2 + st.km, 0), 0);
}
export function totalHours(it: Itinerary): number {
  return it.plan.reduce((s, d) => s + d.stops.reduce((s2, st) => s2 + st.hours, 0), 0);
}
export function totalCost(it: Itinerary): number {
  return it.plan.reduce(
    (s, d) => s + d.stayUsd + d.stops.reduce((s2, st) => s2 + st.costUsd, 0),
    0,
  );
}
