export type VegScore = "easy" | "medium" | "hard";
export type Vibe = "chill" | "adventure" | "balanced";

export type Country = {
  slug: string;
  name: string;
  region: string;
  flag: string;
  /** 7-day cost per person, USD, [min, max] */
  costRange: [number, number];
  dailyCost: number;
  flightCostRange: [number, number];
  vegScore: VegScore;
  /** 0-100 — how Japan-like the experience feels (orderly, tech, food culture) */
  similarityScore: number;
  /** millions of international tourist arrivals / year */
  touristCount: number;
  /** 1-12 month numbers */
  bestMonths: number[];
  cheapestMonths: number[];
  peakMonths: number[];
  highlights: { name: string; blurb: string }[];
  costBreakdown: { flights: number; stay: number; food: number; transport: number };
  tags: string[];
  vibe: Vibe;
  /** length 12 — relative price index per month (lower = cheaper). 60-140 typical */
  monthlyPriceIndex: number[];
  blurb: string;
};

const mp = (peak: number[], cheap: number[]): number[] => {
  return Array.from({ length: 12 }, (_, i) => {
    const m = i + 1;
    if (peak.includes(m)) return 130 + Math.round(Math.random() * 10);
    if (cheap.includes(m)) return 70 + Math.round(Math.random() * 8);
    return 95 + Math.round(Math.random() * 12);
  });
};

export const COUNTRIES: Country[] = [
  {
    slug: "japan", name: "Japan", region: "East Asia", flag: "🇯🇵",
    costRange: [1800, 3200], dailyCost: 180, flightCostRange: [900, 1500],
    vegScore: "medium", similarityScore: 100, touristCount: 25,
    bestMonths: [3, 4, 10, 11], cheapestMonths: [1, 2, 6], peakMonths: [3, 4, 10, 11],
    highlights: [
      { name: "Tokyo", blurb: "Neon megacity, izakayas, Shibuya scramble." },
      { name: "Kyoto", blurb: "Temples, geisha districts, bamboo groves." },
      { name: "Osaka", blurb: "Street food capital — takoyaki & okonomiyaki." },
      { name: "Hakone", blurb: "Onsen towns with Mt. Fuji views." },
    ],
    costBreakdown: { flights: 1200, stay: 700, food: 350, transport: 250 },
    tags: ["culture", "city", "premium", "food", "nature"], vibe: "balanced",
    monthlyPriceIndex: mp([3, 4, 10, 11], [1, 2, 6]),
    blurb: "Hyper-organized, visually rich, with world-class food and rail.",
  },
  {
    slug: "taiwan", name: "Taiwan", region: "East Asia", flag: "🇹🇼",
    costRange: [900, 1600], dailyCost: 80, flightCostRange: [800, 1300],
    vegScore: "easy", similarityScore: 78, touristCount: 11,
    bestMonths: [3, 4, 10, 11], cheapestMonths: [5, 6, 9], peakMonths: [1, 2, 7, 8],
    highlights: [
      { name: "Taipei", blurb: "Night markets, hot springs, MRT efficiency." },
      { name: "Taroko Gorge", blurb: "Marble canyons & jade rivers." },
      { name: "Tainan", blurb: "Old capital with the best street food." },
      { name: "Jiufen", blurb: "Lantern-lit hillside teahouses." },
    ],
    costBreakdown: { flights: 1000, stay: 280, food: 140, transport: 100 },
    tags: ["food", "budget", "culture", "veg-friendly"], vibe: "chill",
    monthlyPriceIndex: mp([1, 2, 7, 8], [5, 6, 9]),
    blurb: "Japan-adjacent vibe at half the price — vegetarian heaven.",
  },
  {
    slug: "vietnam", name: "Vietnam", region: "Southeast Asia", flag: "🇻🇳",
    costRange: [600, 1200], dailyCost: 50, flightCostRange: [700, 1200],
    vegScore: "medium", similarityScore: 55, touristCount: 12,
    bestMonths: [2, 3, 4, 11], cheapestMonths: [5, 6, 9], peakMonths: [12, 1, 7],
    highlights: [
      { name: "Hanoi", blurb: "Old Quarter chaos, egg coffee, pho." },
      { name: "Ha Long Bay", blurb: "Limestone karsts on emerald water." },
      { name: "Hoi An", blurb: "Lantern town, tailor shops, beaches." },
      { name: "Sapa", blurb: "Rice terraces and hill-tribe villages." },
    ],
    costBreakdown: { flights: 900, stay: 200, food: 100, transport: 80 },
    tags: ["budget", "nature", "food", "adventure"], vibe: "adventure",
    monthlyPriceIndex: mp([12, 1, 7], [5, 6, 9]),
    blurb: "Insanely good food, dramatic landscapes, dollar-stretching prices.",
  },
  {
    slug: "thailand", name: "Thailand", region: "Southeast Asia", flag: "🇹🇭",
    costRange: [800, 1600], dailyCost: 65, flightCostRange: [800, 1400],
    vegScore: "medium", similarityScore: 50, touristCount: 28,
    bestMonths: [11, 12, 1, 2], cheapestMonths: [5, 6, 9], peakMonths: [12, 1, 2],
    highlights: [
      { name: "Bangkok", blurb: "Temples, malls, sky-bars, street wok magic." },
      { name: "Chiang Mai", blurb: "Digital nomad mecca with old-city charm." },
      { name: "Krabi", blurb: "Long-tail boats and limestone cliffs." },
      { name: "Koh Lipe", blurb: "Postcard turquoise water." },
    ],
    costBreakdown: { flights: 1000, stay: 260, food: 130, transport: 90 },
    tags: ["beach", "budget", "food", "nature"], vibe: "balanced",
    monthlyPriceIndex: mp([12, 1, 2], [5, 6, 9]),
    blurb: "The classic budget-luxury blend — beaches, temples, $2 pad thai.",
  },
  {
    slug: "indonesia", name: "Indonesia", region: "Southeast Asia", flag: "🇮🇩",
    costRange: [700, 1400], dailyCost: 55, flightCostRange: [900, 1500],
    vegScore: "medium", similarityScore: 35, touristCount: 16,
    bestMonths: [4, 5, 6, 9], cheapestMonths: [2, 3, 11], peakMonths: [7, 8, 12],
    highlights: [
      { name: "Bali", blurb: "Rice terraces, surf, wellness culture." },
      { name: "Yogyakarta", blurb: "Borobudur sunrise + batik." },
      { name: "Komodo", blurb: "Dragons and pink-sand beaches." },
      { name: "Lombok", blurb: "Quieter Bali alternative." },
    ],
    costBreakdown: { flights: 1100, stay: 220, food: 110, transport: 80 },
    tags: ["beach", "nature", "budget", "wellness"], vibe: "chill",
    monthlyPriceIndex: mp([7, 8, 12], [2, 3, 11]),
    blurb: "Spiritual, lush, surfable — the wellness-traveler's home base.",
  },
  {
    slug: "sri-lanka", name: "Sri Lanka", region: "South Asia", flag: "🇱🇰",
    costRange: [700, 1300], dailyCost: 50, flightCostRange: [900, 1500],
    vegScore: "easy", similarityScore: 30, touristCount: 2,
    bestMonths: [1, 2, 3, 12], cheapestMonths: [5, 6, 9, 10], peakMonths: [12, 1, 2],
    highlights: [
      { name: "Ella", blurb: "Tea-country trains and hikes." },
      { name: "Sigirya", blurb: "Lion rock fortress." },
      { name: "Galle", blurb: "Dutch colonial fort by the sea." },
      { name: "Kandy", blurb: "Tooth Temple and lake walks." },
    ],
    costBreakdown: { flights: 1100, stay: 180, food: 90, transport: 70 },
    tags: ["nature", "budget", "veg-friendly", "culture"], vibe: "adventure",
    monthlyPriceIndex: mp([12, 1, 2], [5, 6, 9, 10]),
    blurb: "Tea hills, ancient temples, and the easiest veg food in Asia.",
  },
  {
    slug: "malaysia", name: "Malaysia", region: "Southeast Asia", flag: "🇲🇾",
    costRange: [800, 1500], dailyCost: 65, flightCostRange: [800, 1400],
    vegScore: "medium", similarityScore: 45, touristCount: 26,
    bestMonths: [2, 3, 4, 7, 8], cheapestMonths: [5, 6, 10, 11], peakMonths: [12, 1],
    highlights: [
      { name: "Kuala Lumpur", blurb: "Petronas towers + hawker meccas." },
      { name: "Penang", blurb: "Street art and the country's best food." },
      { name: "Borneo", blurb: "Orangutans and jungle treks." },
      { name: "Langkawi", blurb: "Duty-free island getaway." },
    ],
    costBreakdown: { flights: 1000, stay: 260, food: 130, transport: 90 },
    tags: ["food", "city", "nature", "budget"], vibe: "balanced",
    monthlyPriceIndex: mp([12, 1], [5, 6, 10, 11]),
    blurb: "Underrated multicultural food paradise with modern infrastructure.",
  },
  {
    slug: "georgia", name: "Georgia", region: "Caucasus", flag: "🇬🇪",
    costRange: [800, 1500], dailyCost: 60, flightCostRange: [600, 1100],
    vegScore: "medium", similarityScore: 25, touristCount: 7,
    bestMonths: [5, 6, 9, 10], cheapestMonths: [3, 4, 11], peakMonths: [7, 8],
    highlights: [
      { name: "Tbilisi", blurb: "Sulfur baths and wine bars in cobbled lanes." },
      { name: "Kazbegi", blurb: "Caucasus peaks and clifftop monasteries." },
      { name: "Kakheti", blurb: "Birthplace of wine — 8000 years old." },
      { name: "Svaneti", blurb: "Medieval stone towers in the mountains." },
    ],
    costBreakdown: { flights: 850, stay: 240, food: 130, transport: 80 },
    tags: ["nature", "wine", "budget", "culture"], vibe: "adventure",
    monthlyPriceIndex: mp([7, 8], [3, 4, 11]),
    blurb: "Off-radar mountain country with epic wine and feasts.",
  },
  {
    slug: "turkey", name: "Türkiye", region: "Western Asia", flag: "🇹🇷",
    costRange: [900, 1700], dailyCost: 70, flightCostRange: [600, 1100],
    vegScore: "medium", similarityScore: 40, touristCount: 50,
    bestMonths: [4, 5, 9, 10], cheapestMonths: [11, 2, 3], peakMonths: [6, 7, 8],
    highlights: [
      { name: "Istanbul", blurb: "Bosphorus, bazaars, mosques." },
      { name: "Cappadocia", blurb: "Hot-air balloons over fairy chimneys." },
      { name: "Pamukkale", blurb: "White travertine terraces." },
      { name: "Antalya", blurb: "Turquoise coast resorts." },
    ],
    costBreakdown: { flights: 850, stay: 320, food: 160, transport: 100 },
    tags: ["culture", "city", "history", "beach"], vibe: "balanced",
    monthlyPriceIndex: mp([6, 7, 8], [11, 2, 3]),
    blurb: "Two continents, 10,000 years of history, generous portions.",
  },
  {
    slug: "poland", name: "Poland", region: "Europe", flag: "🇵🇱",
    costRange: [900, 1600], dailyCost: 70, flightCostRange: [500, 1000],
    vegScore: "medium", similarityScore: 35, touristCount: 21,
    bestMonths: [5, 6, 9], cheapestMonths: [2, 3, 11], peakMonths: [7, 8, 12],
    highlights: [
      { name: "Kraków", blurb: "Medieval old town, Wawel castle." },
      { name: "Warsaw", blurb: "Reborn capital with sharp food scene." },
      { name: "Gdańsk", blurb: "Hanseatic port with amber lanes." },
      { name: "Tatras", blurb: "Affordable alpine hiking." },
    ],
    costBreakdown: { flights: 800, stay: 320, food: 150, transport: 90 },
    tags: ["culture", "city", "budget", "history"], vibe: "balanced",
    monthlyPriceIndex: mp([7, 8, 12], [2, 3, 11]),
    blurb: "Best-value Europe — pierogi, history, walkable old towns.",
  },
  {
    slug: "hungary", name: "Hungary", region: "Europe", flag: "🇭🇺",
    costRange: [950, 1700], dailyCost: 75, flightCostRange: [550, 1050],
    vegScore: "medium", similarityScore: 32, touristCount: 17,
    bestMonths: [4, 5, 9, 10], cheapestMonths: [1, 2, 11], peakMonths: [7, 8, 12],
    highlights: [
      { name: "Budapest", blurb: "Thermal baths and Danube panoramas." },
      { name: "Lake Balaton", blurb: "Central Europe's inland sea." },
      { name: "Eger", blurb: "Wine valleys and baroque streets." },
      { name: "Szeged", blurb: "Sunny southern food capital." },
    ],
    costBreakdown: { flights: 850, stay: 340, food: 160, transport: 90 },
    tags: ["city", "culture", "wine", "budget"], vibe: "chill",
    monthlyPriceIndex: mp([7, 8, 12], [1, 2, 11]),
    blurb: "Thermal-bath capital with stunning architecture for a song.",
  },
  {
    slug: "romania", name: "Romania", region: "Europe", flag: "🇷🇴",
    costRange: [800, 1500], dailyCost: 60, flightCostRange: [600, 1100],
    vegScore: "medium", similarityScore: 28, touristCount: 3,
    bestMonths: [5, 6, 9], cheapestMonths: [2, 3, 11], peakMonths: [7, 8],
    highlights: [
      { name: "Brașov", blurb: "Transylvanian old town under the Carpathians." },
      { name: "Bucharest", blurb: "Belle-Époque capital with wild nightlife." },
      { name: "Sibiu", blurb: "Saxon-era square with eyed roofs." },
      { name: "Transfăgărășan", blurb: "Top-gear's favorite mountain road." },
    ],
    costBreakdown: { flights: 900, stay: 260, food: 130, transport: 80 },
    tags: ["nature", "culture", "budget", "adventure"], vibe: "adventure",
    monthlyPriceIndex: mp([7, 8], [2, 3, 11]),
    blurb: "Castles, painted monasteries, dramatic mountain drives.",
  },
  {
    slug: "spain", name: "Spain", region: "Europe", flag: "🇪🇸",
    costRange: [1400, 2400], dailyCost: 130, flightCostRange: [600, 1200],
    vegScore: "medium", similarityScore: 38, touristCount: 85,
    bestMonths: [4, 5, 9, 10], cheapestMonths: [11, 2, 3], peakMonths: [7, 8],
    highlights: [
      { name: "Barcelona", blurb: "Gaudí, beach, tapas." },
      { name: "Madrid", blurb: "Museums and late-night vermouth." },
      { name: "Sevilla", blurb: "Flamenco and orange-blossom plazas." },
      { name: "San Sebastián", blurb: "Pintxos paradise on the bay." },
    ],
    costBreakdown: { flights: 900, stay: 600, food: 320, transport: 180 },
    tags: ["food", "city", "beach", "culture"], vibe: "balanced",
    monthlyPriceIndex: mp([7, 8], [11, 2, 3]),
    blurb: "Sun-soaked, food-obsessed, endlessly walkable cities.",
  },
  {
    slug: "portugal", name: "Portugal", region: "Europe", flag: "🇵🇹",
    costRange: [1200, 2100], dailyCost: 110, flightCostRange: [650, 1200],
    vegScore: "medium", similarityScore: 36, touristCount: 26,
    bestMonths: [4, 5, 9, 10], cheapestMonths: [11, 2, 3], peakMonths: [7, 8],
    highlights: [
      { name: "Lisbon", blurb: "Tram 28, miradouros, fado." },
      { name: "Porto", blurb: "Port-wine cellars across the Douro." },
      { name: "Sintra", blurb: "Painted palaces in misty hills." },
      { name: "Algarve", blurb: "Golden cliffs and hidden coves." },
    ],
    costBreakdown: { flights: 900, stay: 520, food: 280, transport: 160 },
    tags: ["beach", "city", "wine", "culture"], vibe: "chill",
    monthlyPriceIndex: mp([7, 8], [11, 2, 3]),
    blurb: "Europe's mellow corner — pastel cities and surf-coast bliss.",
  },
  {
    slug: "czechia", name: "Czechia", region: "Europe", flag: "🇨🇿",
    costRange: [1000, 1700], dailyCost: 85, flightCostRange: [600, 1100],
    vegScore: "medium", similarityScore: 34, touristCount: 13,
    bestMonths: [5, 6, 9], cheapestMonths: [2, 3, 11], peakMonths: [7, 8, 12],
    highlights: [
      { name: "Prague", blurb: "Astronomical clock + cheap pilsner." },
      { name: "Český Krumlov", blurb: "Storybook river-bend town." },
      { name: "Brno", blurb: "Studenty Moravian capital." },
      { name: "Karlovy Vary", blurb: "Spa town of Wes Anderson dreams." },
    ],
    costBreakdown: { flights: 850, stay: 380, food: 200, transport: 100 },
    tags: ["city", "culture", "history", "beer"], vibe: "balanced",
    monthlyPriceIndex: mp([7, 8, 12], [2, 3, 11]),
    blurb: "Fairytale architecture and the world's best beer for $2.",
  },
  {
    slug: "morocco", name: "Morocco", region: "North Africa", flag: "🇲🇦",
    costRange: [900, 1600], dailyCost: 70, flightCostRange: [700, 1300],
    vegScore: "medium", similarityScore: 20, touristCount: 14,
    bestMonths: [3, 4, 10, 11], cheapestMonths: [6, 7, 8], peakMonths: [12, 1, 4],
    highlights: [
      { name: "Marrakech", blurb: "Souks, riads, Jemaa el-Fnaa nights." },
      { name: "Fez", blurb: "Maze medina and tanneries." },
      { name: "Sahara", blurb: "Erg Chebbi dunes by camel." },
      { name: "Chefchaouen", blurb: "The famous blue mountain town." },
    ],
    costBreakdown: { flights: 1000, stay: 280, food: 140, transport: 100 },
    tags: ["culture", "adventure", "desert", "budget"], vibe: "adventure",
    monthlyPriceIndex: mp([12, 1, 4], [6, 7, 8]),
    blurb: "Sensory overload — desert, medinas, mint tea, mountains.",
  },
  {
    slug: "egypt", name: "Egypt", region: "North Africa", flag: "🇪🇬",
    costRange: [800, 1500], dailyCost: 60, flightCostRange: [800, 1300],
    vegScore: "medium", similarityScore: 18, touristCount: 13,
    bestMonths: [10, 11, 2, 3], cheapestMonths: [6, 7, 8], peakMonths: [12, 1],
    highlights: [
      { name: "Cairo", blurb: "Pyramids and the Egyptian Museum." },
      { name: "Luxor", blurb: "Karnak temple + Valley of the Kings." },
      { name: "Aswan", blurb: "Nile felucca sunsets." },
      { name: "Dahab", blurb: "Red Sea diving on the cheap." },
    ],
    costBreakdown: { flights: 1050, stay: 220, food: 110, transport: 80 },
    tags: ["history", "desert", "diving", "budget"], vibe: "adventure",
    monthlyPriceIndex: mp([12, 1], [6, 7, 8]),
    blurb: "5,000 years of pharaohs and world-class shore diving.",
  },
  {
    slug: "philippines", name: "Philippines", region: "Southeast Asia", flag: "🇵🇭",
    costRange: [900, 1700], dailyCost: 70, flightCostRange: [1000, 1600],
    vegScore: "hard", similarityScore: 30, touristCount: 5,
    bestMonths: [12, 1, 2, 3, 4], cheapestMonths: [6, 7, 9], peakMonths: [12, 1],
    highlights: [
      { name: "Palawan", blurb: "Hidden lagoons of El Nido." },
      { name: "Siargao", blurb: "Cloud Nine surf and chill island life." },
      { name: "Bohol", blurb: "Chocolate hills and tarsiers." },
      { name: "Cebu", blurb: "Whale sharks and waterfalls." },
    ],
    costBreakdown: { flights: 1200, stay: 260, food: 130, transport: 110 },
    tags: ["beach", "diving", "nature", "adventure"], vibe: "adventure",
    monthlyPriceIndex: mp([12, 1], [6, 7, 9]),
    blurb: "7,000 islands of unreasonably blue water.",
  },
  {
    slug: "south-korea", name: "South Korea", region: "East Asia", flag: "🇰🇷",
    costRange: [1500, 2600], dailyCost: 130, flightCostRange: [900, 1500],
    vegScore: "medium", similarityScore: 88, touristCount: 11,
    bestMonths: [4, 5, 9, 10], cheapestMonths: [1, 2, 6], peakMonths: [4, 5, 10],
    highlights: [
      { name: "Seoul", blurb: "K-pop, palaces, 24/7 BBQ alleys." },
      { name: "Busan", blurb: "Beach city with seafood markets." },
      { name: "Jeju", blurb: "Volcanic island getaway." },
      { name: "Gyeongju", blurb: "Open-air history museum." },
    ],
    costBreakdown: { flights: 1200, stay: 580, food: 320, transport: 200 },
    tags: ["city", "food", "culture", "premium"], vibe: "balanced",
    monthlyPriceIndex: mp([4, 5, 10], [1, 2, 6]),
    blurb: "Closest country to Japan in feel — sharper, cheaper, spicier.",
  },
  {
    slug: "singapore", name: "Singapore", region: "Southeast Asia", flag: "🇸🇬",
    costRange: [1700, 2900], dailyCost: 160, flightCostRange: [1000, 1600],
    vegScore: "easy", similarityScore: 70, touristCount: 14,
    bestMonths: [2, 3, 4], cheapestMonths: [10, 11], peakMonths: [6, 7, 12],
    highlights: [
      { name: "Marina Bay", blurb: "Skyline + Gardens by the Bay." },
      { name: "Hawker Centers", blurb: "Michelin chicken rice for $5." },
      { name: "Sentosa", blurb: "Theme parks and beach clubs." },
      { name: "Little India", blurb: "Color, spice, and dosas." },
    ],
    costBreakdown: { flights: 1300, stay: 700, food: 380, transport: 200 },
    tags: ["city", "food", "premium", "veg-friendly"], vibe: "chill",
    monthlyPriceIndex: mp([6, 7, 12], [10, 11]),
    blurb: "Squeaky-clean Asia stopover with the world's best hawker food.",
  },
  {
    slug: "uae", name: "UAE", region: "Middle East", flag: "🇦🇪",
    costRange: [1600, 3000], dailyCost: 170, flightCostRange: [800, 1400],
    vegScore: "easy", similarityScore: 50, touristCount: 17,
    bestMonths: [11, 12, 1, 2, 3], cheapestMonths: [6, 7, 8], peakMonths: [12, 1, 2],
    highlights: [
      { name: "Dubai", blurb: "Burj Khalifa, desert safaris, malls." },
      { name: "Abu Dhabi", blurb: "Sheikh Zayed mosque + Louvre." },
      { name: "Hatta", blurb: "Mountain kayaking weekends." },
      { name: "Sharjah", blurb: "Heritage and Arab calligraphy." },
    ],
    costBreakdown: { flights: 1100, stay: 800, food: 350, transport: 180 },
    tags: ["city", "premium", "desert", "veg-friendly"], vibe: "balanced",
    monthlyPriceIndex: mp([12, 1, 2], [6, 7, 8]),
    blurb: "Sci-fi skyline meets Arabian dunes; vegetarian options everywhere.",
  },
  {
    slug: "china", name: "China", region: "East Asia", flag: "🇨🇳",
    costRange: [1300, 2400], dailyCost: 100, flightCostRange: [900, 1500],
    vegScore: "medium", similarityScore: 65, touristCount: 30,
    bestMonths: [4, 5, 9, 10], cheapestMonths: [3, 6, 11], peakMonths: [5, 10],
    highlights: [
      { name: "Beijing", blurb: "Forbidden City + Great Wall day trips." },
      { name: "Shanghai", blurb: "Bund skyline and the French Concession." },
      { name: "Chengdu", blurb: "Pandas and tongue-numbing Sichuan." },
      { name: "Zhangjiajie", blurb: "Avatar mountains floating in mist." },
    ],
    costBreakdown: { flights: 1200, stay: 480, food: 260, transport: 160 },
    tags: ["city", "history", "nature", "food"], vibe: "balanced",
    monthlyPriceIndex: mp([5, 10], [3, 6, 11]),
    blurb: "Bullet trains, megacities, and landscapes that look CGI'd.",
  },
  {
    slug: "greece", name: "Greece", region: "Europe", flag: "🇬🇷",
    costRange: [1300, 2300], dailyCost: 120, flightCostRange: [700, 1200],
    vegScore: "easy", similarityScore: 30, touristCount: 33,
    bestMonths: [5, 6, 9, 10], cheapestMonths: [11, 2, 3], peakMonths: [7, 8],
    highlights: [
      { name: "Athens", blurb: "Acropolis at golden hour." },
      { name: "Santorini", blurb: "Whitewashed cliffs and caldera sunsets." },
      { name: "Crete", blurb: "Wild gorges and ancient palaces." },
      { name: "Naxos", blurb: "Affordable, less touristed island." },
    ],
    costBreakdown: { flights: 950, stay: 580, food: 280, transport: 160 },
    tags: ["beach", "history", "culture", "veg-friendly"], vibe: "chill",
    monthlyPriceIndex: mp([7, 8], [11, 2, 3]),
    blurb: "Island-hop the Aegean with feta, wine, and 3,000 years of myth.",
  },
  {
    slug: "india", name: "India", region: "South Asia", flag: "🇮🇳",
    costRange: [600, 1300], dailyCost: 45, flightCostRange: [900, 1500],
    vegScore: "easy", similarityScore: 25, touristCount: 9,
    bestMonths: [10, 11, 12, 1, 2], cheapestMonths: [5, 6, 9], peakMonths: [12, 1],
    highlights: [
      { name: "Rajasthan", blurb: "Pink, blue, golden cities + camel desert." },
      { name: "Kerala", blurb: "Backwater houseboats and Ayurveda." },
      { name: "Varanasi", blurb: "Ganges ghats at sunrise." },
      { name: "Goa", blurb: "Beach shacks and Portuguese churches." },
    ],
    costBreakdown: { flights: 1100, stay: 160, food: 80, transport: 70 },
    tags: ["culture", "food", "veg-friendly", "budget", "spiritual"], vibe: "adventure",
    monthlyPriceIndex: mp([12, 1], [5, 6, 9]),
    blurb: "Vegetarian capital of the world — overwhelming and unforgettable.",
  },
  {
    slug: "nepal", name: "Nepal", region: "South Asia", flag: "🇳🇵",
    costRange: [700, 1300], dailyCost: 45, flightCostRange: [1000, 1500],
    vegScore: "easy", similarityScore: 22, touristCount: 1,
    bestMonths: [10, 11, 3, 4], cheapestMonths: [6, 7, 8], peakMonths: [10, 11],
    highlights: [
      { name: "Kathmandu", blurb: "Stupas, momo, mountain gateway." },
      { name: "Pokhara", blurb: "Lake town with Annapurna views." },
      { name: "Annapurna Circuit", blurb: "Iconic teahouse trek." },
      { name: "Chitwan", blurb: "Jungle safari and rhinos." },
    ],
    costBreakdown: { flights: 1200, stay: 160, food: 80, transport: 80 },
    tags: ["adventure", "nature", "veg-friendly", "budget"], vibe: "adventure",
    monthlyPriceIndex: mp([10, 11], [6, 7, 8]),
    blurb: "Himalayan trekking and Buddhist calm at backpacker prices.",
  },
];

export const getCountry = (slug: string) => COUNTRIES.find((c) => c.slug === slug);
export const REGIONS = Array.from(new Set(COUNTRIES.map((c) => c.region))).sort();
export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
