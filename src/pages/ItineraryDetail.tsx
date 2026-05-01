import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft, Bed, Bike, Bus, Calendar, Car, Clock, Compass, MapPin,
  Plane, Route as RouteIcon, Ship, Train, Users, Footprints, Mountain,
  Share2, Printer,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, ZoomControl, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { SiteNav } from "@/components/SiteNav";
import { Flag } from "@/components/Flag";
import { Money } from "@/components/Money";
import { TerrainChips } from "@/components/TerrainChips";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { getItinerary, totalCost, totalHours, totalKm, type ItineraryStop } from "@/lib/itineraries";
import { DIFFICULTY_META } from "@/lib/terrains";
import { MONTHS } from "@/data/countries";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const MODE_ICON: Record<ItineraryStop["mode"], React.ComponentType<{ className?: string }>> = {
  walk: Footprints, car: Car, bus: Bus, train: Train, flight: Plane, boat: Ship, bike: Bike,
};
const MODE_LABEL: Record<ItineraryStop["mode"], string> = {
  walk: "Walk", car: "Car", bus: "Bus", train: "Train", flight: "Flight", boat: "Boat", bike: "Bike",
};

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function FitBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length > 0) {
      map.fitBounds(positions, { padding: [50, 50] });
    }
  }, [positions, map]);
  return null;
}

const ItineraryDetail = () => {
  const { slug } = useParams();
  const it = slug ? getItinerary(slug) : undefined;
  const { toast } = useToast();

  const [travelers, setTravelers] = useState(2);

  useEffect(() => {
    if (it) document.title = `${it.title} — TripAdvisor`;
  }, [it]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: "Link copied!", description: "Itinerary link copied to clipboard." });
  };

  const handlePrint = () => window.print();

  if (!it) {
    return (
      <div className="min-h-screen bg-background">
        <SiteNav />
        <div className="container mx-auto py-20 text-center">
          <h1 className="font-display text-3xl font-bold mb-4">Itinerary not found</h1>
          <Button asChild><Link to="/itinerary">All itineraries</Link></Button>
        </div>
      </div>
    );
  }

  const allStops = it.plan.flatMap((d) => d.stops);
  const routePoints = allStops
    .filter((s) => s.lat !== undefined && s.lng !== undefined)
    .map((s) => [s.lat!, s.lng!] as [number, number]);

  const km = Math.round(totalKm(it));
  const hr = Math.round(totalHours(it));
  const cost = totalCost(it);

  return (
    <div className="min-h-screen bg-background pb-20">
      <SiteNav />

      <section className="bg-gradient-hero border-b border-border/60">
        <div className="container mx-auto py-10">
          <Link to="/itinerary" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 group transition-colors">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to hub
          </Link>

          <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
            <div className="space-y-8">
              <header className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="chip bg-primary-soft text-primary font-bold px-3 py-1 text-xs">{it.days} Days</span>
                  <span className={cn("chip text-xs font-bold px-3 py-1", DIFFICULTY_META[it.difficulty].tone)}>{DIFFICULTY_META[it.difficulty].label}</span>
                  <div className="flex gap-1">
                    {it.bestMonths.map((m) => (
                      <span key={m} className="text-[10px] font-bold uppercase text-muted-foreground bg-surface-muted px-1.5 py-0.5 rounded-sm">
                        {MONTHS[m - 1]}
                      </span>
                    ))}
                  </div>
                </div>
                <h1 className="font-display text-4xl md:text-5xl font-black leading-tight tracking-tight">
                  <Flag emoji={it.flag} size={48} className="inline-block mr-3 align-middle" />
                  {it.title}
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                  {it.blurb}
                </p>

                <div className="flex flex-wrap gap-4 pt-2">
                  <Button onClick={handleShare} variant="outline" size="sm" className="gap-2">
                    <Share2 className="h-4 w-4" /> Share
                  </Button>
                  <Button onClick={handlePrint} variant="outline" size="sm" className="gap-2">
                    <Printer className="h-4 w-4" /> Print
                  </Button>
                  <Link to={`/country/${it.countrySlug}`} className="chip bg-primary-soft text-primary hover:bg-primary-soft/70 inline-flex items-center gap-1.5 h-9 px-3">
                    <Compass className="h-4 w-4" /> Country guide
                  </Link>
                </div>
              </header>

              {routePoints.length > 0 && (
                <section className="glass-card overflow-hidden p-0 border-2 border-primary/10 shadow-elevated">
                  <div className="bg-primary/5 px-4 py-2 border-b border-primary/10 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                      <RouteIcon className="h-4 w-4" /> Route Visualization
                    </div>
                    <div className="text-[10px] text-muted-foreground font-medium">
                      {allStops.length} stops · {km} km total
                    </div>
                  </div>
                  <div className="h-[400px] w-full relative group">
                    <MapContainer
                      center={routePoints[0]}
                      zoom={9}
                      scrollWheelZoom={false}
                      zoomControl={false}
                      className="h-full w-full z-10"
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <ZoomControl position="bottomright" />
                      <FitBounds positions={routePoints} />
                      <Polyline positions={routePoints} pathOptions={{ color: "hsl(var(--primary))", weight: 4, opacity: 0.6, dashArray: "10, 10" }} />
                      {allStops.map((s, idx) => s.lat && s.lng && (
                        <Marker key={`${s.place}-${idx}`} position={[s.lat, s.lng]} icon={markerIcon}>
                          <Popup>
                            <div className="p-1">
                              <div className="font-bold text-sm">{s.place}</div>
                              <div className="text-xs text-muted-foreground">{s.activity}</div>
                            </div>
                          </Popup>
                        </Marker>
                      ))}
                    </MapContainer>
                  </div>
                </section>
              )}
            </div>

            <div className="glass-card p-5 min-w-[260px] lg:sticky lg:top-24">
              <div className="grid grid-cols-2 gap-3">
                <BigStat icon={<Calendar className="h-4 w-4" />} label="Days" value={`${it.days}`} />
                <BigStat icon={<RouteIcon className="h-4 w-4" />} label="Distance" value={`${km} km`} />
                <BigStat icon={<Clock className="h-4 w-4" />} label="Active" value={`${hr}h`} />
                <BigStat icon={<Mountain className="h-4 w-4" />} label="Stops" value={`${allStops.length}`} />
              </div>
              <div className="mt-4 pt-4 border-t border-border/50">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" /> Travelers</span>
                  <span className="font-bold text-foreground">{travelers}</span>
                </div>
                <Slider value={[travelers]} min={1} max={8} step={1} onValueChange={(v) => setTravelers(v[0])} />
              </div>
              <div className="mt-4 pt-4 border-t border-border/50 flex items-baseline justify-between">
                <span className="text-xs text-muted-foreground uppercase tracking-wide">Total cost</span>
                <span className="font-display font-extrabold text-2xl text-primary"><Money usd={cost * travelers} /></span>
              </div>
              <p className="text-[10px] text-muted-foreground text-right">{travelers > 1 ? `${travelers} travelers · ` : ""}excludes intl. flights</p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto py-10">
        <h2 className="font-display text-2xl font-bold mb-1">Highlights</h2>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-10">
          {it.highlights.map((h) => (
            <li key={h} className="glass-card px-4 py-3 text-sm font-medium flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary shrink-0" /> {h}
            </li>
          ))}
        </ul>

        <h2 className="font-display text-2xl font-bold mb-4 inline-flex items-center gap-2">
          <RouteIcon className="h-6 w-6 text-primary" /> Day-by-day plan
        </h2>

        <ol className="space-y-5">
          {it.plan.map((day) => {
            const dayKm = day.stops.reduce((s, st) => s + st.km, 0);
            const dayHr = day.stops.reduce((s, st) => s + st.hours, 0);
            const dayCost = day.stayUsd + day.stops.reduce((s, st) => s + st.costUsd, 0);
            return (
              <li key={day.day} className="glass-card p-6">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-primary font-semibold">Day {day.day}</p>
                    <h3 className="font-display text-xl font-bold">{day.title}</h3>
                    <p className="text-sm text-muted-foreground inline-flex items-center gap-1.5 mt-1">
                      <Bed className="h-3.5 w-3.5" /> Sleep: <span className="font-semibold text-foreground">{day.base}</span>
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <Pill icon={<RouteIcon className="h-3 w-3" />}>{Math.round(dayKm)} km</Pill>
                    <Pill icon={<Clock className="h-3 w-3" />}>{dayHr.toFixed(1)} h</Pill>
                    <Pill icon={<Bed className="h-3 w-3" />}><Money usd={day.stayUsd} /> stay</Pill>
                    <Pill icon={null} className="bg-primary-soft text-primary">Day total <Money usd={dayCost} /></Pill>
                  </div>
                </div>

                <div className="relative pl-6 border-l-2 border-dashed border-primary/30 space-y-4">
                  {day.stops.map((s, i) => {
                    const Icon = MODE_ICON[s.mode];
                    return (
                      <div key={i} className="relative">
                        <span className="absolute -left-[33px] top-1 grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold ring-4 ring-background">
                          {i + 1}
                        </span>
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold">{s.place}</p>
                            <p className="text-sm text-muted-foreground">{s.activity}</p>
                            {s.notes && <p className="text-xs text-muted-foreground mt-1">{s.notes}</p>}
                          </div>
                          <div className="flex flex-wrap gap-1.5 text-[11px] shrink-0">
                            <span className="chip bg-secondary text-secondary-foreground">
                              <Icon className="h-3 w-3" /> {MODE_LABEL[s.mode]}
                            </span>
                            {s.km > 0 && <span className="chip bg-surface-muted text-foreground">{s.km} km</span>}
                            <span className="chip bg-surface-muted text-foreground">{s.hours}h</span>
                            <span className="chip bg-primary-soft text-primary"><Money usd={s.costUsd} /></span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-10 text-center">
          <Button asChild variant="outline"><Link to="/itinerary">← Browse other itineraries</Link></Button>
        </div>
      </div>
    </div>
  );
};

function BigStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-surface-muted px-3 py-2.5">
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-muted-foreground">{icon}{label}</div>
      <div className="text-lg font-display font-bold mt-0.5 tabular-nums">{value}</div>
    </div>
  );
}

function Pill({ icon, children, className }: { icon: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("chip bg-surface-muted text-foreground", className)}>
      {icon}{children}
    </span>
  );
}

export default ItineraryDetail;
