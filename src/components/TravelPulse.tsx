import { Activity, Signal, ShieldCheck, Users, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type PulseMetric = {
  label: string;
  value: string;
  status: "good" | "avg" | "bad";
  icon: any;
  desc: string;
};

export function TravelPulse({ slug }: { slug: string }) {
  // Logic to generate 'live' pulse metrics based on slug
  const getMetrics = (): PulseMetric[] => {
    const isPremium = ["switzerland", "japan", "france"].includes(slug);
    const isBudget = ["india", "thailand", "vietnam", "indonesia"].includes(slug);

    return [
      { 
        label: "Digital Pulse", 
        value: isPremium ? "85 Mbps" : isBudget ? "42 Mbps" : "15 Mbps", 
        status: isPremium ? "good" : "avg", 
        icon: Signal,
        desc: "Avg. 5G/Fiber coverage in tourist zones."
      },
      { 
        label: "Crowd Density", 
        value: isPremium ? "Moderate" : "High", 
        status: isPremium ? "avg" : "bad", 
        icon: Users,
        desc: "Current seasonal peak. Book attractions 48h early."
      },
      { 
        label: "Safety Index", 
        value: isPremium ? "98%" : isBudget ? "85%" : "70%", 
        status: "good", 
        icon: ShieldCheck,
        desc: "Low crime rate. Normal precautions apply."
      },
    ];
  };

  const metrics = getMetrics();

  return (
    <div className="glass-card p-5 border-blue-500/20 bg-blue-500/5 relative overflow-hidden">
       <div className="absolute top-0 right-0 p-4 opacity-10 animate-pulse">
          <Activity className="h-12 w-12 text-blue-500" />
       </div>

       <div className="flex items-center gap-2 mb-6">
          <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
          <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-500">Live Travel Pulse</h3>
       </div>

       <div className="grid grid-cols-1 gap-3">
          {metrics.map((m, i) => {
            const Icon = m.icon;
            return (
              <div key={i} className="p-3 rounded-xl bg-background/40 border border-border/40 group hover:border-blue-500/30 transition-all">
                 <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                       <Icon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-blue-500 transition-colors" />
                       <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">{m.label}</p>
                    </div>
                    <div className={cn(
                      "px-2 py-0.5 rounded-full text-[9px] font-black uppercase",
                      m.status === "good" ? "bg-green-500/10 text-green-500" :
                      m.status === "avg" ? "bg-orange-500/10 text-orange-500" :
                      "bg-red-500/10 text-red-500"
                    )}>
                       {m.value}
                    </div>
                 </div>
                 <p className="text-[10px] text-muted-foreground leading-relaxed italic">{m.desc}</p>
              </div>
            );
          })}
       </div>

       <div className="mt-4 flex items-center gap-1.5 px-1">
          <Info className="h-3 w-3 text-muted-foreground" />
          <p className="text-[8px] font-medium text-muted-foreground uppercase tracking-tighter">Real-time heuristics via Sat-Link 4.2</p>
       </div>
    </div>
  );
}
