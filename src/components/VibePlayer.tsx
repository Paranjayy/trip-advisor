import { useState, useEffect, useRef } from "react";
import { Music, Volume2, VolumeX, Wind, Waves, Coffee, Ghost, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const VIBES = [
  { 
    id: "rain", label: "Kyoto Rain", icon: Wind, color: "text-blue-400", 
    url: "https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg" 
  },
  { 
    id: "waves", label: "Phi Phi Waves", icon: Waves, color: "text-cyan-400",
    url: "https://actions.google.com/sounds/v1/water/waves_crashing_on_rock.ogg"
  },
  { 
    id: "cafe", label: "Parisian Café", icon: Coffee, color: "text-orange-400",
    url: "https://actions.google.com/sounds/v1/crowds/city_market.ogg"
  },
  { 
    id: "zen", label: "Zen Garden", icon: Ghost, color: "text-purple-400",
    url: "https://actions.google.com/sounds/v1/ambient/nature_atmosphere.ogg"
  },
];

export function VibePlayer() {
  const [active, setActive] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
    }

    const currentVibe = VIBES.find(v => v.id === active);
    if (currentVibe && isPlaying) {
      if (audioRef.current.src !== currentVibe.url) {
        audioRef.current.src = currentVibe.url;
      }
      audioRef.current.play().catch(e => console.error("Autoplay blocked", e));
    } else {
      audioRef.current.pause();
    }
  }, [active, isPlaying]);

  const toggleVibe = (id: string) => {
    if (active === id) {
      setIsPlaying(!isPlaying);
    } else {
      setActive(id);
      setIsPlaying(true);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 group">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-card p-2.5 flex flex-col gap-3 shadow-elevated border-primary/20 bg-background/60 backdrop-blur-2xl rounded-3xl"
      >
        <div className="flex items-center justify-between px-2 py-1">
          <div className="flex items-center gap-2.5">
             <div className={cn("h-2 w-2 rounded-full", isPlaying ? "bg-primary animate-pulse" : "bg-muted-foreground")} />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">Ambient Pulse</span>
          </div>
          <button 
            onClick={() => setIsPlaying(!isPlaying)} 
            className="h-7 w-7 rounded-full flex items-center justify-center bg-surface-muted/50 text-muted-foreground hover:text-primary transition-all"
          >
            {isPlaying ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>
        </div>
        
        <div className="flex gap-2">
          {VIBES.map((vibe) => {
            const Icon = vibe.icon;
            const isVibeActive = active === vibe.id && isPlaying;
            return (
              <button
                key={vibe.id}
                onClick={() => toggleVibe(vibe.id)}
                title={vibe.label}
                className={cn(
                  "h-12 w-12 rounded-2xl flex items-center justify-center transition-all border shadow-sm",
                  isVibeActive 
                    ? "bg-primary text-white border-primary shadow-glow scale-110 z-10" 
                    : "bg-surface-muted/50 border-border/40 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                )}
              >
                <Icon className={cn("h-6 w-6", isVibeActive ? "animate-pulse" : vibe.color)} />
              </button>
            );
          })}
        </div>
        
        <AnimatePresence>
          {active && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-2 overflow-hidden"
            >
               <p className="text-[9px] font-black text-primary uppercase tracking-widest flex items-center gap-2 pb-1">
                 <Zap className="h-3 w-3" /> STREAMING: {VIBES.find(v => v.id === active)?.label}
               </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
