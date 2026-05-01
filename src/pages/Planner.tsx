import { useState, useMemo } from "react";
import { 
  Plus, Trash2, MapPin, Clock, Wallet, MoveRight, 
  Sparkles, Calendar, Luggage, ArrowLeft, Save, Download
} from "lucide-react";
import { Link } from "react-router-dom";
import { SiteNav } from "@/components/SiteNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Money } from "@/components/Money";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

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

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      
      <div className="container mx-auto py-10 px-4 md:px-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-4">
            <Link to="/itinerary" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group">
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Itineraries
            </Link>
            <h1 className="font-display text-4xl md:text-5xl font-black tracking-tight flex items-center gap-3">
               <Sparkles className="h-10 w-10 text-primary" /> Multi-Day Planner
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl font-medium">
               Build your own custom route from scratch. Any number of days, any budget. Total control over every stop.
            </p>
          </div>

          <div className="glass-card bg-primary/5 border-primary/20 p-6 flex flex-col items-center justify-center min-w-[240px] shadow-glow relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
             <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Projected Total</span>
             <div className="text-4xl font-black text-foreground">
                <Money usd={totalBudget} />
             </div>
             <div className="flex gap-4 mt-4 w-full">
                <Button variant="outline" className="flex-1 rounded-xl h-9 text-xs font-bold gap-2">
                   <Download className="h-3.5 w-3.5" /> Export
                </Button>
                <Button className="flex-1 rounded-xl h-9 text-xs font-bold bg-primary gap-2 shadow-glow">
                   <Save className="h-3.5 w-3.5" /> Save Trip
                </Button>
             </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-4">
              <div className="h-10 px-4 rounded-xl bg-surface-muted border border-border/40 flex items-center gap-3">
                 <Calendar className="h-4 w-4 text-primary" />
                 <span className="text-sm font-bold">{days.length} Days Planned</span>
              </div>
              <div className="h-10 px-4 rounded-xl bg-surface-muted border border-border/40 flex items-center gap-3">
                 <Luggage className="h-4 w-4 text-accent" />
                 <span className="text-sm font-bold">{days.flatMap(d => d.stops).length} Total Waypoints</span>
              </div>
           </div>
           <Button onClick={addDay} className="rounded-xl h-10 bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all font-bold gap-2">
              <Plus className="h-4 w-4" /> Add New Day
           </Button>
        </div>

        {/* Days List */}
        <div className="space-y-10 relative">
          <div className="absolute left-[20px] top-4 bottom-4 w-px bg-dashed border-l border-border/60 z-0" />
          
          {days.map((day, idx) => (
            <div key={day.id} className="relative z-10 group">
              <div className="flex gap-8">
                {/* Day Indicator */}
                <div className="shrink-0">
                   <div className="h-10 w-10 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-black shadow-glow group-hover:scale-110 transition-transform">
                      {day.dayNumber}
                   </div>
                </div>

                {/* Day Card */}
                <div className="flex-1 space-y-6">
                  <div className="glass-card p-0 overflow-hidden border-border/60 hover:border-primary/20 transition-colors shadow-elevated">
                    <div className="bg-surface-muted/50 px-6 py-4 border-b border-border/60 flex items-center justify-between">
                       <div className="flex flex-1 items-center gap-4">
                          <Input 
                            value={day.title} 
                            onChange={(e) => updateDay(day.id, 'title', e.target.value)}
                            className="bg-transparent border-none text-xl font-black focus-visible:ring-0 h-auto p-0 max-w-[300px]"
                            placeholder="Day Title..."
                          />
                          <div className="h-4 w-px bg-border/60 mx-2" />
                          <div className="flex items-center gap-2 text-muted-foreground">
                             <MapPin className="h-3.5 w-3.5" />
                             <Input 
                                value={day.base}
                                onChange={(e) => updateDay(day.id, 'base', e.target.value)}
                                className="bg-transparent border-none text-xs font-bold focus-visible:ring-0 h-auto p-0 max-w-[150px] uppercase tracking-wider"
                                placeholder="Base Location..."
                             />
                          </div>
                       </div>
                       <Button variant="ghost" onClick={() => removeDay(day.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive p-0">
                          <Trash2 className="h-4 w-4" />
                       </Button>
                    </div>

                    <div className="p-6 space-y-6">
                       {/* Stops List */}
                       <div className="space-y-4">
                          {day.stops.map((stop) => (
                            <div key={stop.id} className="flex flex-wrap items-center gap-4 p-4 rounded-2xl bg-surface/50 border border-border/40 group/stop">
                               <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                                  <MapPin className="h-4 w-4" />
                               </div>
                               <Input 
                                 value={stop.place}
                                 onChange={(e) => updateStop(day.id, stop.id, 'place', e.target.value)}
                                 className="flex-1 min-w-[150px] h-9 rounded-lg bg-background border-border/40 font-bold"
                                 placeholder="Place Name"
                               />
                               <Input 
                                 value={stop.activity}
                                 onChange={(e) => updateStop(day.id, stop.id, 'activity', e.target.value)}
                                 className="flex-[2] min-w-[200px] h-9 rounded-lg bg-background border-border/40"
                                 placeholder="What are you doing?"
                               />
                               <div className="flex items-center gap-2 bg-background border border-border/40 rounded-lg px-3 h-9">
                                  <Wallet className="h-3.5 w-3.5 text-primary" />
                                  <Input 
                                    type="number"
                                    value={stop.cost}
                                    onChange={(e) => updateStop(day.id, stop.id, 'cost', parseFloat(e.target.value) || 0)}
                                    className="w-16 border-none focus-visible:ring-0 h-auto p-0 text-sm font-black text-right"
                                  />
                                  <span className="text-[10px] font-bold text-muted-foreground">USD</span>
                               </div>
                               <Button 
                                 variant="ghost" 
                                 onClick={() => {
                                    setDays(days.map(d => d.id === day.id ? { ...d, stops: d.stops.filter(s => s.id !== stop.id) } : d))
                                 }} 
                                 className="h-8 w-8 opacity-0 group-hover/stop:opacity-100 text-muted-foreground hover:text-destructive p-0 transition-opacity"
                               >
                                  <Trash2 className="h-4 w-4" />
                               </Button>
                            </div>
                          ))}
                          <button 
                            onClick={() => addStop(day.id)}
                            className="w-full h-12 border-2 border-dashed border-border/60 rounded-2xl flex items-center justify-center gap-2 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all font-bold text-sm"
                          >
                             <Plus className="h-4 w-4" /> Add Activity
                          </button>
                       </div>

                       {/* Day Footer / Stay */}
                       <div className="pt-4 border-t border-border/40 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                             <div className="h-9 px-4 rounded-xl bg-surface-muted border border-border/40 flex items-center gap-2.5">
                                <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Night Stay Cost</span>
                                <Input 
                                  type="number"
                                  value={day.stayCost}
                                  onChange={(e) => updateDay(day.id, 'stayCost', parseFloat(e.target.value) || 0)}
                                  className="w-16 bg-transparent border-none focus-visible:ring-0 h-auto p-0 text-sm font-black text-right"
                                />
                                <span className="text-[10px] font-bold text-muted-foreground">USD</span>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] font-black uppercase text-primary tracking-widest mb-0.5">Day Total</p>
                             <div className="text-xl font-black text-foreground">
                                <Money usd={day.stayCost + day.stops.reduce((s, st) => s + st.cost, 0)} />
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Final CTA */}
        <div className="mt-20 py-20 border-t border-border/60 text-center space-y-8">
           <h2 className="font-display text-4xl font-black">Plan locked in?</h2>
           <p className="text-muted-foreground max-w-lg mx-auto">
             You've successfully mapped out {days.length} days of adventure. Save this to your profile to get real-time price alerts and weather updates.
           </p>
           <div className="flex justify-center gap-4">
              <Button size="lg" className="rounded-2xl h-14 px-10 bg-primary shadow-glow font-black text-lg gap-3">
                 <Save className="h-6 w-6" /> Save Final Draft
              </Button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Planner;
