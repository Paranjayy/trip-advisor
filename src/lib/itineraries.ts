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
  /** Latitude for mapping */
  lat?: number;
  /** Longitude for mapping */
  lng?: number;
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
  category?: "Classic" | "Road Trip" | "Backpacking" | "Luxury" | "Hidden Gem";
  type?: "base-camp" | "road-trip";
  tags?: string[];
  /** Connection to personal history or lineage (1-5, 1 being direct) */
  degreesOfSeparation?: number;
  /** Personal note on the connection */
  connectionNote?: string;
};

export function getGoogleMapsUrl(itinerary: Itinerary) {
  const stops = itinerary.plan.flatMap(p => p.stops.map(s => s.place));
  const uniqueStops = Array.from(new Set(stops));
  if (uniqueStops.length === 0) return "";
  
  const origin = encodeURIComponent(uniqueStops[0]);
  const destination = encodeURIComponent(uniqueStops[uniqueStops.length - 1]);
  const waypoints = uniqueStops.slice(1, -1).map(s => encodeURIComponent(s)).join("|");
  
  return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${waypoints ? `&waypoints=${waypoints}` : ""}&travelmode=driving`;
}

/** ---------- Curated itineraries ---------- */

export const ITINERARIES: Itinerary[] = [
  {
    slug: "kashmir-lineage-scholarly-3d",
    title: "Kashmir Lineage & Scholarly Path — 3 days",
    countrySlug: "india",
    region: "Srinagar & Pahalgam, India",
    flag: "🇮🇳",
    days: 3,
    bestMonths: [4, 5, 6, 9, 10],
    difficulty: "easy",
    terrains: ["mountains", "culture", "history"],
    type: "base-camp",
    blurb: "Follow the footsteps of the Karachi scholars. A high-recovery base camp stay focusing on archives and the Lidder pulse.",
    totalUsd: 280,
    highlights: ["Dal Lake Base Camp", "Lidder River Meditation", "Old Srinagar Archive Search"],
    category: "Hidden Gem",
    tags: ["Lineage", "Recovery", "History"],
    degreesOfSeparation: 1,
    connectionNote: "Direct tie to family's scholarly history in Kashmir/Karachi.",
    plan: [
      {
        day: 1, title: "Srinagar Base Camp & Library", base: "Srinagar (Dal Lake)",
        stayUsd: 80,
        stops: [
          { place: "Dal Lake Houseboat", activity: "Establish base camp with mountain views", hours: 2, km: 0, mode: "walk", costUsd: 80, lat: 34.0837, lng: 74.8327 },
          { place: "Old Srinagar Archives", activity: "Searching for scholarly records of the Karachi scholar", hours: 4, km: 5, mode: "car", costUsd: 10 },
          { place: "Shankaracharya Hill", activity: "Sunset view over the scholarly valley", hours: 2, km: 8, mode: "car", costUsd: 5, lat: 34.0722, lng: 74.8450 },
        ],
      },
      {
        day: 2, title: "The Lidder Pulse (Pahalgam)", base: "Srinagar (Dal Lake)",
        stayUsd: 80,
        stops: [
          { place: "Lidder River", activity: "High-recovery river sitting and meditation", hours: 5, km: 90, mode: "car", costUsd: 40, lat: 34.0161, lng: 75.3145 },
          { place: "Aru Valley", activity: "Scholarly solitude walk in the pines", hours: 3, km: 12, mode: "car", costUsd: 15 },
        ],
      },
      {
        day: 3, title: "Heritage & Recovery", base: "Srinagar (Dal Lake)",
        stayUsd: 80,
        stops: [
          { place: "Jamia Masjid", activity: "Architectural study of Islamic scholar routes", hours: 2, km: 6, mode: "car", costUsd: 5 },
          { place: "Ahdoos Panjim", activity: "Traditional Wazwan feast (The 'God' Build)", hours: 3, km: 2, mode: "walk", costUsd: 30 },
          { place: "Mughal Gardens", activity: "Symmetry and order for mental clarity", hours: 3, km: 10, mode: "car", costUsd: 8 },
        ],
      },
    ],
  },
  {
    slug: "pahalgam-retreat-5d",
    title: "Pahalgam Retreat — 5 days",
    countrySlug: "india",
    region: "Kashmir, India",
    flag: "🇮🇳",
    days: 5,
    bestMonths: [4, 5, 6, 9, 10],
    difficulty: "easy",
    terrains: ["mountains", "wellness", "snow"],
    type: "base-camp",
    blurb:
      "A zero-hustle stay in Pahalgam. Focus on the Lidder river, pine forests, and slow mornings. High recovery, low decision load.",
    totalUsd: 420,
    highlights: ["Misty mornings at Aru Valley", "Riverside breakfast by the Lidder", "Short walk to Betaab Valley", "Kashmiri Kahwa sessions"],
    category: "Luxury",
    tags: ["Recovery", "Wellness", "Nature", "Family"],
    degreesOfSeparation: 2,
    connectionNote: "Grandfather's scholarly roots in the region; connection to Karachi lineage.",
    plan: [
      {
        day: 1, title: "Arrive Srinagar → Transfer to Pahalgam", base: "Pahalgam",
        stayUsd: 65,
        stops: [
          { place: "SXR airport → Pahalgam", activity: "Direct scenic transfer, skip Srinagar hustle", hours: 2.5, km: 90, mode: "car", costUsd: 25, lat: 34.0161, lng: 75.3150 },
          { place: "Pahalgam Riverside", activity: "Check-in & evening walk by Lidder", hours: 2, km: 1, mode: "walk", costUsd: 10, lat: 34.0140, lng: 75.3250 },
        ],
      },
      {
        day: 2, title: "Aru Valley Solitude", base: "Pahalgam",
        stayUsd: 65,
        stops: [
          { place: "Aru Valley", activity: "Morning picnic in the pine meadow", hours: 4, km: 12, mode: "car", costUsd: 15, lat: 34.0906, lng: 75.2636 },
          { place: "Local Pahalgam Bakery", activity: "Traditional Girda & Kahwa break", hours: 1.5, km: 2, mode: "walk", costUsd: 5 },
        ],
      },
      {
        day: 3, title: "Betaab & Chandanwari", base: "Pahalgam",
        stayUsd: 65,
        stops: [
          { place: "Betaab Valley", activity: "Slow photography & river sitting", hours: 3, km: 15, mode: "car", costUsd: 10, lat: 34.0494, lng: 75.3700 },
          { place: "Chandanwari", activity: "Viewpoint of the snow-capped peaks", hours: 2, km: 16, mode: "car", costUsd: 12, lat: 34.0536, lng: 75.4419 },
        ],
      },
      {
        day: 4, title: "Pahalgam Club & Rest", base: "Pahalgam",
        stayUsd: 65,
        stops: [
          { place: "Pahalgam Club Garden", activity: "Reading & mountain watching", hours: 3, km: 0.5, mode: "walk", costUsd: 5 },
          { place: "Main Market", activity: "Walnut wood & shawl browsing (no rush)", hours: 2, km: 1, mode: "walk", costUsd: 15 },
        ],
      },
      {
        day: 5, title: "Departure", base: "Srinagar",
        stayUsd: 0,
        stops: [
          { place: "Pahalgam → SXR airport", activity: "Direct return transfer", hours: 2.5, km: 90, mode: "car", costUsd: 25 },
        ],
      },
    ],
  },
  {
    slug: "goa-heritage-slow-4d",
    title: "Goa Heritage & Slow Burn — 4 days",
    countrySlug: "india",
    region: "Goa, India",
    flag: "🇮🇳",
    days: 4,
    bestMonths: [11, 12, 1, 2],
    difficulty: "easy",
    terrains: ["beaches", "food", "history"],
    type: "base-camp",
    blurb: "Skip the party, embrace the susegad. Old Latin quarters, backwater cruises, and zero-agenda beach days.",
    totalUsd: 380,
    highlights: ["Fontainhas heritage walk", "Divar Island ferry", "Sunset at Mandovi river", "Seafood thali in Panjim"],
    category: "Hidden Gem",
    tags: ["Culture", "Relaxation", "Food"],
    degreesOfSeparation: 4,
    connectionNote: "Frequent family getaway; low cognitive load for recurring visits.",
    plan: [
      {
        day: 1, title: "Panjim & Fontainhas", base: "Panjim",
        stayUsd: 55,
        stops: [
          { place: "GOI airport → Panjim", activity: "Transfer to Latin Quarter", hours: 1, km: 28, mode: "car", costUsd: 15 },
          { place: "Fontainhas", activity: "Walk through colourful Portuguese-style streets", hours: 2, km: 2, mode: "walk", costUsd: 5 },
          { place: "Panjim Church", activity: "Immaculate Conception visit", hours: 1, km: 1, mode: "walk", costUsd: 0 },
        ],
      },
      {
        day: 2, title: "Divar Island & Backwaters", base: "Panjim",
        stayUsd: 55,
        stops: [
          { place: "Panjim → Divar Island", activity: "Ferry across the Mandovi", hours: 1, km: 10, mode: "boat", costUsd: 2 },
          { place: "Divar Village", activity: "Bicycle exploration of the silent island", hours: 3, km: 15, mode: "bike", costUsd: 10 },
          { place: "Mandovi River", activity: "Private boat cruise at sunset", hours: 2, km: 5, mode: "boat", costUsd: 30 },
        ],
      },
      {
        day: 3, title: "South Goa Beaches", base: "Agonda",
        stayUsd: 45,
        stops: [
          { place: "Panjim → Agonda", activity: "Drive to the quiet south", hours: 1.5, km: 70, mode: "car", costUsd: 20 },
          { place: "Agonda Beach", activity: "Reading & swimming (no shacks, no noise)", hours: 4, km: 0, mode: "walk", costUsd: 0 },
          { place: "Cabo de Rama", activity: "Sunset over the Arabian Sea from the fort", hours: 2, km: 15, mode: "car", costUsd: 10 },
        ],
      },
      {
        day: 4, title: "Departure", base: "Agonda",
        stayUsd: 0,
        stops: [
          { place: "Agonda → GOX/GOI airport", activity: "Return transfer", hours: 1.5, km: 65, mode: "car", costUsd: 20 },
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
    category: "Road Trip",
    tags: ["Adventure", "Mountains", "High Altitude"],
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
    category: "Classic",
    tags: ["City", "Food", "Tech", "Zen"],
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
    category: "Backpacking",
    tags: ["Beach", "Islands", "Party", "Relax"],
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
  {
    slug: "iceland-ring-road-12d",
    title: "Iceland Full Ring Road — 12 days",
    countrySlug: "iceland",
    region: "National circuit",
    flag: "🇮🇸",
    days: 12,
    bestMonths: [6, 7, 8, 9],
    difficulty: "moderate",
    terrains: ["mountains", "snow", "islands"],
    blurb: "The ultimate 1,300km drive through glaciers, volcanic black sands, and massive waterfalls. Best done in a campervan.",
    totalUsd: 2200,
    highlights: ["Blue Lagoon soak", "Jökulsárlón glacier lagoon", "Mývatn volcanic craters", "Skógafoss waterfall"],
    category: "Road Trip",
    tags: ["Adventure", "Nature", "Photography", "Camping"],
    plan: [
      { day: 1, title: "Arrive Reykjavik · Blue Lagoon", base: "Reykjavik", stayUsd: 110,
        stops: [
          { place: "KEF airport → Blue Lagoon", activity: "Geothermal spa soak", hours: 3, km: 25, mode: "car", costUsd: 85, lat: 63.8792, lng: -22.4451 },
          { place: "Reykjavik", activity: "Hallgrimskirkja church & dinner", hours: 3, km: 50, mode: "car", costUsd: 45, lat: 64.1419, lng: -21.9266 },
        ] },
      { day: 2, title: "Golden Circle", base: "Hella", stayUsd: 95,
        stops: [
          { place: "Þingvellir", activity: "Tectonic plate walk", hours: 2, km: 50, mode: "car", costUsd: 10, lat: 64.2559, lng: -21.1295 },
          { place: "Geysir", activity: "Strokkur eruption every 10 min", hours: 1, km: 60, mode: "car", costUsd: 0, lat: 64.3104, lng: -20.3024 },
          { place: "Gullfoss", activity: "Massive golden waterfall", hours: 1, km: 10, mode: "car", costUsd: 0, lat: 64.3271, lng: -20.1199 },
        ] },
      { day: 3, title: "South Coast Waterfalls", base: "Vík", stayUsd: 120,
        stops: [
          { place: "Seljalandsfoss", activity: "Walk behind the waterfall", hours: 1.5, km: 95, mode: "car", costUsd: 5, lat: 63.6156, lng: -19.9886 },
          { place: "Skógafoss", activity: "Climb the stairs to the top", hours: 1.5, km: 30, mode: "car", costUsd: 0, lat: 63.5321, lng: -19.5113 },
          { place: "Reynisfjara", activity: "Black sand beach & basalt columns", hours: 2, km: 35, mode: "car", costUsd: 0, lat: 63.4025, lng: -19.0436 },
        ] },
      { day: 4, title: "East Fjords", base: "Egilsstaðir", stayUsd: 110,
        stops: [
          { place: "Vík → Jökulsárlón", activity: "Glacier lagoon boat tour", hours: 5, km: 190, mode: "car", costUsd: 75, lat: 64.0484, lng: -16.1778 },
          { place: "Diamond Beach", activity: "Icebergs on black sand", hours: 1, km: 1, mode: "walk", costUsd: 0, lat: 64.0430, lng: -16.1750 },
          { place: "Höfn", activity: "Langoustine lunch stop", hours: 1.5, km: 80, mode: "car", costUsd: 45, lat: 64.2539, lng: -15.2082 },
        ] },
      { day: 5, title: "Lake Mývatn", base: "Mývatn", stayUsd: 95,
        stops: [
          { place: "Egilsstaðir → Mývatn", activity: "Vibrant sulphur springs & craters", hours: 4, km: 165, mode: "car", costUsd: 10, lat: 65.6412, lng: -16.9112 },
          { place: "Mývatn Nature Baths", activity: "Blue lagoon of the North", hours: 3, km: 5, mode: "car", costUsd: 55, lat: 65.6310, lng: -16.8478 },
        ] },
    ]
  },
  {
    slug: "vietnam-north-to-south-14d",
    title: "Vietnam North to South — 14 days",
    countrySlug: "vietnam",
    region: "Country-wide",
    flag: "🇻🇳",
    days: 14,
    bestMonths: [2, 3, 4, 9, 10, 11],
    difficulty: "moderate",
    terrains: ["food", "beaches", "city", "history"],
    blurb: "From Hanoi's old quarter to the Mekong Delta. Includes Ha Long Bay cruise and Hoi An's lantern-lit streets.",
    totalUsd: 840,
    highlights: ["Overnight cruise in Ha Long Bay", "Hoi An tailor-made clothes", "Cuchi Tunnels history", "Mekong Delta river life"],
    category: "Classic",
    tags: ["Cultural", "Food", "History", "Budget"],
    plan: [
      { day: 1, title: "Hanoi — Old Quarter", base: "Hanoi", stayUsd: 22,
        stops: [
          { place: "Noi Bai airport → Hotel", activity: "Grab car transfer", hours: 1, km: 30, mode: "car", costUsd: 12, lat: 21.2131, lng: 105.8048 },
          { place: "Old Quarter", activity: "Street food walk & Egg Coffee", hours: 3, km: 2, mode: "walk", costUsd: 15, lat: 21.0333, lng: 105.8500 },
        ] },
      { day: 2, title: "Ha Long Bay Cruise", base: "Ha Long (Boat)", stayUsd: 120,
        stops: [
          { place: "Hanoi → Ha Long", activity: "Luxury shuttle bus", hours: 2.5, km: 160, mode: "bus", costUsd: 25, lat: 20.9416, lng: 107.0811 },
          { place: "Halong Cruise", activity: "Kayaking & sunset on deck", hours: 6, km: 20, mode: "boat", costUsd: 80, lat: 20.8400, lng: 107.2400 },
        ] },
      { day: 3, title: "Flight to Da Nang · Hoi An", base: "Hoi An", stayUsd: 35,
        stops: [
          { place: "Ha Long → Hanoi airport", activity: "Transfer", hours: 3, km: 160, mode: "bus", costUsd: 20 },
          { place: "Hanoi → Da Nang", activity: "Domestic flight", hours: 1.25, km: 630, mode: "flight", costUsd: 45 },
          { place: "Hoi An Old Town", activity: "Lantern walk & custom tailoring", hours: 3, km: 30, mode: "car", costUsd: 15, lat: 15.8801, lng: 108.3271 },
        ] },
      { day: 4, title: "Hoi An — Cooking & Chill", base: "Hoi An", stayUsd: 35,
        stops: [
          { place: "Tra Que village", activity: "Bicycle tour & cooking class", hours: 4, km: 10, mode: "bike", costUsd: 25, lat: 15.9000, lng: 108.3400 },
          { place: "An Bang beach", activity: "Seafood lunch & swimming", hours: 3, km: 5, mode: "bike", costUsd: 12, lat: 15.9122, lng: 108.3406 },
        ] },
    ]
  },
  {
    slug: "switzerland-peaks-7d",
    title: "Swiss Peaks & Glaciers — 7 days",
    countrySlug: "switzerland",
    region: "Central Alps",
    flag: "🇨🇭",
    days: 7,
    bestMonths: [6, 7, 8, 12, 1, 2],
    difficulty: "moderate",
    terrains: ["mountains", "snow", "lakes", "wellness"],
    blurb: "The ultimate alpine loop: Zurich, Lucerne, Interlaken, and the 'Top of Europe' Jungfraujoch. Clean, fast, and stunning.",
    totalUsd: 2100,
    highlights: ["Jungfraujoch Sphinx Observatory", "Mt Pilatus steepest cogwheel railway", "Interlaken paragliding", "Lake Brienz turquoise waters"],
    category: "Classic",
    tags: ["Luxury", "Mountains", "Nature"],
    plan: [
      { day: 1, title: "Arrive Zurich · Lucerne", base: "Lucerne", stayUsd: 180,
        stops: [
          { place: "ZRH airport → Lucerne", activity: "Scenic SBB train ride", hours: 1, km: 68, mode: "train", costUsd: 35 },
          { place: "Chapel Bridge (Kapellbrücke)", activity: "Old town walk & fondue dinner", hours: 3, km: 1, mode: "walk", costUsd: 65 },
        ] },
      { day: 2, title: "Mt Pilatus Gold Round Trip", base: "Lucerne", stayUsd: 180,
        stops: [
          { place: "Lake Lucerne boat", activity: "Cruise to Alpnachstad", hours: 1.5, km: 15, mode: "boat", costUsd: 25 },
          { place: "Pilatus Cogwheel", activity: "World's steepest railway (48% gradient)", hours: 1, km: 4, mode: "train", costUsd: 45 },
          { place: "Pilatus summit", activity: "Alpine views & dragon trail", hours: 2, km: 0, mode: "walk", costUsd: 0 },
        ] },
      { day: 3, title: "Lucerne → Interlaken", base: "Interlaken", stayUsd: 160,
        stops: [
          { place: "Luzern-Interlaken Express", activity: "Premium panoramic train journey", hours: 2, km: 75, mode: "train", costUsd: 42 },
          { place: "Harder Kulm", activity: "Funicular to Interlaken's 'house mountain'", hours: 2, km: 2, mode: "train", costUsd: 35 },
        ] },
    ]
  },
  {
    slug: "thailand-north-7d",
    title: "Northern Thailand Loop — 7 days",
    countrySlug: "thailand",
    region: "Chiang Mai & Pai",
    flag: "🇹🇭",
    days: 7,
    bestMonths: [11, 12, 1, 2],
    difficulty: "moderate",
    terrains: ["mountains", "food", "history", "wellness"],
    blurb: "Temples in Chiang Mai, 762 curves to the bohemian paradise of Pai, and elephant sanctuaries.",
    totalUsd: 420,
    highlights: ["Wat Phra That Doi Suthep", "Pai Canyon at sunset", "Chiang Mai Sunday Market", "Lod Cave bamboo rafting"],
    category: "Backpacking",
    tags: ["Bohemian", "Mountains", "Street Food"],
    plan: [
      { day: 1, title: "Chiang Mai — Temple Crawl", base: "Chiang Mai", stayUsd: 22,
        stops: [
          { place: "Wat Chedi Luang", activity: "Ancient Lanna ruins", hours: 2, km: 5, mode: "car", costUsd: 5 },
          { place: "Doi Suthep", activity: "Golden mountain temple at sunset", hours: 3, km: 15, mode: "car", costUsd: 12 },
          { place: "Sunday Night Market", activity: "The ultimate street food feast", hours: 3, km: 2, mode: "walk", costUsd: 18 },
        ] },
      { day: 2, title: "Road to Pai (762 curves)", base: "Pai", stayUsd: 18,
        stops: [
          { place: "Chiang Mai → Pai", activity: "Minibus or motorbike challenge", hours: 3.5, km: 130, mode: "bus", costUsd: 8 },
          { place: "Pai Canyon", activity: "Sunset ridge walk", hours: 2, km: 8, mode: "car", costUsd: 2 },
          { place: "Pai Walking Street", activity: "Night bazaar dinner", hours: 2, km: 1, mode: "walk", costUsd: 12 },
        ] },
    ]
  },
  {
    slug: "rajasthan-royal-9d",
    title: "Rajasthan Royal Loop — 9 days",
    countrySlug: "india",
    region: "Rajasthan, India",
    flag: "🇮🇳",
    days: 9,
    bestMonths: [10, 11, 12, 1, 2, 3],
    difficulty: "moderate",
    terrains: ["desert", "history", "city", "food"],
    blurb: "The Land of Kings: Pink City Jaipur, Blue City Jodhpur, and the City of Lakes Udaipur. Palaces, forts, and sand dunes.",
    totalUsd: 680,
    highlights: ["Amer Fort elephant ride", "Jodhpur Mehrangarh Fort", "Udaipur Lake Palace boat ride", "Jaisalmer desert safari"],
    category: "Classic",
    tags: ["Royal", "History", "Photography"],
    plan: [
      { day: 1, title: "Arrive Jaipur", base: "Jaipur", stayUsd: 45,
        stops: [
          { place: "JAI airport → City", activity: "Transfer to heritage haveli", hours: 1, km: 12, mode: "car", costUsd: 8 },
          { place: "Hawa Mahal", activity: "Evening walk around the Palace of Winds", hours: 2, km: 2, mode: "walk", costUsd: 5 },
        ] },
    ]
  },
  {
    slug: "kerala-backwaters-7d",
    title: "Kerala Backwaters & Hills — 7 days",
    countrySlug: "india",
    region: "Kerala, India",
    flag: "🇮🇳",
    days: 7,
    bestMonths: [9, 10, 11, 12, 1, 2, 3],
    difficulty: "easy",
    terrains: ["wellness", "lakes", "beaches", "mountains"],
    blurb: "God's Own Country: Kochi's history, Munnar's tea gardens, and an overnight houseboat in Alleppey.",
    totalUsd: 540,
    highlights: ["Munnar Tea Gardens", "Alleppey Houseboat", "Kochi Chinese Fishing Nets", "Thekkady Spice Plantation"],
    category: "Classic",
    tags: ["Nature", "Wellness", "Relaxation"],
    plan: [
      { day: 1, title: "Arrive Kochi", base: "Kochi", stayUsd: 38,
        stops: [
          { place: "COK airport → Fort Kochi", activity: "Transfer to historic district", hours: 1.5, km: 36, mode: "car", costUsd: 15 },
          { place: "Chinese Fishing Nets", activity: "Sunset walk & seafood dinner", hours: 2, km: 1, mode: "walk", costUsd: 22 },
        ] },
    ]
  },
  {
    slug: "italy-classic-10d",
    title: "Italy Art & Pasta Loop — 10 days",
    countrySlug: "italy",
    region: "Central Italy",
    flag: "🇮🇹",
    days: 10,
    bestMonths: [5, 6, 9, 10],
    difficulty: "easy",
    terrains: ["city", "food", "history"],
    blurb: "Rome's ruins, Florence's art, and the floating canals of Venice. The ultimate first-time Italy route.",
    totalUsd: 1950,
    highlights: ["Colosseum at night", "Florence Uffizi Gallery", "Venice Gondola ride", "Roman street food tour"],
    category: "Classic",
    tags: ["Culture", "Food", "History"],
    plan: [
      { day: 1, title: "Arrive Rome", base: "Rome", stayUsd: 120,
        stops: [
          { place: "FCO airport → Termini", activity: "Leonardo Express train", hours: 1, km: 32, mode: "train", costUsd: 16 },
          { place: "Trastevere", activity: "Evening food crawl: Cacio e Pepe", hours: 3, km: 2, mode: "walk", costUsd: 45 },
        ] },
      { day: 2, title: "Ancient Rome", base: "Rome", stayUsd: 120,
        stops: [
          { place: "Colosseum & Forum", activity: "Guided skip-the-line tour", hours: 4, km: 3, mode: "walk", costUsd: 55 },
          { place: "Trevi Fountain", activity: "Coin toss & gelato break", hours: 1, km: 2, mode: "walk", costUsd: 8 },
        ] },
    ]
  },
  {
    slug: "norway-fjords-8d",
    title: "Norway Fjords & Peaks — 8 days",
    countrySlug: "norway",
    region: "Western Fjords",
    flag: "🇳🇴",
    days: 8,
    bestMonths: [6, 7, 8],
    difficulty: "moderate",
    terrains: ["mountains", "lakes", "snow"],
    blurb: "From Bergen's colorful wharf to the deep Geirangerfjord. Includes the world-famous Flåm railway.",
    totalUsd: 2400,
    highlights: ["Geirangerfjord cruise", "Preikestolen (Pulpit Rock) hike", "Flåm Railway", "Bryggen Wharf"],
    category: "Road Trip",
    tags: ["Nature", "Adventure", "Landscape"],
    plan: [
      { day: 1, title: "Bergen Arrival", base: "Bergen", stayUsd: 150,
        stops: [
          { place: "BGO airport → City", activity: "Light rail transfer", hours: 1, km: 18, mode: "train", costUsd: 12 },
          { place: "Bryggen", activity: "Hanseatic wharf walk & fish market", hours: 2, km: 1, mode: "walk", costUsd: 35 },
        ] },
    ]
  },
  {
    slug: "bali-backpacker-7d",
    title: "Bali Spirit & Surf — 7 days",
    countrySlug: "indonesia",
    region: "Bali",
    flag: "🇮🇩",
    days: 7,
    bestMonths: [5, 6, 7, 8, 9],
    difficulty: "easy",
    terrains: ["beaches", "wellness", "food", "mountains"],
    blurb: "Ubud's rice terraces, Canggu's surf vibes, and the sacred monkeys of the forest.",
    totalUsd: 580,
    highlights: ["Tegalalang Rice Terrace", "Uluwatu Temple fire dance", "Canggu sunset surf", "Monkey Forest"],
    category: "Backpacking",
    tags: ["Spiritual", "Beach", "Budget"],
    plan: [
      { day: 1, title: "Ubud Arrival", base: "Ubud", stayUsd: 35,
        stops: [
          { place: "DPS airport → Ubud", activity: "Private car transfer", hours: 1.5, km: 38, mode: "car", costUsd: 22 },
          { place: "Ubud Center", activity: "Nasi Campur dinner & Balinese dance", hours: 3, km: 1, mode: "walk", costUsd: 18 },
        ] },
    ]
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

/** 
 * Calculates a 'Friction Score' from 1-10 
 * based on distance, hours, and mode switches.
 */
export function calculateFriction(it: Itinerary): number {
  const km = totalKm(it);
  const hrs = totalHours(it);
  const stops = it.plan.flatMap(d => d.stops).length;
  const days = it.days;

  // Base score from intensity (avg km/day and hrs/day)
  const kmPerDay = km / days;
  const hrsPerDay = hrs / days;
  
  let score = 1;
  
  // km contribution (up to 4 points)
  if (kmPerDay > 300) score += 4;
  else if (kmPerDay > 150) score += 3;
  else if (kmPerDay > 50) score += 2;
  else if (kmPerDay > 10) score += 1;
  
  // hrs contribution (up to 4 points)
  if (hrsPerDay > 8) score += 4;
  else if (hrsPerDay > 6) score += 3;
  else if (hrsPerDay > 4) score += 2;
  else if (hrsPerDay > 2) score += 1;
  
  // diversity/complexity contribution (up to 2 points)
  const modes = new Set(it.plan.flatMap(d => d.stops).map(s => s.mode));
  if (modes.size > 4) score += 2;
  else if (modes.size > 2) score += 1;

  return Math.min(10, Math.max(1, Math.round(score)));
}

export function getFrictionLabel(score: number): { label: string, color: string } {
  if (score <= 3) return { label: "Zen (Relaxed)", color: "text-green-500 bg-green-500/10 border-green-500/20" };
  if (score <= 6) return { label: "Balanced", color: "text-blue-500 bg-blue-500/10 border-blue-500/20" };
  if (score <= 8) return { label: "High Energy", color: "text-orange-500 bg-orange-500/10 border-orange-500/20" };
  return { label: "Extreme / Hustle", color: "text-red-500 bg-red-500/10 border-red-500/20" };
}
