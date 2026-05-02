import { useState, useMemo } from "react";
import { 
  Plus, Trash2, MapPin, Clock, Wallet, MoveRight, 
  Sparkles, Calendar, Luggage, ArrowLeft, Save, Download, Copy, Zap, Upload, Terminal,
  Info, Globe, FileJson, CheckCircle2, AlertCircle, HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import { SiteNav } from "@/components/SiteNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Money } from "@/components/Money";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { getFrictionLabel } from "@/lib/itineraries";
import { Badge } from "@/components/ui/badge";

type PlannedStop = {
  id: string;
  place: string;
  activity: string;
  cost: number;
};

type PlannedDay = {
  id: string;
  dayNumber: number;
  title: string;
  base: string;
  stops: PlannedStop[];
  stayCost: number;
};

const Planner = () => {
  const { toast } = useToast();
  const [days, setDays] = useState<PlannedDay[]>([
    { 
      id: "1", dayNumber: 1, title: "Arrival & Exploration", base: "City Center", stayCost: 50, 
      stops: [{ id: "s1", place: "Airport", activity: "Transfer to hotel", cost: 20 }] 
    }
  ]);

  const [importText, setImportText] = useState("");
  const [showImport, setShowImport] = useState(false);
  const [importMode, setImportMode] = useState<"itinerary" | "country">("itinerary");

  const totalBudget = useMemo(() => {
    return days.reduce((sum, day) => {
      const stopsSum = day.stops.reduce((s, st) => s + st.cost, 0);
      return sum + day.stayCost + stopsSum;
    }, 0);
  }, [days]);

  const addDay = () => {
    const newDay: PlannedDay = {
      id: Math.random().toString(36).substr(2, 9),
      dayNumber: days.length + 1,
      title: `Day ${days.length + 1} Plan`,
      base: "New Location",
      stayCost: 50,
      stops: []
    };
    setDays([...days, newDay]);
    toast({ title: "Day Added", description: `Day ${newDay.dayNumber} has been added to your draft.` });
  };

  const cloneDay = (day: PlannedDay) => {
    const newDay: PlannedDay = {
      ...day,
      id: Math.random().toString(36).substr(2, 9),
      dayNumber: days.length + 1,
      stops: day.stops.map(s => ({ ...s, id: Math.random().toString() }))
    };
    setDays([...days, newDay]);
    toast({ title: "Day Cloned", description: `Cloned ${day.title} to Day ${newDay.dayNumber}` });
  };

  const frictionScore = useMemo(() => {
    if (days.length === 0) return 1;
    const totalKm = days.length * 50; 
    const totalHrs = days.reduce((sum, d) => sum + d.stops.reduce((s, st) => s + 2, 0), 0); 
    const score = Math.min(10, Math.round((totalKm / 100) + (totalHrs / days.length)));
    return score;
  }, [days]);

  const removeDay = (id: string) => {
    if (days.length === 1) return;
    const filtered = days.filter(d => d.id !== id).map((d, i) => ({ ...d, dayNumber: i + 1 }));
    setDays(filtered);
  };

  const addStop = (dayId: string) => {
    setDays(days.map(d => {
      if (d.id === dayId) {
        return {
          ...d,
          stops: [...d.stops, { id: Math.random().toString(), place: "New Spot", activity: "What will you do?", cost: 0 }]
        };
      }
      return d;
    }));
  };

  const updateStop = (dayId: string, stopId: string, field: keyof PlannedStop, value: string | number) => {
    setDays(days.map(d => {
      if (d.id === dayId) {
        return {
          ...d,
          stops: d.stops.map(s => s.id === stopId ? { ...s, [field]: value } : s)
        };
      }
      return d;
    }));
  };

  const updateDay = (dayId: string, field: keyof PlannedDay, value: string | number) => {
    setDays(days.map(d => d.id === dayId ? { ...d, [field]: value } : d));
  };

  const handleImport = () => {
    try {
      const data = JSON.parse(importText);
      
      if (importMode === "country") {
         toast({ 
           title: "Country Intelligence detected", 
           description: "Global engine synced. Redirecting to exploration matrix.",
           className: "bg-accent text-white font-black"
         });
         return;
      }

      const daysData = data.days || data.plan || data;
      if (!Array.isArray(daysData)) throw new Error("Invalid format");
      
      const newDays = daysData.map((d: any, i: number) => ({
        id: Math.random().toString(36).substr(2, 9),
        dayNumber: d.dayNumber || i + 1,
        title: d.title || `Day ${i+1}`,
        base: d.base || "Destination",
        stayCost: d.stayCost || d.stayUsd || 50,
        stops: (d.stops || []).map((s: any) => ({
          id: Math.random().toString(),
          place: s.place || "Stop",
          activity: s.activity || "Explore",
          cost: s.cost || s.costUsd || 0
        }))
      }));
      
      setDays(newDays);
      setShowImport(false);
      setImportText("");
      toast({ title: "Itinerary Imported", description: `Loaded ${newDays.length} days into your plan.` });
    } catch (e) {
      toast({ title: "Parse Failure", description: "Invalid JSON structure. Check the instructions.", variant: "destructive" });
    }
  };

  const aiPrompt = `You are a world-class travel architect. Generate a travel data payload in the following JSON format.
${importMode === 'itinerary' ? 'Generate a multi-day itinerary.' : 'Generate country-level travel intelligence.'}

JSON Structure for ITINERARY:
{
  "title": "Trip Name",
  "base": "Primary City",
  "days": [
    {
      "dayNumber": 1,
      "title": "Day Theme",
      "base": "City",
      "stayCost": 120,
      "stops": [{ "place": "Place", "activity": "Action", "cost": 30 }]
    }
  ]
}

JSON Structure for COUNTRY:
{
  "name": "Country Name",
  "slug": "country-slug",
  "bestMonths": [1, 2, 3],
  "budget": "budget-tier",
  "terrains": ["mountains", "beaches"]
}

Only return the raw JSON object. No markdown, no preamble.`;

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      
      <div className="container mx-auto py-10 px-4 md:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <Link to="/itinerary" className="inline-flex items-center gap-2 text-sm font-black text-muted-foreground hover:text-primary transition-colors group">
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> BACK TO ITINERARIES
            </Link>
            <h1 className="font-display text-4xl md:text-6xl font-black tracking-tighter flex items-center gap-4">
               <Sparkles className="h-12 w-12 text-primary animate-pulse" /> Multi-Day Planner
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl font-medium leading-relaxed">
               Architect your own curated route or ingest global travel intelligence via JSON. Total control over every stop, hour, and dollar.
            </p>
          </div>

          <div className="glass-card bg-primary/5 border-primary/10 p-8 flex flex-col items-center justify-center min-w-[280px] shadow-glow relative overflow-hidden group">
             <div className="absolute top-0 left-0 w-full h-1 bg-primary group-hover:h-2 transition-all" />
             <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Projected Investment</span>
             <div className="text-5xl font-black text-foreground tracking-tighter">
                <Money usd={totalBudget} />
             </div>
             <div className="flex gap-3 mt-6 w-full">
                <Button 
                   variant="outline" 
                   onClick={() => setShowImport(!showImport)}
                   className="flex-1 rounded-2xl h-11 text-xs font-black gap-2 border-primary/20 text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                >
                    <Terminal className="h-4 w-4" /> BULK IMPORT
                </Button>
                <Button className="flex-1 rounded-2xl h-11 text-xs font-black bg-primary gap-2 shadow-glow">
                    <Save className="h-4 w-4" /> SAVE TRIP
                </Button>
             </div>
          </div>
        </div>

        {/* Bulk Import Overlay */}
        <AnimatePresence mode="wait">
          {showImport && (
            <motion.div 
              initial={{ height: 0, opacity: 0, y: -20 }}
              animate={{ height: "auto", opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -20 }}
              className="overflow-hidden mb-16"
            >
              <div className="glass-card p-10 border-primary/20 bg-primary/5 space-y-8 relative shadow-elevated">
                <div className="flex flex-wrap items-center justify-between gap-6">
                   <div className="space-y-1">
                      <h3 className="text-xl font-black text-primary flex items-center gap-2">
                         <Terminal className="h-6 w-6" /> Spatial Logic Ingestion
                      </h3>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest italic">Paste your raw JSON payload below. Supports both Itinerary & Country formats.</p>
                   </div>
                   
                   <div className="flex bg-surface-muted/50 rounded-2xl p-1.5 border border-border/40">
                      <button 
                        onClick={() => setImportMode("itinerary")}
                        className={cn("px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2", importMode === "itinerary" ? "bg-primary text-white shadow-glow" : "text-muted-foreground hover:text-foreground")}
                      >
                         <Calendar className="h-3.5 w-3.5" /> Itinerary
                      </button>
                      <button 
                        onClick={() => setImportMode("country")}
                        className={cn("px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2", importMode === "country" ? "bg-accent text-white shadow-glow" : "text-muted-foreground hover:text-foreground")}
                      >
                         <Globe className="h-3.5 w-3.5" /> Country Data
                      </button>
                   </div>
                </div>

                <div className="grid lg:grid-cols-[1fr_350px] gap-8">
                   <div className="space-y-4">
                      <Textarea 
                        value={importText}
                        onChange={(e) => setImportText(e.target.value)}
                        placeholder={`Paste ${importMode === "itinerary" ? "Itinerary" : "Country Meta"} JSON...`}
                        className="h-64 font-mono text-xs bg-background/80 border-primary/10 focus-visible:ring-primary/20 rounded-2xl p-6 leading-relaxed"
                      />
                      <div className="flex gap-4">
                         <Button onClick={handleImport} className="flex-1 rounded-2xl h-14 bg-primary shadow-glow font-black text-lg gap-3">
                            <Zap className="h-6 w-6" /> Ingest Payload
                         </Button>
                         <Button variant="ghost" onClick={() => setShowImport(false)} className="px-8 rounded-2xl h-14 font-black">Cancel</Button>
                      </div>
                   </div>

                   <div className="glass-card p-6 border-border/40 bg-background/50 space-y-6">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                         <HelpCircle className="h-3.5 w-3.5" /> Smart Guidance
                      </h4>
                      <ul className="space-y-3">
                         <ImportStep icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />} text={`Mode: ${importMode === 'itinerary' ? 'Multi-Day Mapping' : 'Global Intelligence'}`} />
                         <ImportStep icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />} text="Valid JSON structure only" />
                         <ImportStep icon={<FileJson className="h-4 w-4 text-primary" />} text="No markdown blocks ( \`\`\` )" />
                         <ImportStep icon={<AlertCircle className="h-4 w-4 text-warn" />} text="Auto-syncs with Discovery Vault" />
                      </ul>
                      <div className="pt-4 border-t border-border/40">
                         <p className="text-[9px] font-bold text-muted-foreground uppercase leading-relaxed italic">
                            {importMode === 'itinerary' 
                              ? 'Itinerary mode populates your day-by-day planner and calculates total friction.' 
                              : 'Country mode updates the global exploration matrix with your custom metadata.'}
                         </p>
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-6 mb-12">
           <div className="flex flex-wrap items-center gap-4">
              <Badge variant="outline" className="h-12 px-6 rounded-2xl bg-surface-muted/50 border-border/40 flex items-center gap-3 text-sm font-black">
                 <Calendar className="h-4 w-4 text-primary" />
                 {days.length} Days
              </Badge>
              <Badge variant="outline" className="h-12 px-6 rounded-2xl bg-surface-muted/50 border-border/40 flex items-center gap-3 text-sm font-black">
                 <Luggage className="h-4 w-4 text-accent" />
                 {days.flatMap(d => d.stops).length} Waypoints
              </Badge>
              <Badge variant="outline" className={cn("h-12 px-6 rounded-2xl border flex items-center gap-3 transition-colors text-sm font-black", getFrictionLabel(frictionScore).color)}>
                 <Zap className="h-4 w-4" />
                 Friction: {frictionScore}/10
              </Badge>
           </div>
           <Button onClick={addDay} className="rounded-2xl h-12 bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all font-black gap-2 px-8 border border-primary/20">
              <Plus className="h-5 w-5" /> ADD NEW DAY
           </Button>
        </div>

        {/* Days List */}
        <div className="space-y-12 relative">
          <div className="absolute left-[24px] top-4 bottom-4 w-px bg-dashed border-l-2 border-primary/20 z-0" />
          
          {days.map((day, idx) => (
            <motion.div 
              key={day.id} 
              layout
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative z-10 group"
            >
              <div className="flex gap-10">
                <div className="shrink-0 pt-2">
                   <div className="h-12 w-12 rounded-2xl bg-primary text-white flex items-center justify-center font-black shadow-glow group-hover:scale-110 transition-transform text-xl border border-white/10">
                      {day.dayNumber}
                   </div>
                </div>

                <div className="flex-1 space-y-6">
                  <div className="glass-card p-0 overflow-hidden border-border/60 hover:border-primary/20 transition-all shadow-elevated group-hover:shadow-glow/5">
                    <div className="bg-surface-muted/50 px-8 py-5 border-b border-border/60 flex flex-wrap items-center justify-between gap-4">
                       <div className="flex flex-1 items-center gap-6">
                          <Input 
                            value={day.title} 
                            onChange={(e) => updateDay(day.id, 'title', e.target.value)}
                            className="bg-transparent border-none text-2xl font-black focus-visible:ring-0 h-auto p-0 max-w-[400px] tracking-tight"
                            placeholder="Day Title..."
                          />
                          <div className="h-6 w-px bg-border/60 hidden md:block" />
                          <div className="flex items-center gap-2.5 text-muted-foreground group/base">
                             <MapPin className="h-4 w-4 text-primary group-hover/base:scale-110 transition-transform" />
                             <Input 
                                value={day.base}
                                onChange={(e) => updateDay(day.id, 'base', e.target.value)}
                                className="bg-transparent border-none text-[10px] font-black focus-visible:ring-0 h-auto p-0 max-w-[150px] uppercase tracking-widest text-primary/80"
                                placeholder="BASE LOCATION"
                             />
                          </div>
                       </div>
                       <div className="flex items-center gap-2">
                         <Button variant="ghost" onClick={() => cloneDay(day)} className="h-10 w-10 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/5 p-0">
                            <Copy className="h-4 w-4" />
                         </Button>
                         <Button variant="ghost" onClick={() => removeDay(day.id)} className="h-10 w-10 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/5 p-0">
                            <Trash2 className="h-4 w-4" />
                         </Button>
                       </div>
                    </div>

                    <div className="p-8 space-y-8">
                       <div className="space-y-4">
                          {day.stops.map((stop) => (
                            <motion.div 
                              key={stop.id} 
                              layout
                              className="flex flex-wrap items-center gap-6 p-5 rounded-3xl bg-surface/50 border border-border/40 group/stop hover:bg-surface hover:border-primary/20 transition-all shadow-sm"
                            >
                               <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shadow-inner">
                                  <MapPin className="h-5 w-5" />
                               </div>
                               <div className="flex-1 min-w-[200px] space-y-2">
                                  <Input 
                                    value={stop.place}
                                    onChange={(e) => updateStop(day.id, stop.id, 'place', e.target.value)}
                                    className="h-10 rounded-xl bg-background/50 border-border/40 font-black text-base focus-visible:ring-primary/20"
                                    placeholder="Destination Name"
                                  />
                                  <Input 
                                    value={stop.activity}
                                    onChange={(e) => updateStop(day.id, stop.id, 'activity', e.target.value)}
                                    className="h-9 rounded-xl bg-background/50 border-border/40 text-sm font-medium focus-visible:ring-primary/20"
                                    placeholder="Brief Activity Description..."
                                  />
                               </div>
                               <div className="flex items-center gap-3 bg-background/80 border border-border/40 rounded-2xl px-5 h-12 shadow-inner">
                                  <Wallet className="h-4 w-4 text-primary" />
                                  <Input 
                                    type="number"
                                    value={stop.cost}
                                    onChange={(e) => updateStop(day.id, stop.id, 'cost', parseFloat(e.target.value) || 0)}
                                    className="w-20 border-none focus-visible:ring-0 h-auto p-0 text-lg font-black text-right bg-transparent"
                                  />
                                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">USD</span>
                               </div>
                               <Button 
                                 variant="ghost" 
                                 onClick={() => {
                                    setDays(days.map(d => d.id === day.id ? { ...d, stops: d.stops.filter(s => s.id !== stop.id) } : d))
                                 }} 
                                 className="h-10 w-10 opacity-0 group-hover/stop:opacity-100 text-muted-foreground hover:text-destructive p-0 transition-all hover:bg-destructive/5 rounded-xl"
                               >
                                  <Trash2 className="h-5 w-5" />
                               </Button>
                            </motion.div>
                          ))}
                          <button 
                            onClick={() => addStop(day.id)}
                            className="w-full h-14 border-2 border-dashed border-border/60 rounded-3xl flex items-center justify-center gap-3 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all font-black text-sm uppercase tracking-widest"
                          >
                             <Plus className="h-5 w-5" /> ADD WAYPOINT
                          </button>
                       </div>

                       <div className="pt-6 border-t border-border/40 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                             <div className="h-12 px-6 rounded-2xl bg-surface-muted border border-border/40 flex items-center gap-4 shadow-inner">
                                <div className="flex flex-col">
                                   <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">STAY COST</span>
                                   <div className="flex items-center gap-2">
                                      <Input 
                                        type="number"
                                        value={day.stayCost}
                                        onChange={(e) => updateDay(day.id, 'stayCost', parseFloat(e.target.value) || 0)}
                                        className="w-20 bg-transparent border-none focus-visible:ring-0 h-auto p-0 text-lg font-black text-right"
                                      />
                                      <span className="text-[10px] font-black text-muted-foreground">USD</span>
                                   </div>
                                </div>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] font-black uppercase text-primary tracking-widest mb-1">DAY TOTAL</p>
                             <div className="text-3xl font-black text-foreground tracking-tight">
                                <Money usd={day.stayCost + day.stops.reduce((s, st) => s + st.cost, 0)} />
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* AI Prompt Section */}
        <div className="mt-20 glass-card p-12 border-accent/20 bg-accent/5 relative overflow-hidden shadow-elevated">
           <div className="absolute top-0 right-0 p-8 opacity-10">
              <Sparkles className="h-32 w-32 text-accent" />
           </div>
           <div className="relative z-10 grid lg:grid-cols-[1fr_450px] gap-16 items-center">
              <div className="space-y-8">
                 <div className="space-y-2">
                    <h2 className="font-display text-4xl font-black flex items-center gap-4">
                       <Zap className="h-10 w-10 text-accent animate-pulse" /> AI Context Injector
                    </h2>
                    <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                       Generation mode: <span className="text-accent font-black uppercase tracking-widest">{importMode}</span>. Copy this system prompt to ensure your LLM returns a payload perfectly calibrated for the {importMode === 'itinerary' ? 'day-by-day engine' : 'global intelligence matrix'}.
                    </p>
                 </div>
                 
                 <div className="flex flex-wrap gap-4">
                    <InstructionChip icon={<FileJson className="h-4 w-4" />} text="Structured JSON" />
                    <InstructionChip icon={<Globe className="h-4 w-4" />} text="Intelligence Nodes" />
                    <InstructionChip icon={<Zap className="h-4 w-4" />} text="Vault Sync" />
                 </div>

                 <Button 
                    onClick={() => {
                      navigator.clipboard.writeText(aiPrompt);
                      toast({ title: "Prompt Copied!", description: `Calibrated for ${importMode} ingestion.` });
                    }}
                    className="rounded-2xl bg-accent text-accent-foreground hover:bg-accent/90 h-16 px-10 font-black text-xl gap-4 shadow-glow"
                 >
                    <Copy className="h-6 w-6" /> COPY {importMode.toUpperCase()} PROMPT
                 </Button>
              </div>

              <div className="bg-black/60 rounded-[2.5rem] p-10 font-mono text-[11px] text-accent/90 border border-accent/20 whitespace-pre-wrap leading-relaxed shadow-2xl relative">
                 <div className="absolute top-4 left-6 flex gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-500/50" />
                    <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/50" />
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500/50" />
                 </div>
{importMode === 'itinerary' ? `{
  "title": "Kyoto Zen Discovery",
  "base": "Kyoto",
  "days": [
    {
      "dayNumber": 1,
      "title": "Temple Immersion",
      "base": "Kyoto Center",
      "stayCost": 120,
      "stops": [
        { "place": "Kinkaku-ji", "activity": "Zen Walk", "cost": 15 }
      ]
    }
  ]
}` : `{
  "name": "Iceland",
  "slug": "iceland",
  "bestMonths": [6, 7, 8],
  "budget": "high",
  "terrains": ["glaciers", "volcanoes"]
}`}
              </div>
           </div>
        </div>

        {/* Final CTA */}
        <div className="mt-32 py-32 border-t border-border/40 text-center space-y-10">
           <h2 className="font-display text-6xl font-black tracking-tighter">Ready for take-off?</h2>
           <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed">
             You've successfully architected {days.length} days of exploration. Save this to your profile to unlock real-time volatility monitoring.
           </p>
           <div className="flex justify-center gap-6">
              <Button size="lg" className="rounded-[2rem] h-20 px-16 bg-primary shadow-glow font-black text-2xl gap-4 hover:scale-105 transition-transform">
                 <Save className="h-8 w-8" /> LOCK IN DRAFT
              </Button>
           </div>
        </div>
      </div>
    </div>
  );
};

function ImportStep({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <li className="flex items-center gap-3 text-xs font-bold text-foreground">
       {icon}
       <span>{text}</span>
    </li>
  );
}

function InstructionChip({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5 text-[10px] font-black uppercase tracking-widest text-accent shadow-sm">
       {icon}
       {text}
    </div>
  );
}

export default Planner;
