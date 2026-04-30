import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip, ZoomControl, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { SiteNav } from "@/components/SiteNav";
import { CountryTable } from "@/components/CountryTable";
import { TerrainChips } from "@/components/TerrainChips";
import { COUNTRIES, REGIONS, type Country } from "@/data/countries";
import { useCurrency } from "@/lib/currency";
import { Money, MoneyRange } from "@/components/Money";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe2, MapPin } from "lucide-react";
import { TERRAIN_LIST, TERRAIN_META, terrainsFor, type Terrain, difficultyFor, DIFFICULTY_META } from "@/lib/terrains";
import { japanVibe } from "@/lib/japanVibe";
import { cn } from "@/lib/utils";

function costColor(daily: number): string {
  if (daily <= 60) return "hsl(var(--success))";
  if (daily <= 110) return "hsl(var(--primary))";
  if (daily <= 170) return "hsl(var(--warn))";
  return "hsl(var(--accent))";
}

/** Pin radius scales with international tourist arrivals. */
function pinRadius(c: Country): number {
  return 5 + Math.min(12, Math.sqrt(c.touristCount));
}

function FlyTo({ country }: { country: Country | null }) {
  const map = useMap();
  useEffect(() => {
    if (country) map.flyTo([country.lat, country.lng], 5, { duration: 1.2 });
  }, [country, map]);
  return null;
}

const MapPage = () => {
  useEffect(() => { document.title = "World map — TripAdvisor"; }, []);

  const { format } = useCurrency();
  const [params] = useSearchParams();
  const focusSlug = params.get("focus");
  const focusCountry = useMemo(() => COUNTRIES.find((c) => c.slug === focusSlug) ?? null, [focusSlug]);

  const [region, setRegion] = useState<string>("all");
  const [budgetMax, setBudgetMax] = useState<number>(4000);
  const [japanOnly, setJapanOnly] = useState(false);
  const [terrainFilter, setTerrainFilter] = useState<Set<Terrain>>(new Set());
  const popupRefs = useRef<Record<string, L.CircleMarker | null>>({});

  const visible = useMemo(
    () => COUNTRIES.filter((c) => {
      if (region !== "all" && c.region !== region) return false;
      if (c.costRange[0] > budgetMax) return false;
      if (japanOnly && japanVibe(c.slug) < 70) return false;
      if (terrainFilter.size > 0) {
        const ts = new Set(terrainsFor(c));
        if (![...terrainFilter].some((t) => ts.has(t))) return false;
      }
      return true;
    }),
    [region, budgetMax, japanOnly, terrainFilter],
  );

  const toggleTerrain = (t: Terrain) => {
    setTerrainFilter((prev) => {
      const next = new Set(prev);
      next.has(t) ? next.delete(t) : next.add(t);
      return next;
    });
  };

  // Open the focused country's popup once map has rendered
  useEffect(() => {
    if (focusSlug && popupRefs.current[focusSlug]) {
      setTimeout(() => popupRefs.current[focusSlug]?.openPopup(), 1400);
    }
  }, [focusSlug]);

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <div className="container mx-auto py-8">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-primary font-semibold mb-1 inline-flex items-center gap-1.5">
              <Globe2 className="h-3.5 w-3.5" /> Interactive map
            </p>
            <h1 className="font-display text-3xl md:text-4xl font-bold">Where in the world?</h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              Pan, zoom, and click any pin. Pin <strong>color</strong> = daily cost · <strong>size</strong> = tourist popularity.
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{visible.length}</span> of {COUNTRIES.length}
          </div>
        </header>

        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          <aside className="glass-card p-5 space-y-5 h-fit lg:sticky lg:top-20">
            <div>
              <label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Region</label>
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger className="mt-2 bg-surface"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All regions</SelectItem>
                  {REGIONS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="flex justify-between text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                <span>Max 7-day budget</span>
                <span className="text-foreground normal-case tracking-normal font-bold">{format(budgetMax)}</span>
              </div>
              <Slider className="mt-3" value={[budgetMax]} min={500} max={5000} step={100} onValueChange={(v) => setBudgetMax(v[0])} />
            </div>

            <label className="flex items-center justify-between rounded-xl bg-surface-muted px-3 py-2.5 cursor-pointer">
              <span className="text-sm font-medium">Japan-like vibe ≥ 70</span>
              <Switch checked={japanOnly} onCheckedChange={setJapanOnly} />
            </label>

            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-2">Terrain / variety</p>
              <div className="flex flex-wrap gap-1">
                {TERRAIN_LIST.map((t) => {
                  const active = terrainFilter.has(t);
                  const m = TERRAIN_META[t];
                  const Icon = m.icon;
                  return (
                    <button
                      key={t}
                      onClick={() => toggleTerrain(t)}
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium border transition-colors",
                        active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-surface hover:border-primary/40",
                      )}
                    >
                      <Icon className="h-3 w-3" /> {m.label}
                    </button>
                  );
                })}
              </div>
              {terrainFilter.size > 0 && (
                <button onClick={() => setTerrainFilter(new Set())} className="text-[11px] text-primary mt-2 hover:underline">
                  Clear terrain filter
                </button>
              )}
            </div>

            <div className="space-y-2 pt-2 border-t border-border/60">
              <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Pin color (per day)</p>
              <LegendDot color="hsl(var(--success))" label={`Up to ${format(60)}`} />
              <LegendDot color="hsl(var(--primary))" label={`${format(60)} – ${format(110)}`} />
              <LegendDot color="hsl(var(--warn))" label={`${format(110)} – ${format(170)}`} />
              <LegendDot color="hsl(var(--accent))" label={`${format(170)}+`} />
            </div>
          </aside>

          <div>
            <Tabs defaultValue="map">
              <TabsList className="mb-4">
                <TabsTrigger value="map">🗺️ Map</TabsTrigger>
                <TabsTrigger value="table">📊 Table view</TabsTrigger>
              </TabsList>

              <TabsContent value="map" className="m-0">
                <div className="glass-card overflow-hidden p-0">
                  <div className="h-[70vh] min-h-[480px] w-full">
                    <MapContainer
                      center={focusCountry ? [focusCountry.lat, focusCountry.lng] : [20, 20]}
                      zoom={focusCountry ? 4 : 2}
                      minZoom={2}
                      maxZoom={6}
                      worldCopyJump
                      scrollWheelZoom
                      zoomControl={false}
                      style={{ height: "100%", width: "100%", background: "hsl(var(--surface-muted))" }}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &middot; <a href="https://carto.com/attributions">CARTO</a>'
                        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                      />
                      <ZoomControl position="bottomright" />
                      <FlyTo country={focusCountry} />
                      {visible.map((c) => {
                        const ts = terrainsFor(c).slice(0, 3);
                        return (
                          <CircleMarker
                            key={c.slug}
                            ref={(ref) => { popupRefs.current[c.slug] = ref; }}
                            center={[c.lat, c.lng]}
                            radius={pinRadius(c)}
                            pathOptions={{
                              color: costColor(c.dailyCost),
                              fillColor: costColor(c.dailyCost),
                              fillOpacity: 0.7,
                              weight: 2,
                            }}
                          >
                            <Tooltip direction="top" offset={[0, -6]} opacity={1}>
                              <span className="font-semibold">{c.flag} {c.name}</span> · <Money usd={c.dailyCost} />/day · JP {japanVibe(c.slug)}
                            </Tooltip>
                            <Popup minWidth={240} maxWidth={280}>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-2xl">{c.flag}</span>
                                  <div>
                                    <div className="font-display font-bold leading-tight">{c.name}</div>
                                    <div className="text-xs opacity-70 flex items-center gap-1">
                                      <MapPin className="h-3 w-3" /> {c.region}
                                    </div>
                                  </div>
                                </div>
                                <p className="text-xs leading-snug">{c.blurb}</p>
                                <div className="grid grid-cols-2 gap-1.5 text-xs pt-1">
                                  <Pop label="7 days"><MoneyRange range={c.costRange} /></Pop>
                                  <Pop label="Daily"><Money usd={c.dailyCost} /></Pop>
                                  <Pop label="Flights"><MoneyRange range={c.flightCostRange} /></Pop>
                                  <Pop label="JP vibe">{japanVibe(c.slug)}/100</Pop>
                                </div>
                                <div className="flex items-center justify-between pt-1">
                                  <TerrainChips terrains={ts} />
                                  <span className={cn("chip text-[10px]", DIFFICULTY_META[difficultyFor(c)].tone)}>
                                    {DIFFICULTY_META[difficultyFor(c)].label}
                                  </span>
                                </div>
                                <Link
                                  to={`/country/${c.slug}`}
                                  className="block text-center mt-2 rounded-md bg-primary text-primary-foreground text-xs font-semibold py-1.5 hover:opacity-90"
                                >
                                  Open guide →
                                </Link>
                              </div>
                            </Popup>
                          </CircleMarker>
                        );
                      })}
                    </MapContainer>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="table" className="m-0">
                <CountryTable countries={visible} />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Button asChild variant="outline"><Link to="/explore">Browse as cards instead</Link></Button>
        </div>
      </div>
    </div>
  );
};

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="h-3 w-3 rounded-full" style={{ background: color }} />
      <span className="text-foreground">{label}</span>
    </div>
  );
}

function Pop({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-md bg-black/5 px-1.5 py-1">
      <div className="opacity-60 uppercase text-[9px] tracking-wide">{label}</div>
      <div className="font-semibold">{children}</div>
    </div>
  );
}

export default MapPage;
