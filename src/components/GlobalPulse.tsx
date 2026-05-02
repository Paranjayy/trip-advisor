import React from "react";
import { motion } from "framer-motion";
import { Zap, Globe, TrendingUp, ShieldCheck } from "lucide-react";

const PULSES = [
  { icon: <TrendingUp className="h-3 w-3 text-emerald-500" />, text: "🔥 Kyoto is trending (12k searches today)" },
  { icon: <Zap className="h-3 w-3 text-primary" />, text: "⚡️ Instant eVisa now available for Vietnam" },
  { icon: <ShieldCheck className="h-3 w-3 text-accent" />, text: "🛡️ Kashmir Lidder valley is in peak recovery mode" },
  { icon: <Globe className="h-3 w-3 text-blue-500" />, text: "🌍 62 Countries are currently Visa-Free for you" },
];

export function GlobalPulse() {
  return (
    <div className="bg-primary/5 border-y border-primary/10 overflow-hidden h-9 flex items-center">
      <div className="container mx-auto flex items-center justify-between px-4 overflow-hidden relative">
        <div className="flex items-center gap-2 shrink-0 bg-background/50 backdrop-blur-md z-10 pr-4">
           <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse shadow-glow" />
           <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Global Pulse</span>
        </div>
        
        <div className="flex-1 relative overflow-hidden h-4 ml-4">
          <motion.div
            animate={{ y: [0, -16, -32, -48, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="flex flex-col gap-0"
          >
            {[...PULSES, PULSES[0]].map((p, i) => (
              <div key={i} className="flex items-center gap-2 h-4">
                 {p.icon}
                 <span className="text-[10px] font-bold text-muted-foreground whitespace-nowrap">{p.text}</span>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="hidden md:flex items-center gap-4 shrink-0 pl-4 bg-background/50 backdrop-blur-md z-10">
           <span className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-widest">Latency: 24ms</span>
           <span className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-widest">Nodes: 14/14</span>
        </div>
      </div>
    </div>
  );
}
