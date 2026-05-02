import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Save, Trash2, Plus, GripVertical, 
  MapPin, Clock, Wallet, Info, Zap, Navigation,
  Bed, Footprints, Car, Bus, Train, Plane, Ship, Bike
} from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useCustomItineraries } from "@/hooks/useCustomItineraries";
import { Itinerary, ItineraryStop, totalCost } from "@/lib/itineraries";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Money } from "@/components/Money";

const MODE_ICON: Record<ItineraryStop["mode"], React.ComponentType<{ className?: string }>> = {
  walk: Footprints, car: Car, bus: Bus, train: Train, flight: Plane, boat: Ship, bike: Bike,
};

const CustomItinerary = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getCustom, saveCustom, deleteCustom } = useCustomItineraries();

  const [it, setIt] = useState<Itinerary | null>(null);

  useEffect(() => {
    if (slug) {
      const custom = getCustom(slug);
      if (custom) {
        setIt(custom);
      } else {
        toast({ title: "Not Found", description: "This custom trip doesn't exist locally.", variant: "destructive" });
        navigate("/itinerary");
      }
    }
  }, [slug, getCustom, navigate, toast]);

  if (!it) return null;

  const handleSave = () => {
    saveCustom(it);
    toast({ title: "Changes Saved", description: "Your custom itinerary has been updated locally." });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this custom trip?")) {
      deleteCustom(it.slug);
      toast({ title: "Trip Deleted", description: "Custom itinerary removed from local storage." });
      navigate("/itinerary");
    }
  };

  const updateStop = (dayIdx: number, stopIdx: number, updates: Partial<ItineraryStop>) => {
    const next = { ...it };
    next.plan[dayIdx].stops[stopIdx] = { ...next.plan[dayIdx].stops[stopIdx], ...updates };
    setIt(next);
  };

  const addStop = (dayIdx: number) => {
    const next = { ...it };
    next.plan[dayIdx].stops.push({
      place: "New Stop",
      activity: "Describe activity...",
      hours: 1,
      km: 0,
      mode: "walk",
      costUsd: 0
    });
    setIt(next);
  };

  const removeStop = (dayIdx: number, stopIdx: number) => {
    const next = { ...it };
    next.plan[dayIdx].stops.splice(stopIdx, 1);
    setIt(next);
  };
  
  const addDay = () => {
    const next = { ...it };
    const nextDayNum = next.plan.length + 1;
    next.plan.push({
      day: nextDayNum,
      title: "New Day",
      base: next.plan[next.plan.length - 1]?.base || "New Location",
      stayUsd: next.plan[next.plan.length - 1]?.stayUsd || 50,
      stops: []
    });
    next.days = nextDayNum;
    setIt(next);
  };

  const total = totalCost(it);

  return (
    <div className="min-h-screen bg-background pb-32">
      <SiteNav />
      
      <header className="border-b border-border/60 bg-surface/50 backdrop-blur-md sticky top-0 z-30">
        <div className="container mx-auto py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to={`/itinerary/${it.slug}`}><ArrowLeft className="h-4 w-4" /></Link>
            </Button>
            <div>
              <h1 className="text-sm font-black uppercase tracking-widest text-primary">Editor: {it.title}</h1>
              <p className="text-[10px] text-muted-foreground font-bold uppercase">Private Local Draft</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <Button variant="outline" onClick={handleDelete} className="text-red-500 hover:text-red-600 hover:bg-red-50 gap-2 border-red-200">
                <Trash2 className="h-4 w-4" /> Delete
             </Button>
             <Button onClick={handleSave} className="bg-primary shadow-glow gap-2">
                <Save className="h-4 w-4" /> Save Changes
             </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-12 max-w-4xl">
         <div className="space-y-12">
            
            {/* Metadata Section */}
            <section className="glass-card p-8 space-y-6">
               <div className="grid gap-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Trip Title</label>
                     <Input 
                        value={it.title} 
                        onChange={(e) => setIt({ ...it, title: e.target.value })}
                        className="text-2xl font-black h-14 bg-background/50 border-border/60 focus:border-primary transition-all"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Blurb / Mission</label>
                     <Textarea 
                        value={it.blurb} 
                        onChange={(e) => setIt({ ...it, blurb: e.target.value })}
                        className="font-medium text-muted-foreground leading-relaxed bg-background/50 border-border/60"
                     />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Travel Type</label>
                        <div className="flex gap-2">
                           {(["base-camp", "road-trip"] as const).map(t => (
                              <button
                                 key={t}
                                 onClick={() => setIt({ ...it, type: t })}
                                 className={cn(
                                    "flex-1 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                                    it.type === t ? "bg-primary text-primary-foreground border-primary shadow-glow" : "bg-surface-muted text-muted-foreground border-border/60 hover:bg-surface"
                                 )}
                              >
                                 {t.replace("-", " ")}
                              </button>
                           ))}
                        </div>
                     </div>
                     <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 flex flex-col justify-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary/70">Estimated Cost per person</span>
                        <div className="text-2xl font-black text-foreground"><Money usd={total} /></div>
                     </div>
                  </div>
               </div>
            </section>

            {/* Days Section */}
            <div className="space-y-10">
               <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                  <Zap className="h-6 w-6 text-accent" /> Execution Timeline
               </h2>
               
               {it.plan.map((day, dIdx) => (
                  <div key={dIdx} className="glass-card p-0 overflow-hidden border-border/60 shadow-elevated">
                     <div className="bg-surface-muted/50 px-6 py-4 border-b border-border/60 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <Badge className="bg-primary text-primary-foreground font-black">Day {day.day}</Badge>
                           <Input 
                              value={day.title} 
                              onChange={(e) => {
                                 const next = { ...it };
                                 next.plan[dIdx].title = e.target.value;
                                 setIt(next);
                              }}
                              className="bg-transparent border-none font-bold p-0 focus-visible:ring-0 w-64 text-foreground"
                           />
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                               <Bed className="h-4 w-4 text-muted-foreground" />
                               <Input 
                                  type="number" 
                                  value={day.stayUsd} 
                                  onChange={(e) => {
                                     const next = { ...it };
                                     next.plan[dIdx].stayUsd = Number(e.target.value);
                                     setIt(next);
                                  }}
                                  className="w-20 h-8 text-right font-black"
                               />
                               <span className="text-[10px] font-black uppercase text-muted-foreground">/ night</span>
                            </div>
                        </div>
                     </div>

                     <div className="p-6 space-y-6">
                        {day.stops.map((stop, sIdx) => {
                           const Icon = MODE_ICON[stop.mode];
                           return (
                              <div key={sIdx} className="flex gap-4 group">
                                 <div className="flex flex-col items-center gap-2 pt-2">
                                    <div className="h-8 w-8 rounded-full bg-surface-muted flex items-center justify-center border border-border group-hover:border-primary transition-colors cursor-grab active:cursor-grabbing">
                                       <GripVertical className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div className="w-px flex-1 bg-border/40" />
                                 </div>
                                 
                                 <div className="flex-1 space-y-4 pb-6">
                                    <div className="grid grid-cols-[1fr_auto] gap-4">
                                       <Input 
                                          value={stop.place} 
                                          onChange={(e) => updateStop(dIdx, sIdx, { place: e.target.value })}
                                          className="font-black text-lg p-0 h-auto border-none bg-transparent focus-visible:ring-0"
                                       />
                                       <Button variant="ghost" size="icon" onClick={() => removeStop(dIdx, sIdx)} className="text-muted-foreground hover:text-red-500">
                                          <Trash2 className="h-4 w-4" />
                                       </Button>
                                    </div>
                                    <Input 
                                       value={stop.activity} 
                                       onChange={(e) => updateStop(dIdx, sIdx, { activity: e.target.value })}
                                       className="text-sm font-medium text-muted-foreground border-none bg-transparent p-0 h-auto focus-visible:ring-0"
                                    />
                                    
                                    <div className="grid grid-cols-4 gap-4 pt-2">
                                       <div className="space-y-1">
                                          <label className="text-[9px] font-black uppercase text-muted-foreground">Mode</label>
                                          <select 
                                             value={stop.mode} 
                                             onChange={(e) => updateStop(dIdx, sIdx, { mode: e.target.value as any })}
                                             className="w-full bg-surface-muted rounded-md text-[10px] font-black p-1 border-none"
                                          >
                                             {Object.keys(MODE_ICON).map(m => <option key={m} value={m}>{m.toUpperCase()}</option>)}
                                          </select>
                                       </div>
                                       <div className="space-y-1">
                                          <label className="text-[9px] font-black uppercase text-muted-foreground">Time (h)</label>
                                          <Input 
                                             type="number" 
                                             value={stop.hours} 
                                             onChange={(e) => updateStop(dIdx, sIdx, { hours: Number(e.target.value) })}
                                             className="h-8 text-[10px] font-black"
                                          />
                                       </div>
                                       <div className="space-y-1">
                                          <label className="text-[9px] font-black uppercase text-muted-foreground">Dist (km)</label>
                                          <Input 
                                             type="number" 
                                             value={stop.km} 
                                             onChange={(e) => updateStop(dIdx, sIdx, { km: Number(e.target.value) })}
                                             className="h-8 text-[10px] font-black"
                                          />
                                       </div>
                                       <div className="space-y-1">
                                          <label className="text-[9px] font-black uppercase text-muted-foreground">Cost ($)</label>
                                          <Input 
                                             type="number" 
                                             value={stop.costUsd} 
                                             onChange={(e) => updateStop(dIdx, sIdx, { costUsd: Number(e.target.value) })}
                                             className="h-8 text-[10px] font-black text-primary"
                                          />
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           );
                        })}
                        
                        <Button variant="ghost" onClick={() => addStop(dIdx)} className="w-full border-2 border-dashed border-border/40 hover:border-primary/40 hover:bg-primary/5 rounded-2xl gap-2 text-muted-foreground font-black text-xs uppercase tracking-widest py-6">
                           <Plus className="h-4 w-4" /> Add Stop to Day {day.day}
                        </Button>
                     </div>
                  </div>
               ))}
               
               <Button 
                  onClick={addDay}
                  className="w-full py-8 border-2 border-dashed border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary font-black uppercase tracking-[0.2em] text-sm rounded-3xl gap-3"
               >
                  <Plus className="h-5 w-5" /> Expand Itinerary (Add Day)
               </Button>
            </div>
         </div>
      </main>
    </div>
  );
};

export default CustomItinerary;
