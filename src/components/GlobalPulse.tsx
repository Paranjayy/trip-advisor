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
    <div className="flex-1 relative overflow-hidden h-4">
      <motion.div
        animate={{ y: [0, -16, -32, -48, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className="flex flex-col gap-0"
      >
        {[...PULSES, PULSES[0]].map((p, i) => (
          <div key={i} className="flex items-center gap-2 h-4">
             {p.icon}
             <span className="text-[10px] font-black text-muted-foreground whitespace-nowrap uppercase tracking-wider">{p.text}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
