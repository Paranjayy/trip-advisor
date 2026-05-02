import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Bed, Bike, Bus, Calendar, Car, Clock, Compass, MapPin,
  Plane, Route as RouteIcon, Ship, Train, Users, Footprints, Mountain,
  Share2, Printer, ChevronRight, Info, Luggage, Wallet, Zap, Navigation, List as ListIcon, Camera,
  Image as ImageIcon, TrendingUp, TrendingDown,
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
import { useCustomItineraries } from "@/hooks/useCustomItineraries";
import { getPhotoUrl } from "@/lib/photos";
import { motion, AnimatePresence } from "framer-motion";

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

  const curated = slug ? getItinerary(slug) : undefined;
  const custom = customs.find(c => c.slug === slug);
  const it = custom || curated;

  const [travelers, setTravelers] = useState(2);
  const [activeDay, setActiveDay] = useState(1);
  const [simulatedDays, setSimulatedDays] = useState<number>(it?.days || 0);
  const [showPhotos, setShowPhotos] = useState(false);

  useEffect(() => { if (it) setSimulatedDays(it.days); }, [it]);
  useEffect(() => { if (it) document.title = `${it.title} — TripAdvisor`; }, [it]);

  useEffect(() => {
    const handleScroll = () => {
      const days = it?.plan.map(d => document.getElementById(`day-${d.day}`));
      if (!days) return;
      const viewportHeight = window.innerHeight;
      const threshold = viewportHeight * 0.3;
      for (let i = days.length - 1; i >= 0; i--) {
        const el = days[i];
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= threshold) {
            setActiveDay(it!.plan[i].day);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
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

  const scrollToDay = (day: number) => {
    const el = document.getElementById(`day-${day}`);
    if (el) {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 100, behavior: "smooth" });
      setActiveDay(day);
    }
  };

  const displayedPlan = useMemo(() => {
    if (!it) return [];
    return it.plan.slice(0, simulatedDays);
  }, [it, simulatedDays]);

  if (!it) return null;

  const allStops = displayedPlan.flatMap((d) => d.stops);
  const routePoints = allStops
    .filter((s) => s.lat !== undefined && s.lng !== undefined)
    .map((s) => [s.lat!, s.lng!] as [number, number]);

  const km = Math.round(allStops.reduce((s, st) => s + st.km, 0));
  const hr = Math.round(allStops.reduce((s, st) => s + st.hours, 0));
  const cost = displayedPlan.reduce((s, d) => s + d.stayUsd + d.stops.reduce((ss, st) => ss + st.costUsd, 0), 0);
  const friction = calculateFriction({ ...it!, plan: displayedPlan, days: simulatedDays });
  const frictionMeta = getFrictionLabel(friction);

  const isMountain = it.terrains.includes("mountains") || it.terrains.includes("peaks") || it.terrains.includes("snow");
  const altitudes = isMountain ? [2000, 3200, 4500, 3800, 5200, 4800, 3500].slice(0, simulatedDays) : [];

  return (
    <div className="min-h-screen bg-background pb-20">
      <SiteNav />

      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex flex-col justify-end overflow-hidden border-b border-border/40">
        <img 
          src={getPhotoUrl(it.slug.split('-')[0], 1920, 1080)} 
          alt={it.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />

        <div className="container mx-auto py-12 relative z-10 px-4 md:px-6">
          <Link to="/itinerary" className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white mb-8 group transition-colors bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to Trips
          </Link>

          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge variant="outline" className="bg-primary/20 text-white border-primary/40 px-3 py-1 text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                {it.category || "Discovery"}
              </Badge>
              <Badge variant="outline" className={cn("px-3 py-1 text-[10px] font-black uppercase tracking-widest backdrop-blur-md", it.type === "base-camp" ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" : "bg-orange-500/20 text-orange-300 border-orange-500/40")}>
                {it.type || "Road-Trip"}
              </Badge>
            </div>
            
            <h1 className="font-display text-4xl md:text-7xl font-black leading-tight tracking-tight text-white drop-shadow-2xl max-w-4xl">
              <Flag emoji={it.flag} size={64} className="inline-block mr-4 align-middle" />
              {it.title}
            </h1>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Button onClick={handleCustomize} className="rounded-2xl bg-primary hover:bg-primary/90 shadow-glow gap-2 h-14 px-8 font-black text-lg">
                <Zap className="h-5 w-5" /> Customize Trip
              </Button>
              <Button onClick={() => setShowPhotos(true)} variant="outline" className="rounded-2xl h-14 px-8 bg-white/10 backdrop-blur-md border-white/20 text-white font-black text-lg hover:bg-white/20 gap-2">
                <Camera className="h-5 w-5" /> View Photo Pulse
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Stats & Map Grid */}
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="grid lg:grid-cols-[1fr_380px] gap-10 items-start">
          <div className="space-y-12">
            {/* Quick Summary Strip */}
            <div className="glass-card grid grid-cols-2 md:grid-cols-4 gap-6 p-8 border-primary/10 shadow-elevated">
               <StatItem icon={<Calendar className="h-5 w-5 text-primary" />} label="Duration" value={`${simulatedDays} Days`} />
               <StatItem icon={<RouteIcon className="h-5 w-5 text-accent" />} label="Travel" value={`${km} km`} />
               <StatItem icon={<Clock className="h-5 w-5 text-success" />} label="Intensity" value={`${hr}h Active`} />
               <StatItem icon={<Mountain className="h-5 w-5 text-warn" />} label="Difficulty" value={it.difficulty} />
            </div>

            {/* Altitude Pulse - NEW FEATURE */}
            {isMountain && (
              <div className="glass-card p-8 border-primary/5 bg-primary/5 relative overflow-hidden shadow-elevated">
                 <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Mountain className="h-24 w-24 text-primary" />
                 </div>
                 <div className="relative z-10 space-y-6">
                    <div className="flex items-center justify-between">
                       <h3 className="text-xl font-black flex items-center gap-2">
                          <TrendingUp className="h-6 w-6 text-primary" /> Altitude Pulse Matrix
                       </h3>
                       <Badge className="bg-primary text-white font-black text-[9px] uppercase tracking-widest">High-Altitude Protocol</Badge>
                    </div>
                    <div className="h-32 flex items-end gap-2 overflow-hidden">
                       {altitudes.map((alt, i) => (
                         <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                            <div className="text-[10px] font-black text-primary opacity-0 group-hover:opacity-100 transition-opacity">{alt}m</div>
                            <motion.div 
                              initial={{ height: 0 }}
                              animate={{ height: `${(alt / 5500) * 100}%` }}
                              className="w-full bg-primary/20 rounded-t-lg border-x border-t border-primary/30 relative group-hover:bg-primary transition-colors"
                            >
                               {alt > 4000 && <Zap className="absolute -top-2 left-1/2 -translate-x-1/2 h-3 w-3 text-warn animate-pulse" />}
                            </motion.div>
                            <div className="text-[9px] font-bold text-muted-foreground">D{i+1}</div>
                         </div>
                       ))}
                    </div>
                    <p className="text-xs text-muted-foreground italic leading-relaxed">
                       * Altitude telemetry is simulated based on base-camp nodes. Oxygen protocols recommended for peaks exceeding 4,000m.
                    </p>
                 </div>
              </div>
            )}

            {/* Map Visualization */}
            {routePoints.length > 0 && (
              <div className="glass-card overflow-hidden p-0 border-border/60 shadow-elevated group">
                 <div className="bg-surface/50 backdrop-blur-md px-6 py-4 border-b border-border/60 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-[11px] font-black uppercase tracking-widest text-foreground">
                    <RouteIcon className="h-4 w-4 text-primary" /> Spatial Route Dynamics
                  </div>
                  <div className="flex gap-4">
                     <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{allStops.length} Waypoints</span>
                     <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{km} Total KM</span>
                  </div>
                </div>
                <div className="h-[500px] w-full relative">
                  <MapContainer
                    center={routePoints[0]}
                    zoom={9}
                    scrollWheelZoom={false}
                    zoomControl={false}
                    className="h-full w-full z-10"
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <ZoomControl position="bottomright" />
                    <FitBounds positions={routePoints} />
                    <Polyline positions={routePoints} pathOptions={{ color: "hsl(var(--primary))", weight: 5, opacity: 0.8, dashArray: "10, 15" }} />
                    {allStops.map((s, idx) => s.lat && s.lng && (
                      <Marker key={`${s.place}-${idx}`} position={[s.lat, s.lng]} icon={markerIcon}>
                        <Popup className="custom-popup">
                          <div className="p-3 space-y-1.5">
                            <div className="font-black text-sm text-primary uppercase tracking-tight">{s.place}</div>
                            <div className="text-xs font-bold text-foreground leading-snug">{s.activity}</div>
                            <div className="flex gap-3 pt-2 border-t border-border/40 mt-2">
                              <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{s.hours}h</span>
                              <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{s.km}km</span>
                              <Money usd={s.costUsd} />
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </div>
              </div>
            )}

            {/* Goated Highlights */}
            <section>
              <h2 className="font-display text-3xl font-black mb-8 flex items-center gap-3">
                 <Zap className="h-8 w-8 text-accent animate-pulse" /> Why this trip is Goated
              </h2>
              <div className="grid sm:grid-cols-2 gap-5">
                {it.highlights.map((h, i) => (
                  <div key={h} className="glass-card p-6 flex gap-5 hover-lift border-primary/5 bg-primary/5">
                    <div className="h-12 w-12 rounded-2xl bg-primary text-white flex items-center justify-center shrink-0 font-black shadow-glow text-lg">
                      {i+1}
                    </div>
                    <div>
                       <h4 className="font-black text-foreground text-lg leading-tight">{h}</h4>
                       <p className="text-xs text-muted-foreground mt-2 leading-relaxed">Carefully curated highlight for the best {it.countrySlug} experience.</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Configuration Sidebar */}
          <aside className="lg:sticky lg:top-24 space-y-8">
            <div className="glass-card p-8 shadow-elevated border-primary/10 relative overflow-hidden bg-surface-muted/30">
              <div className="absolute -top-10 -right-10 p-12 opacity-5">
                 <RouteIcon className="h-40 w-40 text-primary" />
              </div>
              
              <h3 className="text-xs font-black uppercase tracking-widest mb-8 flex items-center gap-2 text-primary">
                 <Compass className="h-4 w-4" /> Trip Engine Config
              </h3>

              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Friction Score</span>
                    <span className={cn("text-[10px] font-black px-2 py-1 rounded-full border", frictionMeta.color)}>
                      {frictionMeta.label} ({friction}/10)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-surface-muted rounded-full overflow-hidden flex gap-0.5">
                    {[...Array(10)].map((_, i) => (
                      <div key={i} className={cn("h-full flex-1 transition-colors", i < friction ? "bg-primary" : "bg-border/20")} />
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Duration Adjuster</span>
                      <span className="text-sm font-black text-primary">{simulatedDays} Days</span>
                   </div>
                   <Slider value={[simulatedDays]} min={1} max={it.days} step={1} onValueChange={(v) => setSimulatedDays(v[0])} />
                </div>

                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Party Size</span>
                      <span className="text-sm font-black text-primary">{travelers} People</span>
                   </div>
                   <Slider value={[travelers]} min={1} max={12} step={1} onValueChange={(v) => setTravelers(v[0])} />
                </div>

                <div className="bg-primary/10 rounded-2xl p-6 mt-8 border border-primary/20 shadow-glow">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-black uppercase tracking-widest text-primary/80">Estimated Budget</span>
                    <span className="text-[9px] font-bold text-muted-foreground">EXCL. FLIGHTS</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-foreground">
                      <Money usd={cost * travelers} />
                    </span>
                    <span className="text-[10px] font-black text-muted-foreground uppercase">Total</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleShare} variant="outline" className="flex-1 rounded-xl h-12 font-bold gap-2">
                    <Share2 className="h-4 w-4" /> Share
                  </Button>
                  <Button onClick={() => window.print()} variant="outline" className="flex-1 rounded-xl h-12 font-bold gap-2">
                    <Printer className="h-4 w-4" /> Print
                  </Button>
                </div>
              </div>
            </div>

            {/* Best Window Card */}
            <div className="glass-card p-6 border-border/40 bg-surface-muted/20">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Prime Visitation Window</h4>
              <div className="flex flex-wrap gap-2">
                 {it.bestMonths.map(m => (
                   <span key={m} className="px-3 py-1.5 rounded-lg bg-background text-[11px] font-black text-foreground border border-border/40 shadow-sm">
                     {MONTHS[m-1]}
                   </span>
                 ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Day-by-Day Execution */}
      <div className="container mx-auto py-20 px-4 md:px-6 border-t border-border/40">
        <div className="grid lg:grid-cols-[260px_1fr] gap-16 items-start">
          <aside className="hidden lg:block sticky top-32">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-primary mb-6 flex items-center gap-2 pl-4">
               <ListIcon className="h-4 w-4" /> Execution Index
            </h4>
            <div className="relative pl-4 space-y-2">
               <div className="absolute left-0 top-0 bottom-0 w-1 bg-border/20 rounded-full" />
               <div 
                  className="absolute left-0 w-1 bg-primary rounded-full transition-all duration-500 shadow-glow"
                  style={{ top: `${(activeDay - 1) * 48 + 4}px`, height: "32px" }}
               />
               {displayedPlan.map((day) => (
                 <button
                   key={day.day}
                   onClick={() => scrollToDay(day.day)}
                   className={cn(
                     "w-full text-left px-4 py-3 rounded-xl text-sm font-black transition-all flex items-center justify-between group",
                     activeDay === day.day ? "text-primary bg-primary/5" : "text-muted-foreground hover:bg-surface-muted"
                   )}
                 >
                   <span>Day {day.day}</span>
                   <ChevronRight className={cn("h-4 w-4 transition-transform", activeDay === day.day ? "rotate-90 text-primary" : "group-hover:translate-x-1")} />
                 </button>
               ))}
            </div>
          </aside>

          <div className="space-y-20">
            {displayedPlan.map((day) => (
              <div key={day.day} id={`day-${day.day}`} className="space-y-8 scroll-mt-24">
                <div className="glass-card p-0 overflow-hidden border-border/60 shadow-elevated bg-surface/30">
                  <div className="h-64 relative overflow-hidden shrink-0 group">
                    <img 
                      src={getPhotoUrl(day.base, 1000, 400)} 
                      alt={day.base}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                    <div className="absolute bottom-6 left-8 flex items-end gap-6">
                       <div className="h-14 w-14 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-xl shadow-glow border border-white/10 backdrop-blur-md">
                          {day.dayNumber}
                       </div>
                       <div className="pb-1">
                          <span className="text-[10px] font-black text-white/80 uppercase tracking-widest block mb-1">Base: {day.base}</span>
                          <h3 className="text-3xl font-black text-white tracking-tight drop-shadow-md">{day.title}</h3>
                       </div>
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="relative pl-10 space-y-12">
                       <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-primary via-border/40 to-transparent" />
                       {day.stops.map((s, i) => {
                         const Icon = MODE_ICON[s.mode];
                         return (
                           <div key={i} className="relative group">
                             <div className="absolute -left-[43px] top-1.5 h-8 w-8 rounded-full bg-background border-2 border-primary flex items-center justify-center z-10 group-hover:scale-110 transition-transform shadow-sm">
                                <Icon className="h-4 w-4 text-primary" />
                             </div>
                             
                             <div className="flex flex-wrap md:flex-nowrap items-start justify-between gap-8">
                               <div className="space-y-3 flex-1">
                                  <div className="flex items-center gap-3">
                                    <h5 className="font-black text-xl text-foreground tracking-tight">{s.place}</h5>
                                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-surface-muted px-2.5 py-1 rounded-lg border border-border/40 shadow-sm">{MODE_LABEL[s.mode]}</span>
                                  </div>
                                  <p className="text-base font-medium text-foreground/70 leading-relaxed">{s.activity}</p>
                                  {s.notes && (
                                    <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 flex gap-4 italic text-sm text-muted-foreground">
                                       <Info className="h-5 w-5 shrink-0 text-primary/40" />
                                       {s.notes}
                                    </div>
                                  )}
                               </div>
                               
                               <div className="flex flex-row md:flex-col gap-3 shrink-0">
                                  <StopPill label="Movement" value={`${s.hours}h · ${s.km}km`} />
                                  <StopPill label="Est. Cost" value={<Money usd={s.costUsd} />} highlight />
                               </div>
                             </div>
                           </div>
                         );
                       })}
                       
                       <div className="relative pt-6">
                          <div className="absolute -left-[43px] top-8 h-8 w-8 rounded-full bg-surface-muted border-2 border-border/60 flex items-center justify-center">
                             <Bed className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div className="bg-surface-muted/30 rounded-3xl p-6 border border-dashed border-border/60 flex items-center justify-between shadow-sm">
                             <span className="text-sm font-black text-muted-foreground uppercase tracking-widest italic">Overnight Base: {day.base}</span>
                             <div className="text-right">
                                <span className="text-[10px] font-black text-primary uppercase block mb-0.5 tracking-widest">Stay Cost</span>
                                <span className="text-xl font-black text-foreground"><Money usd={day.stayUsd} /></span>
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <VibePlayer />

      {/* Photo Pulse Overlay */}
      <AnimatePresence>
        {showPhotos && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] bg-background/95 backdrop-blur-xl flex flex-col p-10"
          >
             <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                   <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-white">
                      <ImageIcon className="h-6 w-6" />
                   </div>
                   <div>
                      <h2 className="text-3xl font-black tracking-tight">{it.title} Photo Pulse</h2>
                      <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-widest flex items-center gap-2 mt-1">
                         <Camera className="h-3 w-3" /> Visual Immersion Stream
                      </p>
                   </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowPhotos(false)} className="rounded-full h-12 w-12 hover:bg-white/10">
                   <Zap className="h-6 w-6 rotate-90" />
                </Button>
             </div>

             <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
                <div className="columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
                   {[...displayedPlan.map(d => d.base), ...allStops.map(s => s.place), it.title].slice(0, 12).map((place, i) => (
                     <motion.div 
                        key={`${place}-${i}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="break-inside-avoid relative group rounded-3xl overflow-hidden shadow-elevated border border-white/5"
                     >
                        <img 
                          src={getPhotoUrl(place, 800, 800)} 
                          alt={place} 
                          className="w-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                           <p className="text-white font-black text-sm uppercase tracking-widest">{place}</p>
                        </div>
                     </motion.div>
                   ))}
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function StatItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="space-y-1.5">
      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
        {icon} {label}
      </span>
      <p className="text-xl font-black text-foreground tracking-tighter leading-none">{value}</p>
    </div>
  );
}

function StopPill({ label, value, highlight }: { label: string; value: React.ReactNode; highlight?: boolean }) {
  return (
    <div className={cn(
      "px-4 py-2.5 rounded-2xl border flex flex-col items-end min-w-[100px] shadow-sm",
      highlight ? "bg-primary/10 border-primary/30" : "bg-white/5 border-border/40"
    )}>
       <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest mb-1 leading-none">{label}</span>
       <span className={cn("text-sm font-black leading-none", highlight ? "text-primary" : "text-foreground")}>{value}</span>
    </div>
  );
}

export default ItineraryDetail;
