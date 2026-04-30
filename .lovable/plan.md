## TripWise (rebrand) — big content + UX upgrade

Touches data, several pages, map, and adds a translate widget. No backend changes.

### 1. Rebrand: GlobeWise → TripAdvisor-style

- Change brand name to **"TripAdvisor"** everywhere visible: `SiteNav` logo, `index.html` `<title>`/meta, page titles in `Map.tsx`, `Explore.tsx`, `Index.tsx`, hero copy, README is fine to leave.
- Keep the existing leaf/globe mark; just rename label.
- Note: real "Tripadvisor®" is a trademark — we'll use it as a working title since you asked, but keep our own logo/colors so it's clearly a personal project, not a clone.

### 2. India local trips + sub-destinations per country

- Extend `Country` type with optional `localTrips: { name; region; days; budgetUsd; vibe; terrains[]; blurb }[]`.
- Add a rich set for **India** (Goa, Manali, Leh-Ladakh, Rishikesh, Jaipur, Udaipur, Kerala backwaters, Andaman, Meghalaya, Spiti, Varanasi, Hampi, Darjeeling–Sikkim, Auli ski, Pondicherry, Gokarna, Coorg, Kashmir).
- Add 3–6 local trips for every other country too (Japan: Tokyo/Kyoto/Osaka/Hokkaido/Okinawa; Thailand: Bangkok/Chiang Mai/Phuket/Krabi; etc.) — generated programmatically with sane defaults from each country's cost data so it's not a 5000-line manual list.
- New "Local trips" section on `CountryDetail.tsx` rendered as cards with days, terrain chips, est. budget (auto-converted via `<Money>`).

### 3. Terrain & variety markers

- Add `terrains: Terrain[]` to `Country` (mountains, beaches, desert, jungle, snow, city, food, nightlife, history, wildlife, diving, surf, ski, wellness, lakes, islands, volcanoes).
- Add `difficulty: "easy" | "moderate" | "hard"` (visa/logistics/language).
- Each terrain rendered as a colored icon-chip (lucide icons: Mountain, Waves, Trees, Building2, Utensils, Music, Landmark, Bird, Anchor, Snowflake, Sparkles, etc.).
- Show terrain row on `CountryCard` (compact, top 4 + "+N") and full grid on `CountryDetail`.
- Add "Difficulty" badge and a small **Key stats** block on detail page: language, currency, plug type, safety, best-for tags, top 3 must-do experiences.

### 4. Dynamic Japan-vibe score

- Replace static `similarityScore` with a computed function in `src/lib/recommend.ts`:
  - Compare each country to Japan across: vegScore, region weight, terrains overlap (uses Japan's terrain set), difficulty, costRange similarity, tourism maturity (touristCount), tags overlap.
  - Normalize 0–100 relative to all 79 countries (min-max).
- Memoize once at module load. Country cards/detail/recommend pull from this map.

### 5. Trip price calculator

- New component `TripCalculator.tsx` on `CountryDetail` (and a compact one on `Explore`).
- Inputs: days (1–60), travelers (1–8), travel-style (Budget/Mid/Luxury multiplier), month (uses `monthlyPriceIndex`), include-flights toggle, optional local-trip preset.
- Output: live total in active currency via `useCurrency`, with per-category breakdown (flights, stay, food, transport, activities) shown as a small bar.
- Already auto-converts to selected currency since it pipes through `<Money>`.

### 6. Map upgrades

- On `Map.tsx`:
  - Pin **size** scales with `touristCount`, **color** stays = daily cost.
  - Hover tooltip adds top 2 terrain icons + difficulty.
  - Sidebar gets terrain multi-select filter and a "Japan-like only (≥70)" toggle.
  - New **"Table view"** tab below the map: sortable table (name, region, daily, 7-day, flights, JP score, terrains, difficulty) — same filters apply.
  - "Fly-to" buttons in country detail (link `/map?focus=slug`) — Map reads query, pans + opens popup.

### 7. Google Translate widget (EN / HI / GU + more)

- Add Google Website Translator script in `index.html` (free, no key) with `includedLanguages: 'en,hi,gu,ta,te,bn,mr,fr,es,de,ja,zh-CN,ar'`.
- Mount a small `<TranslateMenu />` button in `SiteNav`: quick buttons for **EN / हिं / ગુ** + "More ▾" dropdown listing the rest. Clicking sets the `googtrans` cookie and reloads (standard pattern).
- Hide the default Google top bar via CSS (`.goog-te-banner-frame { display: none } body { top: 0 !important }`).

### 8. Files to create / edit

Create:

- `src/lib/terrains.ts` — terrain enum, icon map, label, color token.
- `src/lib/japanVibe.ts` — dynamic similarity computation.
- `src/lib/localTrips.ts` — India dataset + generator for other countries.
- `src/components/TerrainChips.tsx`
- `src/components/TripCalculator.tsx`
- `src/components/CountryTable.tsx`
- `src/components/TranslateMenu.tsx`
- `src/lib/translate.ts` — cookie helper + init.

Edit:

- `src/data/countries.ts` — add `terrains`, `difficulty`, optional fields; attach local trips at runtime.
- `src/components/CountryCard.tsx` — terrain row, dynamic JP score.
- `src/pages/CountryDetail.tsx` — key stats, terrains grid, local trips, calculator.
- `src/pages/Map.tsx` — sized pins, terrain filter, JP toggle, table tab, focus param.
- `src/pages/Explore.tsx` — terrain filter chips + compact calculator entry.
- `src/components/SiteNav.tsx` — rename to "TripAdvisor", mount TranslateMenu.
- `src/lib/recommend.ts` — use dynamic JP score.
- `index.html` — title, meta, Google Translate script + CSS hide.
- not only dynamic japan like vibe but also similar couontries or places vibe too lmk from terrain and challanges and destinations and many things ig idk 

### Out of scope (saved for later)

- Real-data scraping / live flight + hotel APIs (Firecrawl, Skyscanner) — bigger task, will tackle separately.
- AI travel-advisor chat with Lovable AI Gateway — next round.

Ready to build this end-to-end on approval.