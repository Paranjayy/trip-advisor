import { Plane, Navigation, Clock, MapPin, Radio, Activity } from "lucide-react";

type FlightRoute = {
  from: string;
  duration: string;
  freq: string;
};

const DATA: Record<string, FlightRoute[]> = {
  "thailand": [
    { from: "DEL", duration: "4h 15m", freq: "6 Daily" },
    { from: "LHR", duration: "11h 50m", freq: "3 Daily" },
    { from: "HND", duration: "6h 20m", freq: "8 Daily" },
  ],
  "india": [
    { from: "LHR", duration: "9h 30m", freq: "12 Daily" },
    { from: "DXB", duration: "3h 45m", freq: "45 Daily" },
    { from: "SIN", duration: "5h 15m", freq: "15 Daily" },
  ],
  "switzerland": [
    { from: "DEL", duration: "8h 45m", freq: "1 Daily" },
    { from: "JFK", duration: "7h 20m", freq: "5 Daily" },
    { from: "CDG", duration: "1h 10m", freq: "20 Daily" },
  ],
};

export function FlightIntelligence({ slug, flag }: { slug: string; flag: string }) {
  const routes = DATA[slug] || DATA["thailand"];

  return (
    <div className="glass-card p-5 border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden">
       <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Plane className="h-24 w-24 -rotate-45" />
       </div>

       <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center gap-2">
             <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
             <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-600">SkyLink Live Radar</h3>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
             <Radio className="h-3 w-3 text-emerald-600" />
             <span className="text-[9px] font-black text-emerald-600 uppercase">Tracking 42 Flights</span>
          </div>
       </div>

       {/* Mock Radar View */}
       <div className="relative h-32 w-full bg-background/40 rounded-xl border border-border/40 mb-6 overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 opacity-20">
             <svg className="h-full w-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
                <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
                <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
                <line x1="50" y1="5" x2="50" y2="95" stroke="currentColor" strokeWidth="0.2" />
                <line x1="5" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="0.2" />
             </svg>
          </div>
          <div className="relative flex items-center justify-center">
             <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
             <span className="absolute -top-4 text-[10px] font-black uppercase tracking-tighter">{flag} Approach</span>
             
             {/* Random plane markers */}
             <div className="absolute top-4 left-12 animate-pulse delay-75"><Navigation className="h-2 w-2 rotate-45 text-emerald-500" /></div>
             <div className="absolute bottom-6 right-16 animate-pulse delay-150"><Navigation className="h-2 w-2 rotate-[120deg] text-emerald-500" /></div>
             <div className="absolute top-10 right-4 animate-pulse delay-300"><Navigation className="h-2 w-2 rotate-[200deg] text-emerald-500" /></div>
          </div>
       </div>

       <div className="space-y-3 relative z-10">
          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1.5">
             <Clock className="h-3 w-3" /> Average Flight Times
          </p>
          {routes.map((r, i) => (
             <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-background/60 border border-border/40 hover:border-emerald-500/30 transition-all group">
                <div className="flex items-center gap-3">
                   <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs font-black">{r.from}</span>
                   </div>
                   <div className="h-px w-4 bg-border/60" />
                   <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-muted-foreground">{r.duration}</span>
                   </div>
                </div>
                <div className="text-[9px] font-black uppercase text-emerald-600 bg-emerald-500/5 px-2 py-0.5 rounded">
                   {r.freq}
                </div>
             </div>
          ))}
       </div>

       <div className="mt-4 pt-4 border-t border-border/60 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
             <Activity className="h-3 w-3 text-emerald-600" />
             <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">On-Time Performance: 94.2%</span>
          </div>
          <span className="text-[8px] font-black text-emerald-600 uppercase animate-pulse">Live</span>
       </div>
    </div>
  );
}
