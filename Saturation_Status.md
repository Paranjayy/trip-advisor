# 🛰️ TripAdvisor — Saturation Status

> Single source of truth for what's built, what's next, and what's missing.
> Updated: May 2026

---

## Saturation Snapshot

```
Core Discovery          ████████████████████  95%  ← saturated
Itinerary Engine        █████████████████░░░  85%  ← strong, needs depth
Visual Fidelity         █████████████████░░░  85%  ← real Unsplash photos now
Decision Intelligence   ████████████████░░░░  80%  ← friction + visa solid
Cost & Currency         ████████████████░░░░  80%
Mobile Experience       ██████░░░░░░░░░░░░░░  30%  ← biggest gap
Offline / PWA           ██░░░░░░░░░░░░░░░░░░  10%
Social / Sharing        ████░░░░░░░░░░░░░░░░  20%
Auth & Personal Data    ░░░░░░░░░░░░░░░░░░░░   0%  ← no backend yet
Live / Real-Time Data   ████░░░░░░░░░░░░░░░░  20%  ← simulated only
SEO / Structured Data   ██████████████░░░░░░  70%
```

**Overall: ~62%** — Engine is goated. Real saturation needs mobile polish,
real-time data, and an account layer.

---

## 🟢 Recently Shipped (this iteration)

- **Real photos**: Curated Unsplash IDs for 60+ destinations + smart terrain
  fallbacks. No more broken loremflickr.
- **Day-count integrity**: Itineraries now self-normalize so the slider,
  altitude bars and totals never show "ghost data" for un-planned days
  (the cricket-scoreboard bug).
- **Visa Intelligence + Passport Power** for 5 citizenships.
- **Friction Score** + altitude pulse + map polylines.
- **Dark mode + Twemoji flags** (Windows Chrome fix).
- **Photo Pulse galleries** with 12 mood modifiers per place.

---

## 🔴 Phase 1 — High Impact, No Blockers

1. **Fill out short itineraries** — Bali/Tokyo/Vietnam/Norway etc. only have
   1-2 real days. Either expand to full plans or hide the slider beyond
   actual content.
2. **Mobile bottom-sheet nav** — sticky day-jumper, one-handed filters.
3. **PWA install** — vite-plugin-pwa, offline itineraries, "Add to Home".
4. **Custom 404** — animated compass instead of bare "Page not found".
5. **Itinerary PDF export** — one click → printable plan with map.
6. **Image lazy-loading + blur placeholders** — perceived speed boost.
7. **`/rss.xml`** — auto-generated from itineraries for SEO + readers.
8. **Random "Surprise me" route** — `/surprise` picks a low-friction trip.
9. **Keyboard shortcut help (`?`)** — modal with all `⌘K` actions.

## 🟠 Phase 2 — Decision Intelligence Depth

1. **Family Negotiator bot** — "Convince my dad to skip Mumbai."
2. **Real visa portal links** + "stress check" per country.
3. **Smart Packing God Mode** — terrain × weather × culture → list.
4. **Budget Heatmap** — "where does $2000 go furthest?" world view.
5. **Group Vote Room** — share a link, friends 👍/👎 destinations.
6. **Visa countdown timer** — "your e-visa typically takes 3 days."

## 🟡 Phase 3 — Live & Real Data

1. **Live FX ticker** ribbon (use a free FX API server-side).
2. **Live weather per destination** (Open-Meteo, no key needed).
3. **Live flight prices snapshot** (Kiwi/Skyscanner partner API).
4. **Earthquake / advisory feed** (USGS + travel.state.gov RSS).
5. **Crowd index per month** — already simulated, swap for real data.
6. **Firecrawl integration** — scrape govt visa pages on demand.

## 🟢 Phase 4 — Personal & Social

1. **Auth (Lovable Cloud)** — save itineraries, favorites server-side.
2. **Public profile pages** — share `/u/yourname`.
3. **Trip comments + ratings**.
4. **"Share with Dad"** — simplified cost+safety summary view.
5. **WhatsApp share button** — huge for India audience.
6. **Newsletter signup** — weekly destination drop.

## 🟣 Phase 5 — Bonkers Mode

1. **3D terrain explorer** (Mapbox GL + heightmaps).
2. **Ambience mode** — soundscapes per country (Kyoto bells, Lidder river).
3. **Historical context layer** — "Why your grandfather studied here."
4. **AR camera "spot the landmark"** (mobile only).
5. **Voice-driven planner** — "Plan me 5 stress-free days in Kashmir."

---

## 🪲 Known Bugs / Tech Debt

- **TS strictness errors** in `PassportStatus.tsx`, `CyberGlobe.tsx`,
  `VisaIntelligence.tsx`, `ItineraryDetail.tsx` (peaks/dayNumber/X icon).
  Runtime is fine — Vite ignores — but `tsc --noEmit` fails.
- **Terrain enum drift** — itineraries reference `culture`, `rural`,
  `road-trip`, `technology`, `tech`, `peaks`, `rivers`, `boulders`,
  `beach` (singular) that aren't in the official `Terrain` union.
- **Gallery `provider==='all'`** loops twice for every photo (perf).
- **Map.tsx** still imports leaflet at top level (no SSR guard).
- **AiAdvisor** uses removed `viewportRef` prop on `ScrollArea`.

---

## 📐 Design Principles (don't break)

1. **No hardcoded colors** — semantic tokens only.
2. **Real data > pretty data** — never invent stops/days to fill UI.
3. **Friction-first** — every screen should reduce decision load.
4. **Offline-friendly** — works on a flight, on a train, in Spiti.
5. **Goated, not generic** — no purple gradients, no Inter-on-white.
