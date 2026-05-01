import { Cloud, Sun, CloudRain, Snowflake, Thermometer } from "lucide-react";
import { MONTHS } from "@/data/countries";
import { getWeather } from "@/lib/weather";
import { cn } from "@/lib/utils";

const CONDITION_ICON = {
  sunny: Sun,
  rainy: CloudRain,
  snowy: Snowflake,
  cloudy: Cloud,
  humid: CloudRain,
};

export function WeatherChart({ slug }: { slug: string }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
         <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
           <Thermometer className="h-3 w-3" /> 12-Month Climate DNA
         </h3>
         <div className="flex gap-4 text-[10px] font-bold">
            <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-primary" /> Temp High</div>
            <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-blue-400" /> Temp Low</div>
         </div>
      </div>
      
      <div className="grid grid-cols-12 gap-1 h-32 items-end">
        {MONTHS.map((m, i) => {
          const w = getWeather(slug, i + 1);
          const Icon = CONDITION_ICON[w.condition];
          const highHeight = Math.max(20, Math.min(100, (w.tempHigh + 10) * 2));
          const lowHeight = Math.max(10, Math.min(highHeight - 5, (w.tempLow + 10) * 2));
          
          return (
            <div key={m} className="flex flex-col items-center gap-2 h-full group relative">
              <div className="flex-1 w-full flex items-end justify-center gap-0.5 px-0.5">
                 <div 
                   className="w-full bg-primary/20 rounded-t-sm group-hover:bg-primary/40 transition-colors relative"
                   style={{ height: `${highHeight}%` }}
                 >
                    <div 
                      className="absolute bottom-0 left-0 w-full bg-blue-400/40 rounded-t-sm"
                      style={{ height: `${(lowHeight / highHeight) * 100}%` }}
                    />
                 </div>
              </div>
              <div className="text-center">
                 <Icon className="h-3 w-3 mx-auto text-muted-foreground group-hover:text-primary transition-colors" />
                 <span className="text-[8px] font-black uppercase tracking-tighter text-muted-foreground">{m.slice(0, 1)}</span>
              </div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-popover text-popover-foreground border border-border px-2 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap shadow-xl">
                 <p className="text-[10px] font-black border-b border-border mb-1 pb-1">{m}</p>
                 <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[9px]">
                    <span className="text-muted-foreground">High:</span> <span className="font-bold text-primary">{w.tempHigh}°C</span>
                    <span className="text-muted-foreground">Low:</span> <span className="font-bold text-blue-400">{w.tempLow}°C</span>
                    <span className="text-muted-foreground">Rain:</span> <span className="font-bold">{w.rainDays} days</span>
                    <span className="text-muted-foreground">Vibe:</span> <span className="font-bold capitalize">{w.condition}</span>
                 </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
