import React, { useMemo, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Globe2, Crosshair, Zap, Activity, Radio, ShieldCheck } from "lucide-react";
import { useUserSettings } from "@/lib/user-settings";
import { getVisaStatus } from "@/lib/passport";

const CITIES = [
  { name: "Srinagar", slug: "india", lat: 34.0837, lng: 74.7973, pulse: 2.8, color: "text-primary" },
  { name: "Tokyo", slug: "japan", lat: 35.6762, lng: 139.6503, pulse: 4.2, color: "text-accent" },
  { name: "New York", slug: "usa", lat: 40.7128, lng: -74.0060, pulse: 1.5, color: "text-emerald-400" },
  { name: "London", slug: "uk", lat: 51.5074, lng: -0.1278, pulse: 2.1, color: "text-blue-400" },
  { name: "Dubai", slug: "uae", lat: 25.2048, lng: 55.2708, pulse: 3.5, color: "text-orange-400" },
  { name: "Reykjavik", slug: "iceland", lat: 64.1466, lng: -21.9426, pulse: 0.8, color: "text-purple-400" },
];

export function CyberGlobe() {
  const { citizenship } = useUserSettings();
  const [time, setTime] = useState(new Date());
  const [hoveredCity, setHoveredCity] = useState<typeof CITIES[0] | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Simple projection: lat -90..90 -> y 450..50, lng -180..180 -> x 50..750
  const points = useMemo(() => {
    return CITIES.map(c => ({
      ...c,
      x: ((c.lng + 180) / 360) * 700 + 50,
      y: (1 - (c.lat + 90) / 180) * 400 + 50,
    }));
  }, []);

  return (
    <div className="relative w-full aspect-[16/9] lg:aspect-[21/9] glass-card overflow-hidden group shadow-2xl border-primary/20">
      {/* Background Grid & Radar Scans */}
      <div className="absolute inset-0 bg-[#0a0a0c]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(var(--primary),0.15)_0%,_transparent_70%)]" />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        {/* Radar Scanning Line */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent w-[20%] animate-scan-x opacity-30" />
      </div>

      <div className="absolute top-6 left-8 flex items-center gap-3 z-20">
        <div className="h-10 w-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center shadow-glow-sm">
          <Globe2 className="h-5 w-5 text-primary animate-spin-slow" />
        </div>
        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary/80">Discovery Pulse Engine</h3>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase">{time.toLocaleTimeString()}</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 right-8 text-right z-20 hidden sm:block">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Signal Intensity</p>
        <div className="flex gap-1 items-end h-8">
           {[...Array(12)].map((_, i) => (
             <div 
               key={i} 
               className="w-1 bg-primary/40 rounded-full transition-all duration-300"
               style={{ height: `${Math.random() * 100}%`, animation: `pulse 2s infinite ${i * 0.1}s` }}
             />
           ))}
        </div>
      </div>

      <svg viewBox="0 0 800 500" className="absolute inset-0 w-full h-full p-12 opacity-80">
        {/* World Map Paths (Simplified but "Pro" look) */}
        <g className="fill-surface-muted/30 stroke-primary/10 stroke-[0.5] transition-all duration-700">
          <path d="M160,110 L180,100 L210,110 L230,140 L220,180 L200,220 L160,250 L140,280 L130,310 L150,340 L180,360 L170,390 L140,410 L110,390 L90,360 L70,320 L60,280 L70,240 L90,210 L80,180 L100,150 L130,130 Z" />
          <path d="M450,120 L480,110 L510,120 L530,150 L520,190 L500,230 L460,260 L440,290 L430,320 L450,350 L480,370 L470,400 L440,420 L410,400 L390,370 L370,330 L360,290 L370,250 L390,220 L380,190 L400,160 L430,140 Z" />
          <path d="M600,150 L630,140 L660,150 L680,180 L670,220 L650,260 L610,290 L590,320 L580,350 L600,380 L630,400 L620,430 L590,450 L560,430 L540,400 L520,360 L510,320 L520,280 L540,250 L530,220 L550,190 L580,170 Z" />
        </g>

        {/* Connections */}
        {points.map((p, i) => points.slice(i + 1).map((p2, j) => (
           <line 
             key={`${i}-${j}`} 
             x1={p.x} y1={p.y} x2={p2.x} y2={p2.y} 
             className="stroke-primary/5 stroke-[0.5]" 
             strokeDasharray="4,8"
           />
        )))}

        {/* Pulse Markers */}
        {points.map(p => (
          <g 
            key={p.name} 
            className="cursor-pointer group/marker"
            onMouseEnter={() => setHoveredCity(p)}
            onMouseLeave={() => setHoveredCity(null)}
          >
            {/* Outer Glow Circles */}
            <circle cx={p.x} cy={p.y} r="8" className="fill-primary/20 animate-ping opacity-30" />
            <circle cx={p.x} cy={p.y} r="4" className={cn("fill-primary shadow-glow", hoveredCity?.name === p.name && "r-6 transition-all")} />
            
            {/* City Data Overlay */}
            {hoveredCity?.name === p.name && (
              <g className="transition-all duration-300">
                <rect x={p.x + 10} y={p.y - 65} width="120" height="60" rx="12" className="fill-background/95 stroke-primary/30 stroke-[1] shadow-elevated" />
                <text x={p.x + 22} y={p.y - 45} className="fill-foreground text-[10px] font-black uppercase tracking-tighter">{p.name}</text>
                
                {/* Visa Status Cue */}
                <g transform={`translate(${p.x + 22}, ${p.y - 32})`}>
                   <text className="fill-muted-foreground text-[8px] font-bold uppercase tracking-widest">Visa Status</text>
                   <text y="12" className={cn(
                     "text-[9px] font-black uppercase",
                     getVisaStatus(citizenship, p.slug).status === "visa-free" ? "fill-emerald-500" : 
                     getVisaStatus(citizenship, p.slug).status === "visa-required" ? "fill-red-500" : "fill-accent"
                   )}>
                     {getVisaStatus(citizenship, p.slug).status.replace("-", " ")}
                   </text>
                </g>

                <text x={p.x + 22} y={p.y - 12} className="fill-primary/60 text-[8px] font-bold uppercase tracking-widest">{p.pulse}s signal</text>
              </g>
            )}
          </g>
        ))}
      </svg>

      {/* Floating UI Elements */}
      <div className="absolute top-1/2 left-8 -translate-y-1/2 space-y-4 z-20">
         <div className="glass-card p-3 border-emerald-500/20 bg-emerald-500/5 backdrop-blur-xl animate-float">
            <div className="flex items-center gap-2 mb-1">
               <Radio className="h-3 w-3 text-emerald-500 animate-pulse" />
               <span className="text-[8px] font-black uppercase text-emerald-600 tracking-widest">Live Feed</span>
            </div>
            <p className="text-[10px] font-bold text-foreground">Trending: #Kashmir Lineage</p>
         </div>
         <div className="glass-card p-3 border-accent/20 bg-accent/5 backdrop-blur-xl animate-float-delayed">
            <div className="flex items-center gap-2 mb-1">
               <Activity className="h-3 w-3 text-accent animate-pulse" />
               <span className="text-[8px] font-black uppercase text-accent tracking-widest">Discovery rate</span>
            </div>
            <p className="text-[10px] font-bold text-foreground">372 New Itineraries</p>
         </div>
      </div>

      {/* Corner Instrumentation */}
      <div className="absolute bottom-6 left-8 flex gap-8 z-20">
         <div className="space-y-1">
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Coordinates</p>
            <p className="text-xs font-mono font-bold text-foreground">34.08N / 74.79E</p>
         </div>
         <div className="space-y-1">
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Status</p>
            <p className="text-xs font-mono font-bold text-emerald-500 uppercase tracking-tighter flex items-center gap-1.5">
               <span className="h-1 w-1 rounded-full bg-emerald-500" />
               Synchronized
            </p>
         </div>
      </div>

      {/* Aesthetic Border Overlays */}
      <div className="absolute inset-0 border-[16px] border-background pointer-events-none opacity-20" />
      <div className="absolute inset-4 border border-primary/10 rounded-2xl pointer-events-none" />
    </div>
  );
}
