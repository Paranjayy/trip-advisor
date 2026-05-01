import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft, Bed, Bike, Bus, Calendar, Car, Clock, Compass, MapPin,
  Plane, Route as RouteIcon, Ship, Train, Users, Footprints, Mountain,
} from "lucide-react";
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

const MODE_ICON: Record<ItineraryStop["mode"], React.ComponentType<{ className?: string }>> = {
  walk: Footprints, car: Car, bus: Bus, train: Train, flight: Plane, boat: Ship, bike: Bike,
};
const MODE_LABEL: Record<ItineraryStop["mode"], string> = {
  walk: "Walk", car: "Car", bus: "Bus", train: "Train", flight: "Flight", boat: "Boat", bike: "Bike",
};

const ItineraryDetail = () => {
  const { slug } = useParams();
  const it = slug ? getItinerary(slug) : undefined;

  const [travelers, setTravelers] = useState(2);

  useEffect(() => {
    if (it) document.title = `${it.title} — TripAdvisor`;
  }, [it]);

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

  const km = Math.round(totalKm(it));
  const hr = Math.round(totalHours(it));
  const cost = totalCost(it);
  const d = DIFFICULTY_META[it.difficulty];

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      <section className="bg-gradient-hero border-b border-border/60">
        <div className="container mx-auto py-10">
          <Link to="/itinerary" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" /> All itineraries
          </Link>
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-2">
                <Flag emoji={it.flag} size={42} />
                <p className="text-muted-foreground flex items-center gap-1.5"><MapPin className="h-4 w-4" />{it.region}</p>
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight">{it.title}</h1>
              <p className="text-lg text-muted-foreground mt-3">{it.blurb}</p>
              <div className="flex flex-wrap items-center gap-2 mt-4">
                <span className={cn("chip", d.tone)}>{d.label} difficulty</span>
                <span className="chip bg-secondary text-secondary-foreground">
                  <Calendar className="h-3 w-3" /> Best: {it.bestMonths.map((m) => MONTHS[m - 1]).join(", ")}
                </span>
                <Link to={`/country/${it.countrySlug}`} className="chip bg-primary-soft text-primary hover:bg-primary-soft/70">
                  <Compass className="h-3 w-3" /> Country guide
                </Link>
              </div>
              <div className="mt-4"><TerrainChips terrains={it.terrains} max={8} /></div>
            </div>

            <div className="glass-card p-5 min-w-[260px]">
              <div className="grid grid-cols-2 gap-3">
                <BigStat icon={<Calendar className="h-4 w-4" />} label="Days" value={`${it.days}`} />
                <BigStat icon={<RouteIcon className="h-4 w-4" />} label="Distance" value={`${km} km`} />
                <BigStat icon={<Clock className="h-4 w-4" />} label="Active" value={`${hr}h`} />
                <BigStat icon={<Mountain className="h-4 w-4" />} label="Stops" value={`${it.plan.reduce((s, d) => s + d.stops.length, 0)}`} />
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
