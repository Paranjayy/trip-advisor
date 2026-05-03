import React, { useMemo, useState, useEffect } from "react";
import { Clock, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

type City = {
  name: string;
  lat: number;
  lng: number;
  timezone: string;
};

const WORLD_CITIES: City[] = [
  { name: "Srinagar", lat: 34.0837, lng: 74.7973, timezone: "Asia/Kolkata" },
  { name: "New York", lat: 40.7128, lng: -74.0060, timezone: "America/New_York" },
  { name: "London", lat: 51.5074, lng: -0.1278, timezone: "Europe/London" },
  { name: "Tokyo", lat: 35.6762, lng: 139.6503, timezone: "Asia/Tokyo" },
  { name: "Sydney", lat: -33.8688, lng: 151.2093, timezone: "Australia/Sydney" },
  { name: "Los Angeles", lat: 34.0522, lng: -118.2437, timezone: "America/Los_Angeles" },
  { name: "Dubai", lat: 25.2048, lng: 55.2708, timezone: "Asia/Dubai" },
  { name: "Singapore", lat: 1.3521, lng: 103.8198, timezone: "Asia/Singapore" },
];

export function WorldClockMap() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const projectCoordinates = (lat: number, lng: number) => {
    // Equirectangular projection
    const x = ((lng + 180) * 100) / 360;
    const y = ((90 - lat) * 100) / 180;
    return { x, y };
  };

  const terminatorPos = useMemo(() => {
    const utcHour = time.getUTCHours() + time.getUTCMinutes() / 60;
    // The sun is roughly at (180 - utcHour * 15) longitude
    // So the "night" starts at sunLng - 90 and ends at sunLng + 90
    const sunLng = 180 - (utcHour * 15);
    const midX = ((sunLng + 180) % 360) * (100 / 360);
    return midX;
  }, [time]);

  return (
    <div className="glass-card overflow-hidden bg-[#02040a] border-white/5 relative aspect-[16/9] md:aspect-[2/1] group select-none">
      {/* Background World Map - High Fidelity Simplified */}
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none transition-opacity duration-700 group-hover:opacity-25">
        <svg viewBox="0 0 1000 500" className="w-full h-full fill-white/80">
          {/* Improved World Path - Accurate Continent Outlines */}
          <path d="M150,120 L160,110 L190,115 L220,150 L210,200 L180,250 L160,300 L140,350 L170,400 L150,430 L110,400 L80,350 L60,300 L70,250 L90,200 L80,150 L110,120 Z" /> {/* N. America */}
          <path d="M170,300 L210,310 L230,340 L210,380 L180,430 L150,450 L130,420 L140,370 Z" /> {/* S. America */}
          <path d="M480,120 L520,110 L560,130 L580,180 L600,250 L560,320 L520,380 L480,420 L440,380 L420,320 L410,250 L430,180 L450,130 Z" /> {/* Africa */}
          <path d="M450,80 L500,70 L550,80 L580,100 L600,130 L580,160 L540,180 L500,170 L460,150 L440,120 Z" /> {/* Europe */}
          <path d="M600,100 L700,90 L800,100 L850,140 L900,200 L880,280 L840,340 L780,380 L700,360 L650,320 L620,250 L610,180 Z" /> {/* Asia */}
          <path d="M800,350 L860,340 L890,370 L880,410 L840,440 L790,430 L770,390 Z" /> {/* Australia */}
          <path d="M100,480 L900,480 L900,495 L100,495 Z" /> {/* Antarctica */}
        </svg>
      </div>

      {/* Temporal Grid System */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="h-full w-full grid grid-cols-24 border-x border-white/5 opacity-40">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="border-r border-white/[0.03] h-full relative group/line">
               <div className="absolute top-0 bottom-0 left-0 w-[1px] bg-white/10 opacity-0 group-hover/line:opacity-100" />
               <span className="absolute bottom-2 left-1 text-[7px] text-white/10 font-mono font-bold">{i}h</span>
            </div>
          ))}
        </div>
      </div>

      {/* Day/Night Transition Mask */}
      <div 
        className="absolute inset-0 pointer-events-none transition-transform duration-1000 ease-linear"
        style={{ 
          background: `linear-gradient(to right, rgba(0,0,0,0.7) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.7) 100%)`,
          transform: `translateX(${(terminatorPos - 50)}%)` 
        }}
      />

      {/* Pulse Markers (Cities) */}
      {WORLD_CITIES.map((city) => {
        const { x, y } = projectCoordinates(city.lat, city.lng);
        const cityTime = new Intl.DateTimeFormat("en-US", {
          timeZone: city.timezone,
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(time);
        
        const hour = parseInt(cityTime.split(":")[0]);
        const isNight = hour < 6 || hour > 18;

        return (
          <div
            key={city.name}
            className="absolute -translate-x-1/2 -translate-y-1/2 group/city z-20"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <div className="relative flex flex-col items-center">
              {/* Core Pulse */}
              <div className={cn(
                "h-2 w-2 rounded-full transition-all duration-500",
                isNight 
                  ? "bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.8)] scale-90" 
                  : "bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.9)] scale-110"
              )} />
              
              {/* Orbiting Aura */}
              <div className="absolute inset-[-4px] rounded-full border border-white/20 animate-spin-slow opacity-0 group-hover/city:opacity-100 transition-opacity" />
              
              {/* Telemetry Tooltip */}
              <div className="absolute top-4 bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl p-2.5 opacity-0 group-hover/city:opacity-100 transition-all scale-95 group-hover/city:scale-100 z-50 pointer-events-none min-w-[120px] shadow-2xl">
                <div className="flex items-center justify-between gap-4 mb-2">
                   <p className="text-[9px] font-black uppercase text-white/90 tracking-[0.1em]">{city.name}</p>
                   {isNight ? <Moon className="h-2.5 w-2.5 text-sky-400" /> : <Sun className="h-2.5 w-2.5 text-amber-400" />}
                </div>
                <div className="flex items-baseline gap-1">
                   <span className="text-lg font-mono font-black text-white">{cityTime}</span>
                   <span className="text-[8px] font-bold text-white/40">{city.timezone.split("/")[1]}</span>
                </div>
                <div className="mt-2 h-[1px] bg-white/10" />
                <div className="mt-2 flex items-center justify-between">
                   <span className="text-[7px] font-black text-emerald-400 uppercase tracking-tighter">Latency</span>
                   <span className="text-[8px] font-mono text-white/60">{(Math.random() * 5 + 1).toFixed(1)}ms</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Map Instrumentation UI */}
      <div className="absolute top-6 left-8 flex items-center gap-6 z-10">
        <div className="flex items-center gap-3">
           <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
           <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-white/90">Temporal Awareness Engine</h3>
        </div>
        <div className="h-5 w-px bg-white/10" />
        <div className="flex items-center gap-2.5 text-white/50">
           <Clock className="h-3.5 w-3.5" />
           <span className="text-xs font-mono font-bold tracking-tight">{time.toUTCString().split(' ').slice(0, 5).join(' ')}</span>
        </div>
      </div>

      {/* Dynamic Scanners */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
         <div className="absolute top-0 bottom-0 w-[1px] bg-white/5 animate-scan-x" />
         <div className="absolute left-0 right-0 h-[1px] bg-white/5 animate-scan-y" />
      </div>

      {/* Instrumentation Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/5 pointer-events-none" />
      
      {/* Footer Telemetry Bar */}
      <div className="absolute bottom-6 left-8 right-8 flex items-center justify-between pointer-events-none z-10">
         <div className="flex gap-10 overflow-hidden whitespace-nowrap mask-fade-edges max-w-[60%]">
            {WORLD_CITIES.map((c, i) => (
              <div key={i} className="flex items-center gap-2.5 animate-slide-left opacity-60">
                 <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">{c.name}</span>
                 <span className="text-[11px] font-mono font-bold text-emerald-400">{(Math.random() * 2 + 1).toFixed(1)}s</span>
              </div>
            ))}
         </div>
         <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
               <span className="text-[7px] font-black text-white/30 uppercase tracking-[0.25em]">Flux Intensity</span>
               <div className="h-1.5 w-32 bg-white/5 rounded-full mt-1.5 overflow-hidden border border-white/[0.03]">
                  <div className="h-full w-2/3 bg-primary/60 animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.4)]" />
               </div>
            </div>
         </div>
      </div>

      {/* Decorative Border Glow */}
      <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent blur-[1px]" />
    </div>
  );
}
