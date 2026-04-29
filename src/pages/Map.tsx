import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { SiteNav } from "@/components/SiteNav";
import { COUNTRIES, REGIONS } from "@/data/countries";
import { useCurrency } from "@/lib/currency";
import { Money, MoneyRange } from "@/components/Money";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Globe2, MapPin } from "lucide-react";

/** Color buckets for daily-cost dots (USD/day). */
function costColor(daily: number): string {
  if (daily <= 60) return "hsl(var(--success))";
  if (daily <= 110) return "hsl(var(--primary))";
  if (daily <= 170) return "hsl(var(--warn))";
  return "hsl(var(--accent))";
}

const MapPage = () => {
  useEffect(() => {
    document.title = "World map — GlobeWise";
  }, []);

  const { format } = useCurrency();
  const [region, setRegion] = useState<string>("all");
  const [budgetMax, setBudgetMax] = useState<number>(4000);

  const visible = useMemo(
    () => COUNTRIES.filter(
      (c) =>
        (region === "all" || c.region === region) &&
        c.costRange[0] <= budgetMax,
    ),
    [region, budgetMax],
  );

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
              Pan, zoom, and click any country pin for a full price + timing snapshot. Pin colour = daily cost.
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
              <Slider
                className="mt-3"
                value={[budgetMax]}
                min={500}
                max={5000}
                step={100}
                onValueChange={(v) => setBudgetMax(v[0])}
              />
            </div>

            <div className="space-y-2 pt-2 border-t border-border/60">
              <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Pin legend (per day)</p>
              <LegendDot color="hsl(var(--success))" label={`Up to ${format(60)}`} />
              <LegendDot color="hsl(var(--primary))" label={`${format(60)} – ${format(110)}`} />
              <LegendDot color="hsl(var(--warn))" label={`${format(110)} – ${format(170)}`} />
              <LegendDot color="hsl(var(--accent))" label={`${format(170)}+`} />
            </div>
          </aside>

          <div className="glass-card overflow-hidden p-0">
            <div className="h-[70vh] min-h-[480px] w-full">
              <MapContainer
                center={[20, 20]}
                zoom={2}
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
                {visible.map((c) => (
                  <CircleMarker
                    key={c.slug}
                    center={[c.lat, c.lng]}
                    radius={9}
                    pathOptions={{
                      color: costColor(c.dailyCost),
                      fillColor: costColor(c.dailyCost),
                      fillOpacity: 0.7,
                      weight: 2,
                    }}
                  >
                    <Tooltip direction="top" offset={[0, -6]} opacity={1}>
                      <span className="font-semibold">{c.flag} {c.name}</span> · <Money usd={c.dailyCost} />/day
                    </Tooltip>
                    <Popup minWidth={220} maxWidth={260}>
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
                          <Pop label="Veg">{c.vegScore}</Pop>
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
                ))}
              </MapContainer>
            </div>
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
