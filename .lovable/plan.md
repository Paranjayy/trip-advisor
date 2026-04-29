## GlobeWise Travel Planner

A modern, client-side travel planning app with 25+ country dataset, smart filtering, comparison, and timing tools. No backend needed — data lives in a typed TS file, favorites in localStorage.

### Pages & Routes
- `/` — Home dashboard: hero, search bar, filters (budget slider, region, veg-friendly, chill/adventure, Japan-vibe toggle), top recommendations, featured countries
- `/explore` — Country grid (25+ cards) with same filters in a sidebar
- `/country/:slug` — Detail page: hero image, cost breakdown chart, monthly price trend, best/cheap/peak months, highlights, tags, save button
- `/compare` — Pick up to 3 countries; side-by-side table + bar charts
- `/timing` — Global month heatmap (countries × months, color-coded cheap/ideal/expensive)
- `/favorites` — Saved trips from localStorage

### Data Model (`src/data/countries.ts`)
```ts
type Country = {
  slug; name; region; flag (emoji);
  costRange: [min,max] (7-day USD/person);
  dailyCost: number;
  flightCostRange: [min,max];
  vegScore: 'easy'|'medium'|'hard';
  similarityScore: number; // 0-100 vs Japan
  touristCount: number; // millions/year
  bestMonths: number[]; cheapestMonths: number[]; peakMonths: number[];
  highlights: {name; blurb}[];
  costBreakdown: {flights; stay; food; transport};
  tags: string[];
  vibe: 'chill'|'adventure'|'balanced';
  monthlyPriceIndex: number[12]; // for trend line + heatmap
}
```
25+ countries: Japan, Taiwan, Vietnam, Thailand, Indonesia, Sri Lanka, Malaysia, Georgia, Turkey, Poland, Hungary, Romania, Spain, Portugal, Czechia, Morocco, Egypt, Philippines, South Korea, Singapore, UAE, China, Greece, India, Nepal.

### Design System
- Light, airy, Notion + Google Flights inspired. Soft accent palette.
- Primary: warm teal `175 65% 40%`. Accent: coral `14 85% 62%`. Surface: `40 25% 98%`. Ink: `220 25% 15%`.
- Typography: `Plus Jakarta Sans` (display) + `Inter` (body) via Google Fonts.
- Tokens added to `index.css`: `--primary`, `--accent`, `--surface`, `--success` (cheap/ideal), `--warn` (peak), gradients `--gradient-hero`, shadows `--shadow-card`, `--shadow-elevated`.
- Reusable: `CountryCard`, `FilterPanel`, `CostBar`, `MonthHeatmap`, `MonthTrendChart`, `TagPill`, `VegBadge`, `SimilarityRing`, `RecommendationCard`, `SiteNav`.
- Charts via `recharts` (already in shadcn chart). Icons via `lucide-react`.

### Recommendation Engine
Pure function `recommend({budget, month, vibe, vegFriendly, japanLike})` → scores each country (budget fit, month fit using `monthlyPriceIndex`, vibe match, veg match, similarity weight) → top 3 with human-readable reasons.

### Favorites
`useFavorites()` hook + localStorage; heart toggle on cards.

### Build Order
1. Design tokens (`index.css`, `tailwind.config.ts`), fonts in `index.html`
2. Country dataset
3. Shared components (nav, card, filters, charts, hooks)
4. Pages + routes wired in `App.tsx`
5. SEO meta on each page (title/description/H1/canonical)
6. Generate one hero image for the home

### Out of Scope (v1)
Auth, real-time pricing APIs, multi-currency, itinerary builder.