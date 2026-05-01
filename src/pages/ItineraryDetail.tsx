import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft, Bed, Bike, Bus, Calendar, Car, Clock, Compass, MapPin,
  Plane, Route as RouteIcon, Ship, Train, Users, Footprints, Mountain,
  Share2, Printer, ChevronRight, Info, Luggage, Wallet, Zap, Navigation,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, ZoomControl, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { SiteNav } from "@/components/SiteNav";
import { Flag } from "@/components/Flag";
import { Money } from "@/components/Money";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { getItinerary, totalCost, totalHours, totalKm, calculateFriction, getFrictionLabel, getGoogleMapsUrl, type ItineraryStop } from "@/lib/itineraries";
import { DIFFICULTY_META } from "@/lib/terrains";
import { MONTHS } from "@/data/countries";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { VibePlayer } from "@/components/VibePlayer";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useCustomItineraries } from "@/hooks/useCustomItineraries";

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
  const { toast } = useToast();
  const navigate = useNavigate();
  const { saveCustom, customs } = useCustomItineraries();

  // Check if this is a custom itinerary or curated
  const curated = slug ? getItinerary(slug) : undefined;
  const custom = customs.find(c => c.slug === slug);
  const it = custom || curated;

  const [travelers, setTravelers] = useState(2);
  const [activeDay, setActiveDay] = useState(1);

  useEffect(() => {
    if (it) document.title = `${it.title} — TripAdvisor`;
  }, [it]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: "Link copied!", description: "Itinerary link copied to clipboard." });
  };

  const handleCustomize = () => {
    if (!it) return;
    const newSlug = it.slug.includes("-custom") ? it.slug : `${it.slug}-custom-${Date.now().toString().slice(-4)}`;
    const cloned = { ...it, slug: newSlug, title: `My ${it.title}` };
    saveCustom(cloned);
    toast({ title: "Trip Cloned!", description: "Opening editor for your custom itinerary." });
    navigate(`/itinerary/edit/${newSlug}`);
  };

  const handlePrint = () => window.print();

  const mapsUrl = it ? getGoogleMapsUrl(it) : "#";

  const scrollToDay = (day: number) => {
    const el = document.getElementById(`day-${day}`);
    if (el) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      setActiveDay(day);
    }
  };

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
  const friction = calculateFriction(it);
  const frictionMeta = getFrictionLabel(friction);

  return (
    <div className="min-h-screen bg-background pb-20">
      <SiteNav />

      {/* Hero Section */}
      <section className="bg-gradient-hero border-b border-border/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 translate-x-1/2 pointer-events-none" />
        <div className="container mx-auto py-12 relative z-10">
          <Link to="/itinerary" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 group transition-colors">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to Explorations
          </Link>

          <div className="grid lg:grid-cols-[1fr_400px] gap-12 items-start">
            <div className="space-y-8">
              <header className="space-y-5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                    {it.category || "Discovery"}
                  </Badge>
                  <Badge variant="outline" className={cn("px-3 py-1 text-[10px] font-bold uppercase tracking-wider", it.type === "base-camp" ? "bg-green-500/10 text-green-600 border-green-500/20" : "bg-orange-500/10 text-orange-600 border-orange-500/20")}>
                    {it.type || "Road-Trip"}
                  </Badge>
                  <div className="h-1 w-1 rounded-full bg-border" />
                  <span className="text-xs font-bold text-muted-foreground">{it.days} Days</span>
                  <div className="h-1 w-1 rounded-full bg-border" />
                  <span className={cn("text-xs font-bold", DIFFICULTY_META[it.difficulty].tone)}>{DIFFICULTY_META[it.difficulty].label}</span>
                </div>
                
                <h1 className="font-display text-4xl md:text-6xl font-black leading-[1.1] tracking-tight">
                  <Flag emoji={it.flag} size={56} className="inline-block mr-4 align-middle" />
                  {it.title}
                </h1>
                
                <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed font-medium">
                  {it.blurb}
                </p>

                <div className="flex flex-wrap gap-3 pt-4">
                  {it.tags?.map(tag => (
                    <span key={tag} className="text-[10px] font-bold uppercase tracking-widest bg-surface-muted px-2.5 py-1 rounded-full border border-border/40 text-muted-foreground">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4 pt-6">
                  <Button onClick={handleCustomize} className="rounded-xl bg-primary hover:bg-primary/90 shadow-glow gap-2 px-6">
                    <Zap className="h-4 w-4" /> Customize this Trip
                  </Button>
                  <Button asChild variant="outline" className="rounded-xl gap-2 shadow-sm border-emerald-500/30 bg-emerald-500/5 text-emerald-700 hover:bg-emerald-500/10 transition-colors">
                    <a href={mapsUrl} target="_blank" rel="noreferrer">
                      <Navigation className="h-4 w-4" /> Open in Google Maps
                    </a>
                  </Button>
                  <Button onClick={handleShare} variant="outline" className="rounded-xl gap-2 shadow-sm">
                    <Share2 className="h-4 w-4" /> Share
                  </Button>
                  <Button onClick={handlePrint} variant="outline" className="rounded-xl gap-2 shadow-sm">
                    <Printer className="h-4 w-4" /> Print
                  </Button>
                </div>
              </header>

              {/* Map Visualization */}
              {routePoints.length > 0 && (
                <div className="glass-card overflow-hidden p-0 border-border/60 shadow-elevated group">
                   <div className="bg-surface/50 backdrop-blur-md px-5 py-3 border-b border-border/60 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-foreground">
                      <RouteIcon className="h-4 w-4 text-primary" /> Spatial Route
                    </div>
                    <div className="flex gap-4">
                       <span className="text-[10px] font-bold text-muted-foreground uppercase">{allStops.length} Waypoints</span>
                       <span className="text-[10px] font-bold text-muted-foreground uppercase">{km} Total KM</span>
                    </div>
                  </div>
                  <div className="h-[450px] w-full relative">
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
                      <Polyline positions={routePoints} pathOptions={{ color: "hsl(var(--primary))", weight: 4, opacity: 0.7, dashArray: "8, 12" }} />
                      {allStops.map((s, idx) => s.lat && s.lng && (
                        <Marker key={`${s.place}-${idx}`} position={[s.lat, s.lng]} icon={markerIcon}>
                          <Popup className="custom-popup">
                            <div className="p-2 space-y-1">
                              <div className="font-black text-sm text-primary">{s.place}</div>
                              <div className="text-xs font-medium text-foreground">{s.activity}</div>
                              <div className="flex gap-2 pt-1 border-t border-border/40 mt-1">
                                <span className="text-[9px] font-bold text-muted-foreground uppercase">{s.hours}h</span>
                                <span className="text-[9px] font-bold text-muted-foreground uppercase">{s.km}km</span>
                              </div>
                            </div>
                          </Popup>
                        </Marker>
                      ))}
                    </MapContainer>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Stats Sidebar */}
            <div className="lg:sticky lg:top-24 space-y-6">
              <div className="glass-card p-6 shadow-elevated border-primary/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                   <Zap className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-6 flex items-center gap-2">
                   <Info className="h-4 w-4 text-primary" /> Quick Summary
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <StatItem icon={<Calendar className="h-4 w-4 text-primary" />} label="Duration" value={`${it.days} Days`} />
                  <StatItem icon={<RouteIcon className="h-4 w-4 text-accent" />} label="Travel" value={`${km} km`} />
                  <StatItem icon={<Clock className="h-4 w-4 text-success" />} label="Intensity" value={`${hr}h Active`} />
                  <StatItem icon={<Mountain className="h-4 w-4 text-warn" />} label="Difficulty" value={it.difficulty} />
                </div>
                
                <div className="mt-6 pt-6 border-t border-border/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                      <Zap className="h-3.5 w-3.5 text-accent" /> Friction Score
                    </span>
                    <span className={cn("text-[10px] font-black px-2 py-0.5 rounded-full border", frictionMeta.color)}>
                      {frictionMeta.label}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-muted rounded-full overflow-hidden flex gap-0.5">
                    {[...Array(10)].map((_, i) => (
                      <div 
                        key={i} 
                        className={cn(
                          "h-full flex-1 transition-colors",
                          i < friction ? (friction > 7 ? "bg-red-500" : friction > 4 ? "bg-orange-500" : "bg-green-500") : "bg-border/20"
                        )} 
                      />
                    ))}
                  </div>
                  <p className="text-[9px] text-muted-foreground mt-2 font-medium">
                    Based on movement velocity, mode complexity, and active hours.
                  </p>
                </div>
                
                <div className="mt-6 pt-6 border-t border-border/40 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-tighter flex items-center gap-1.5">
                       <Users className="h-3.5 w-3.5" /> Group Size
                    </span>
                    <span className="text-sm font-black text-primary">{travelers} {travelers === 1 ? 'Person' : 'People'}</span>
                  </div>
                  <Slider value={[travelers]} min={1} max={12} step={1} onValueChange={(v) => setTravelers(v[0])} className="py-2" />
                  
                  <div className="bg-primary/5 rounded-2xl p-5 mt-4 border border-primary/10">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary/70">Estimated Budget</span>
                      <span className="text-[10px] font-bold text-muted-foreground">Excl. Flights</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-foreground">
                        <Money usd={cost * travelers} />
                      </span>
                      <span className="text-xs font-bold text-muted-foreground">Total</span>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full mt-6 rounded-xl bg-primary shadow-glow h-12 font-bold gap-2">
                   <Wallet className="h-4 w-4" /> Save Itinerary
                </Button>
              </div>

              {/* Best Time Info */}
              <div className="glass-card p-5 border-border/40">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">Best Window to Visit</h4>
                <div className="flex flex-wrap gap-1.5">
                   {it.bestMonths.map(m => (
                     <span key={m} className="px-2 py-1 rounded-md bg-surface-muted text-[10px] font-black text-foreground border border-border/40">
                       {MONTHS[m-1]}
                     </span>
                   ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area with Sticky Day-Nav */}
      <div className="container mx-auto py-16">
        <div className="grid lg:grid-cols-[240px_1fr] gap-12 items-start">
          
          {/* Sticky Day-Nav */}
          <aside className="hidden lg:block sticky top-24 space-y-1">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4 pl-4">Itinerary Index</h4>
            {it.plan.map((day) => (
              <button
                key={day.day}
                onClick={() => scrollToDay(day.day)}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-between group",
                  activeDay === day.day 
                    ? "bg-primary text-primary-foreground shadow-glow scale-[1.02]" 
                    : "hover:bg-surface-muted text-muted-foreground"
                )}
              >
                <span>Day {day.day}</span>
                <ChevronRight className={cn("h-4 w-4 transition-transform", activeDay === day.day ? "rotate-90" : "group-hover:translate-x-1")} />
              </button>
            ))}
          </aside>

          <div className="space-y-16">
            {/* Highlights Grid */}
            <section>
              <h2 className="font-display text-3xl font-black mb-8 flex items-center gap-3">
                 <Zap className="h-7 w-7 text-accent" /> Why this trip is Goated
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {it.highlights.map((h, i) => (
                  <div key={h} className="glass-card p-5 flex gap-4 hover-lift border-border/40">
                    <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 text-primary font-black">
                      0{i+1}
                    </div>
                    <div>
                       <h4 className="font-bold text-foreground leading-tight">{h}</h4>
                       <p className="text-xs text-muted-foreground mt-1">Carefully curated highlight for the best {it.countrySlug} experience.</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Day-by-day Itinerary */}
            <section>
               <h2 className="font-display text-3xl font-black mb-10 flex items-center gap-3">
                 <RouteIcon className="h-7 w-7 text-primary" /> Full Execution Plan
               </h2>

               <div className="space-y-8">
                 {it.plan.map((day) => {
                    const dayKm = day.stops.reduce((s, st) => s + st.km, 0);
                    const dayHr = day.stops.reduce((s, st) => s + st.hours, 0);
                    const dayCost = day.stayUsd + day.stops.reduce((s, st) => s + st.costUsd, 0);
                    
                    return (
                      <div key={day.day} id={`day-${day.day}`} className="relative">
                        <div className="glass-card p-0 overflow-hidden border-border/60 shadow-elevated">
                          {/* Day Header */}
                          <div className="bg-surface-muted/50 px-6 py-5 border-b border-border/60 flex flex-wrap items-center justify-between gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="h-5 w-10 rounded-full bg-primary text-primary-foreground text-[10px] font-black flex items-center justify-center uppercase">Day {day.day}</span>
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{day.base}</span>
                              </div>
                              <h3 className="text-2xl font-black tracking-tight">{day.title}</h3>
                            </div>
                            
                            <div className="flex gap-3 text-[10px] font-black uppercase">
                              <div className="flex flex-col items-end">
                                <span className="text-muted-foreground">Movement</span>
                                <span>{Math.round(dayKm)} KM · {dayHr.toFixed(1)}H</span>
                              </div>
                              <div className="w-px h-8 bg-border/60 mx-1" />
                              <div className="flex flex-col items-end">
                                <span className="text-primary">Daily Cost</span>
                                <span><Money usd={dayCost} /> / pp</span>
                              </div>
                            </div>
                          </div>

                          {/* Day Stops */}
                          <div className="p-6">
                            <div className="relative pl-8 space-y-10">
                               <div className="absolute left-[7px] top-1 bottom-1 w-px bg-gradient-to-b from-primary via-border to-transparent" />
                               {day.stops.map((s, i) => {
                                 const Icon = MODE_ICON[s.mode];
                                 return (
                                   <div key={i} className="relative group">
                                     {/* Mode Connector */}
                                     <div className="absolute -left-[32px] top-1.5 h-6 w-6 rounded-full bg-background border-2 border-primary flex items-center justify-center z-10 group-hover:scale-110 transition-transform shadow-sm">
                                        <Icon className="h-3 w-3 text-primary" />
                                     </div>
                                     
                                     <div className="flex flex-wrap lg:flex-nowrap items-start justify-between gap-6">
                                       <div className="space-y-2 flex-1">
                                          <div className="flex items-center gap-3">
                                            <h5 className="font-black text-lg text-foreground tracking-tight">{s.place}</h5>
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-surface-muted px-2 py-0.5 rounded border border-border/40">{MODE_LABEL[s.mode]}</span>
                                          </div>
                                          <p className="text-sm font-medium text-foreground/80 leading-relaxed">{s.activity}</p>
                                          {s.notes && (
                                            <div className="bg-surface/50 rounded-xl p-3 border border-border/40 flex gap-3 italic text-xs text-muted-foreground">
                                               <Info className="h-4 w-4 shrink-0 text-primary/50" />
                                               {s.notes}
                                            </div>
                                          )}
                                       </div>
                                       
                                       <div className="flex flex-row lg:flex-col gap-2 shrink-0">
                                          <StopPill label="Time" value={`${s.hours}h`} />
                                          <StopPill label="Dist" value={`${s.km}km`} />
                                          <StopPill label="Cost" value={<Money usd={s.costUsd} />} highlight />
                                       </div>
                                     </div>
                                   </div>
                                 );
                               })}
                               
                               {/* Overnight Indicator */}
                               <div className="relative pt-4">
                                  <div className="absolute -left-[32px] top-5 h-6 w-6 rounded-full bg-surface-muted border-2 border-border flex items-center justify-center">
                                     <Bed className="h-3 w-3 text-muted-foreground" />
                                  </div>
                                  <div className="bg-surface/30 rounded-2xl p-4 border border-dashed border-border flex items-center justify-between">
                                     <span className="text-xs font-bold text-muted-foreground italic">Resting at {day.base}</span>
                                     <span className="text-xs font-black text-foreground uppercase tracking-widest"><Money usd={day.stayUsd} /> / night</span>
                                  </div>
                               </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                 })}
               </div>
            </section>
          </div>
        </div>
      </div>
      
      {/* Footer CTA */}
      <div className="container mx-auto mt-20 pt-10 border-t border-border/60 text-center">
         <h3 className="font-display text-2xl font-bold mb-4">Ready to lock this in?</h3>
         <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="rounded-xl bg-primary shadow-glow px-8">Book with Advisor</Button>
            <Button size="lg" variant="outline" asChild className="rounded-xl px-8">
               <Link to="/itinerary">Browse other Trips</Link>
            </Button>
         </div>
      </div>
      <VibePlayer />
    </div>
  );
};

function StatItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="space-y-1">
      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
        {icon} {label}
      </span>
      <p className="text-base font-black text-foreground capitalize tracking-tight">{value}</p>
    </div>
  );
}

function StopPill({ label, value, highlight }: { label: string; value: React.ReactNode; highlight?: boolean }) {
  return (
    <div className={cn(
      "px-3 py-1.5 rounded-lg border flex flex-col items-end min-w-[70px]",
      highlight ? "bg-primary/10 border-primary/20" : "bg-surface/50 border-border/60"
    )}>
       <span className="text-[8px] font-black uppercase text-muted-foreground leading-none mb-1">{label}</span>
       <span className={cn("text-xs font-black leading-none", highlight ? "text-primary" : "text-foreground")}>{value}</span>
    </div>
  );
}

export default ItineraryDetail;
