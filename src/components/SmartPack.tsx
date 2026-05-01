import { Luggage, Check, Plus, Wind, Sun, Snowflake, Mountain, Waves } from "lucide-react";
import { Terrain } from "@/lib/terrains";
import { getWeather } from "@/lib/weather";

type PackItem = {
  item: string;
  reason: string;
  icon: any;
};

export function SmartPack({ terrains, slug }: { terrains: Terrain[]; slug: string }) {
  const month = new Date().getMonth() + 1;
  const weather = getWeather(slug, month);

  const getPackingList = (): PackItem[] => {
    const list: PackItem[] = [
      { item: "Universal Adapter", reason: "Standard global essential", icon: Plus },
      { item: "Power Bank", icon: Plus, reason: "For long travel days" }
    ];

    if (weather.tempLow < 10) {
      list.push({ item: "Thermal Layers", reason: `Expect lows of ${weather.tempLow}°C`, icon: Snowflake });
    }
    if (weather.tempHigh > 25) {
      list.push({ item: "Breathable Cotton", reason: `Highs of ${weather.tempHigh}°C`, icon: Sun });
    }
    if (weather.rainDays > 8) {
      list.push({ item: "Compact Umbrella", reason: `${weather.rainDays} rain days expected`, icon: Wind });
    }
    if (terrains.includes("mountains")) {
      list.push({ item: "Hiking Boots", reason: "Ankle support for trails", icon: Mountain });
    }
    if (terrains.includes("beaches") || terrains.includes("islands")) {
      list.push({ item: "Quick-dry Towel", reason: "Beach & island hopping", icon: Waves });
    }

    return list;
  };

  const list = getPackingList();

  return (
    <div className="glass-card p-5 border-primary/20 bg-primary/5">
       <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
             <Luggage className="h-5 w-5 text-primary" />
          </div>
          <div>
             <h3 className="font-display font-bold leading-none text-sm">SmartPack™ Generator</h3>
             <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-widest font-black">AI-Curated Essentials</p>
          </div>
       </div>

       <div className="space-y-3">
          {list.map((p, i) => {
            const Icon = p.icon;
            return (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-background/50 border border-border/40 group hover:border-primary/40 transition-all">
                 <div className="h-8 w-8 rounded-lg bg-surface flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                 </div>
                 <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate">{p.item}</p>
                    <p className="text-[9px] text-muted-foreground truncate">{p.reason}</p>
                 </div>
                 <div className="h-5 w-5 rounded-full border border-border/60 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
                    <Check className="h-3 w-3 text-transparent group-hover:text-primary-foreground transition-colors" />
                 </div>
              </div>
            );
          })}
       </div>
       
       <div className="mt-6 pt-4 border-t border-border/60 text-[9px] text-center text-muted-foreground font-medium uppercase tracking-tighter italic">
          Optimized for {new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date())} weather
       </div>
    </div>
  );
}
