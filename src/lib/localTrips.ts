import { Country, COUNTRIES } from "@/data/countries";
import type { Terrain } from "./terrains";

export type ItineraryDay = {
  day: number;
  title: string;
  description: string;
  distanceKm?: number;
  durationHours?: number;
  highlights: string[];
};

export type LocalTrip = {
  name: string;
  region: string;
  days: number;
  /** approx per-person budget in USD for the local trip (excluding intl. flights) */
  budgetUsd: number;
  vibe: string;
  terrains: Terrain[];
  blurb: string;
  itinerary?: ItineraryDay[];
};

/** Manually curated India local trips — what makes the dataset feel real. */
const INDIA_TRIPS: LocalTrip[] = [
  {
    name: "Srinagar & Kashmir Valley",
    region: "Kashmir",
    days: 7,
    budgetUsd: 390,
    vibe: "Mountain",
    terrains: ["mountains", "snow", "wellness", "lakes"],
    blurb: "Floating gardens on Dal Lake, gondola to Gulmarg snowfields, saffron villages of Pampore — Kashmir at its finest.",
    itinerary: [
      {
        day: 1,
        title: "Arrival in Srinagar — Dal Lake & Old City",
        description: "Fly into Sheikh ul-Alam airport. Check into a Dal Lake houseboat (shikhara taxi from the ghat). Evening shikara ride past floating vegetable markets and lotus gardens.",
        distanceKm: 8,
        durationHours: 4,
        highlights: ["Dal Lake houseboat check-in", "Sunset shikara ride", "Hazratbal Shrine visit"],
      },
      {
        day: 2,
        title: "Srinagar City — Mughal Gardens & Shankaracharya",
        description: "Morning at Shalimar Bagh, Nishat Bagh, and Chashme Shahi Mughal gardens terraced above the lake. Afternoon hike up Shankaracharya Hill (2,000ft) for panoramic valley views. Evening stroll through Lal Chowk and local craft bazaars.",
        distanceKm: 22,
        durationHours: 7,
        highlights: ["Shalimar Bagh terraces", "Nishat Bagh rose gardens", "Shankaracharya Temple", "Handicraft shopping"],
      },
      {
        day: 3,
        title: "Gulmarg — Gondola & Snow Play",
        description: "Drive 56 km west to Gulmarg (2,650m). Take Asia's highest cable car in two phases to Apharwat Peak (4,200m) for Himalayan snow views. Skiing or snowboarding in winter; meadow trekking in summer.",
        distanceKm: 56,
        durationHours: 8,
        highlights: ["Gulmarg Gondola Phase 1 & 2", "Apharwat Peak snow fields", "Baba Reshi shrine", "Kongdori meadow"],
      },
      {
        day: 4,
        title: "Pahalgam — Lidder River & Aru Valley",
        description: "Drive 95 km south-east to Pahalgam (2,130m), the 'Valley of Shepherds'. Trek along the crystal Lidder river to Baisaran meadow (mini-Switzerland). Afternoon ride to Aru Valley through pine forests.",
        distanceKm: 95,
        durationHours: 9,
        highlights: ["Lidder river bank", "Baisaran meadow (horse ride)", "Aru Valley trek", "Chandanwari viewpoint"],
      },
      {
        day: 5,
        title: "Betaab Valley & Awantipura Ruins",
        description: "Morning in Betaab Valley (named after a Bollywood film), a broad meadow ringed by glacial peaks. Return via 9th-century Awantipura temple ruins. Stop at Pampore for saffron fields (in bloom Oct–Nov).",
        distanceKm: 40,
        durationHours: 6,
        highlights: ["Betaab Valley meadows", "Awantipura ruins (free entry)", "Pampore saffron fields"],
      },
      {
        day: 6,
        title: "Sonamarg — Glacier Day Trip",
        description: "Drive 84 km north-east to Sonamarg (2,730m), 'Meadow of Gold'. Pony or jeep to Thajiwas Glacier — walk on a living glacier. Stop at Baltal on the way back, starting point of the Amarnath yatra.",
        distanceKm: 84,
        durationHours: 9,
        highlights: ["Thajiwas Glacier walk", "Zero Point snowfield", "Baltal camp viewpoint"],
      },
      {
        day: 7,
        title: "Final Morning — Wular Lake & Departure",
        description: "Early drive to Wular Lake, Asia's largest freshwater lake, for birdwatching. Pick up Kashmiri walnut woodwork and pashmina shawls in the old city before flying out. Total road travel: ~400 km over the week.",
        distanceKm: 65,
        durationHours: 4,
        highlights: ["Wular Lake bird-watching", "Pashmina & walnut shopping", "Jamia Masjid old city"],
      },
    ],
  },
  {
    name: "Leh–Ladakh circuit",
    region: "Ladakh",
    days: 9,
    budgetUsd: 380,
    vibe: "Adventure",
    terrains: ["mountains", "desert", "snow", "wellness"],
    blurb: "Pangong, Nubra dunes, monasteries at 11,000ft.",
    itinerary: [
      { day: 1, title: "Arrive Leh — Acclimatize", description: "Rest at 3,500m. Short walk to Shanti Stupa for sunset views. Hydrate, no strenuous activity.", distanceKm: 5, durationHours: 3, highlights: ["Shanti Stupa", "Leh market"] },
      { day: 2, title: "Leh City — Monasteries", description: "Leh Palace, Namgyal Tsemo Gompa, Sankar monastery. Easy half-day to continue acclimatization.", distanceKm: 12, durationHours: 5, highlights: ["Leh Palace", "Namgyal Tsemo", "Sankar Gompa"] },
      { day: 3, title: "Hemis & Thiksey — Southern Monasteries", description: "Drive south to Thiksey's 12-storey monastery and Hemis Gompa (largest in Ladakh). Return via Shey palace ruins.", distanceKm: 70, durationHours: 7, highlights: ["Thiksey Monastery", "Hemis Gompa", "Shey Palace"] },
      { day: 4, title: "Khardung La & Nubra Valley", description: "Cross Khardung La (5,359m, one of world's highest motorable passes). Descend to Nubra Valley (Diskit, Hunder sand dunes). Double-humped Bactrian camel ride at sunset.", distanceKm: 120, durationHours: 8, highlights: ["Khardung La pass", "Diskit Monastery", "Hunder sand dunes", "Bactrian camel ride"] },
      { day: 5, title: "Nubra — Turtuk Village", description: "Drive to Turtuk, northernmost Indian village near Pakistan border. Balti culture, apricot orchards, glacier streams.", distanceKm: 88, durationHours: 7, highlights: ["Turtuk village", "Balti food & culture", "Shyok river"] },
      { day: 6, title: "Return Leh via Sumur", description: "Sumur monastery and Yarab Tso lake (flamingos in summer). Scenic drive back along Shyok river.", distanceKm: 150, durationHours: 8, highlights: ["Samstanling Monastery Sumur", "Yarab Tso lake"] },
      { day: 7, title: "Pangong Lake — Turquoise Dream", description: "Drive via Chang La (5,360m) to Pangong Tso — electric blue lake at 4,350m. Camp or stay in tents by the shore.", distanceKm: 160, durationHours: 7, highlights: ["Chang La pass", "Pangong Tso sunrise/sunset", "Lakeside camp"] },
      { day: 8, title: "Pangong to Tso Moriri (via Hanle)", description: "Remote route south through Hanle for dark-sky stargazing. Reach Tso Moriri wildlife sanctuary (Tibetan wolves, kiang).", distanceKm: 210, durationHours: 9, highlights: ["Hanle Observatory", "Tso Moriri lake", "Kiang sighting"] },
      { day: 9, title: "Return Leh & Depart", description: "Morning walk at Tso Moriri, drive back via Chumathang hot springs. Afternoon flight out of Leh.", distanceKm: 230, durationHours: 8, highlights: ["Chumathang hot springs", "Indus Valley views"] },
    ],
  },
  {
    name: "Kerala backwaters",
    region: "South India",
    days: 6,
    budgetUsd: 280,
    vibe: "Chill",
    terrains: ["beaches", "jungle", "wellness", "food"],
    blurb: "Alleppey houseboat, Munnar tea hills, Ayurveda.",
    itinerary: [
      { day: 1, title: "Arrive Kochi — Fort Kochi", description: "Chinese fishing nets, Dutch Palace, Jewish synagogue, Fort Kochi art district. Evening Kathakali performance.", distanceKm: 10, durationHours: 5, highlights: ["Chinese fishing nets", "Fort Kochi heritage walk", "Kathakali performance"] },
      { day: 2, title: "Munnar — Tea Plantation Hills", description: "Drive 130km to Munnar (1,600m). Endless tea estates, Echo Point, Top Station views into Tamil Nadu.", distanceKm: 130, durationHours: 7, highlights: ["Tea museum", "Eravikulam National Park (Nilgiri tahr)", "Top Station viewpoint"] },
      { day: 3, title: "Munnar — Waterfalls & Wildlife", description: "Attukal waterfall trail. Night safari chance at Chinnar Wildlife Sanctuary. Freshly brewed estate tea.", distanceKm: 50, durationHours: 6, highlights: ["Attukal waterfall", "Chinnar Wildlife", "Tea tasting"] },
      { day: 4, title: "Alleppey — Houseboat Check-in", description: "Drive 160km to Alleppey (Alappuzha). Board a kettuvallam rice-boat houseboat. Float through narrow canals, coir villages, paddy fields.", distanceKm: 160, durationHours: 5, highlights: ["Houseboat cruise", "Backwater villages", "Onboard Kerala lunch"] },
      { day: 5, title: "Kovalam / Varkala Beach", description: "Drive to Kovalam or Varkala cliff beach. Ayurvedic massage on the beach. Cliff-top yoga session at sunset.", distanceKm: 140, durationHours: 6, highlights: ["Varkala cliff beach", "Ayurvedic treatment", "Sunset at Papanasam"] },
      { day: 6, title: "Trivandrum — Padmanabhaswamy & Depart", description: "Visit India's richest temple (outside view). Napier Museum. Fly out from TRV.", distanceKm: 30, durationHours: 4, highlights: ["Padmanabhaswamy Temple", "Napier Museum", "Street food — Sadhya"] },
    ],
  },
  {
    name: "Goa beaches",
    region: "West India",
    days: 5,
    budgetUsd: 220,
    vibe: "Chill",
    terrains: ["beaches", "nightlife", "food"],
    blurb: "Susegad cafés, sunset shacks, scooter to Anjuna.",
    itinerary: [
      { day: 1, title: "Arrive — South Goa Beaches", description: "Palolem or Agonda crescent beach. Hammock day. Seafood shack dinner.", distanceKm: 30, durationHours: 4, highlights: ["Palolem beach", "Kayaking in sea", "Sunset cocktails"] },
      { day: 2, title: "Old Goa — Churches & Spice Farm", description: "Basilica of Bom Jesus (St. Francis Xavier relics), Spice farm tour, Dudhsagar waterfalls jeep.", distanceKm: 65, durationHours: 8, highlights: ["Basilica Bom Jesus", "Spice farm", "Dudhsagar falls"] },
      { day: 3, title: "North Goa — Anjuna & Vagator", description: "Scooter ride along coast. Anjuna flea market (Wed), Chapora Fort ruins, Vagator beach sunset.", distanceKm: 85, durationHours: 7, highlights: ["Anjuna flea market", "Chapora Fort", "Vagator cliff"] },
      { day: 4, title: "Arambol — Hippie North", description: "Arambol beach, sweet water lake, drum circle at sunset. North Goa's most laid-back village.", distanceKm: 40, durationHours: 5, highlights: ["Arambol sweet lake", "Drum circle", "Kite surfing"] },
      { day: 5, title: "Margao Market & Depart", description: "Morning at Margao covered market for Goan sausages, bebinca, feni. Fly out.", distanceKm: 25, durationHours: 3, highlights: ["Margao market", "Local breakfast", "Goan souvenirs"] },
    ],
  },
  {
    name: "Manali + Kasol",
    region: "Himachal",
    days: 6,
    budgetUsd: 180,
    vibe: "Mountain",
    terrains: ["mountains", "snow", "wellness"],
    blurb: "Pine-forest cafés, Parvati valley treks, snow-line in winter.",
    itinerary: [
      { day: 1, title: "Arrive Manali — Mall Road & Hadimba", description: "Settle in Old Manali. Visit Hadimba Devi temple amid deodar forest. Evening at Van Vihar park.", distanceKm: 8, durationHours: 4, highlights: ["Hadimba Temple", "Old Manali cafés", "Manu Temple"] },
      { day: 2, title: "Solang Valley & Rohtang (summer) / Snow Point", description: "Zorbing, paragliding at Solang. Rohtang Pass (3,978m) for snow views in summer or Atal Tunnel to Lahaul in any season.", distanceKm: 55, durationHours: 7, highlights: ["Solang Valley adventure", "Rohtang Pass or Atal Tunnel", "Snow play"] },
      { day: 3, title: "Drive to Kasol via Kullu", description: "Drive through Kullu valley. Stop at Manikaran hot springs and gurudwara. Arrive Kasol — Israeli cafés, chill vibes.", distanceKm: 80, durationHours: 5, highlights: ["Manikaran hot springs", "Parvati River", "Kasol cafés"] },
      { day: 4, title: "Kheerganga Trek", description: "12km trek through pine forest to Kheerganga (2,950m) — hot spring pool at the top with mountain panorama. Camp overnight.", distanceKm: 24, durationHours: 8, highlights: ["Kheerganga hot spring", "Forest trail", "Mountain camp"] },
      { day: 5, title: "Grahan Village Trek or Tosh", description: "Alternative: trek to remote Tosh village or Grahan for traditional Himachali homestay. No vehicles, pure peace.", distanceKm: 18, durationHours: 6, highlights: ["Tosh village", "Himachali cuisine", "Apple orchards"] },
      { day: 6, title: "Bhuntar & Depart", description: "Return to Bhuntar for Kullu Manali airport or bus to Delhi/Chandigarh.", distanceKm: 35, durationHours: 3, highlights: ["Kullu Shawl weaving", "Beas river view"] },
    ],
  },
  {
    name: "Spiti Valley",
    region: "Himachal",
    days: 8,
    budgetUsd: 320,
    vibe: "Adventure",
    terrains: ["mountains", "desert", "snow"],
    blurb: "Cold desert villages, Key Monastery, Chandratal.",
    itinerary: [
      { day: 1, title: "Shimla → Narkanda", description: "Drive to Narkanda through Himalayan apple orchards. Night at 2,700m.", distanceKm: 65, durationHours: 4, highlights: ["Hatu Peak", "Apple orchards"] },
      { day: 2, title: "Narkanda → Sangla Valley", description: "Wind down to Sangla (Kinnaur) — Himalayan village of apple trees, wooden temples, Kinnauri caps.", distanceKm: 120, durationHours: 6, highlights: ["Chitkul — India's last village", "Baspa River"] },
      { day: 3, title: "Sangla → Tabo → Dhankar", description: "Cross into Spiti. Tabo Monastery (1,000 years old). Dhankar village perched on a cliff, old fort.", distanceKm: 140, durationHours: 7, highlights: ["Tabo monastery murals", "Dhankar fort", "Dhankar lake"] },
      { day: 4, title: "Pin Valley & Mudh Village", description: "Detour to Pin Valley National Park. Mudh is the last village — snow leopard territory.", distanceKm: 70, durationHours: 6, highlights: ["Pin Valley ibex", "Mudh gompa"] },
      { day: 5, title: "Kaza — Spiti Capital", description: "Arrive Kaza (3,800m). Key Monastery (1,000+ year old, clifftop). Kibber village (world's highest motorable village claim).", distanceKm: 55, durationHours: 5, highlights: ["Key Monastery", "Kibber village", "Hikkim post office"] },
      { day: 6, title: "Langza & Komic Fossils", description: "Langza village — giant Buddha statue, fossil hunting (marine fossils at 4,400m!). Komic village monastery.", distanceKm: 40, durationHours: 5, highlights: ["Langza Buddha", "Trilobite fossils", "Komic Monastery"] },
      { day: 7, title: "Chandratal Lake", description: "Jeep to Chandratal 'Moon Lake' (4,250m) — electric blue crescent lake surrounded by moraine. Camp at the shore.", distanceKm: 80, durationHours: 7, highlights: ["Chandratal lake", "Glacier panorama", "Stargazing camp"] },
      { day: 8, title: "Rohtang → Manali Depart", description: "Cross Rohtang Pass (3,978m) or Atal Tunnel back to Manali for transport connections.", distanceKm: 115, durationHours: 6, highlights: ["Batal junction", "Rohtang snowfield", "Manali"] },
    ],
  },
  {
    name: "Rishikesh + Haridwar",
    region: "Uttarakhand",
    days: 4,
    budgetUsd: 140,
    vibe: "Spiritual",
    terrains: ["mountains", "wellness", "jungle"],
    blurb: "Ganga aarti, yoga ashrams, white-water rafting.",
    itinerary: [
      { day: 1, title: "Haridwar — Ganga Aarti", description: "Arrive Haridwar. Har Ki Pauri ghat — evening Ganga aarti ceremony (thousands of oil lamps on the river). Dip in the sacred Ganga.", distanceKm: 10, durationHours: 5, highlights: ["Har Ki Pauri ghat", "Ganga aarti ceremony", "Mansa Devi temple cable car"] },
      { day: 2, title: "Rishikesh — Laxman Jhula & Yoga", description: "Drive 24km to Rishikesh. Morning yoga class (Parmarth Niketan ashram or Sivananda). Laxman & Ram Jhula suspension bridges. Beatles Ashram exploration.", distanceKm: 24, durationHours: 6, highlights: ["Laxman Jhula bridge", "Beatles Ashram", "Yoga class", "Triveni Ghat"] },
      { day: 3, title: "White-water Rafting — Ganges Rapids", description: "16 km raft from Shivpuri to Rishikesh through Grade 3–4 rapids (Roller Coaster, Golf Course). Afternoon bungee jump option at Jumpin Heights (83m, India's highest).", distanceKm: 16, durationHours: 7, highlights: ["Ganges white-water rafting", "Grade 3–4 rapids", "Bungee jump option (83m)"] },
      { day: 4, title: "Neelkanth Mahadev & Depart", description: "Morning trek (15 km) or jeep to Neelkanth Mahadev temple in forest (1,330m). Return to Rishikesh or Haridwar for transport.", distanceKm: 30, durationHours: 5, highlights: ["Neelkanth temple forest trek", "Waterfall viewpoints"] },
    ],
  },
  { name: "Auli skiing", region: "Uttarakhand", days: 4, budgetUsd: 220, vibe: "Snow",
    terrains: ["snow", "ski", "mountains"], blurb: "Cheapest skiing in India with Nanda Devi views." },
  { name: "Jaipur–Udaipur–Jodhpur", region: "Rajasthan", days: 8, budgetUsd: 360, vibe: "Heritage",
    terrains: ["history", "desert", "city"], blurb: "Pink, blue, golden cities and Lake Pichola palaces." },
  { name: "Jaisalmer desert camp", region: "Rajasthan", days: 4, budgetUsd: 160, vibe: "Desert",
    terrains: ["desert", "history"], blurb: "Camel safari, dune camping, golden fort." },
  { name: "Andaman Islands", region: "Andaman", days: 7, budgetUsd: 520, vibe: "Beach",
    terrains: ["beaches", "islands", "diving"], blurb: "Radhanagar beach, Havelock scuba, bioluminescence." },
  { name: "Meghalaya living-root bridges", region: "Northeast", days: 6, budgetUsd: 260, vibe: "Adventure",
    terrains: ["jungle", "mountains", "wellness"], blurb: "Cherrapunji, Dawki river, double-decker root bridge." },
  { name: "Sikkim + Darjeeling", region: "Northeast", days: 7, budgetUsd: 300, vibe: "Mountain",
    terrains: ["mountains", "snow", "wellness", "food"], blurb: "Kanchenjunga sunrise, toy train, monasteries." },
  { name: "Varanasi spiritual", region: "Uttar Pradesh", days: 3, budgetUsd: 110, vibe: "Spiritual",
    terrains: ["history", "wellness"], blurb: "Sunrise boat on the Ganges, evening aarti at Dashashwamedh." },
  { name: "Hampi ruins", region: "Karnataka", days: 4, budgetUsd: 140, vibe: "Heritage",
    terrains: ["history", "mountains"], blurb: "Boulder landscapes and Vijayanagara empire ruins." },
  { name: "Pondicherry + Auroville", region: "South India", days: 4, budgetUsd: 200, vibe: "Chill",
    terrains: ["beaches", "city", "wellness", "food"], blurb: "French quarter cafés, Matrimandir, Serenity beach." },
  { name: "Gokarna beaches", region: "Karnataka", days: 4, budgetUsd: 160, vibe: "Chill",
    terrains: ["beaches", "wellness"], blurb: "Backpacker beaches — Om, Kudle, Half-moon — minus the Goa party." },
  { name: "Coorg coffee country", region: "Karnataka", days: 4, budgetUsd: 200, vibe: "Nature",
    terrains: ["mountains", "jungle", "wellness"], blurb: "Coffee plantations, Abbey falls, homestay weekends." },
  { name: "Mumbai + Pune", region: "Maharashtra", days: 4, budgetUsd: 240, vibe: "City",
    terrains: ["city", "food", "nightlife", "history"], blurb: "Marine drive, Bandra cafés, Ajanta-Ellora day trip." },
  { name: "Tamil temple circuit", region: "Tamil Nadu", days: 6, budgetUsd: 220, vibe: "Heritage",
    terrains: ["history", "wellness", "food"], blurb: "Madurai, Thanjavur, Rameswaram — Dravidian temples." },
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
