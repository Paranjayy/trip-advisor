import { useState, useEffect } from "react";
import { Music, Volume2, VolumeX, Wind, Waves, Coffee, Ghost } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const VIBES = [
  { id: "rain", label: "Kyoto Rain", icon: Wind, color: "text-blue-400" },
  { id: "waves", label: "Phi Phi Waves", icon: Waves, color: "text-cyan-400" },
  { id: "cafe", label: "Parisian Café", icon: Coffee, color: "text-orange-400" },
  { id: "zen", label: "Zen Garden", icon: Ghost, color: "text-purple-400" },
];

export function VibePlayer() {
  const [active, setActive] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

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
      <div className="glass-card p-2 flex flex-col gap-2 shadow-glow border-primary/20 bg-background/40 backdrop-blur-xl">
        <div className="flex items-center justify-between px-2 py-1 mb-1">
          <div className="flex items-center gap-2">
             <Music className={cn("h-4 w-4 text-primary", isPlaying && "animate-pulse")} />
             <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Ambient Vibe</span>
          </div>
          <button onClick={() => setIsPlaying(!isPlaying)} className="text-muted-foreground hover:text-primary transition-colors">
            {isPlaying ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
          </button>
        </div>
        
        <div className="flex gap-1">
          {VIBES.map((vibe) => {
            const Icon = vibe.icon;
            const isVibeActive = active === vibe.id && isPlaying;
            return (
              <button
                key={vibe.id}
                onClick={() => toggleVibe(vibe.id)}
                title={vibe.label}
                className={cn(
                  "h-10 w-10 rounded-xl flex items-center justify-center transition-all border border-transparent",
                  isVibeActive 
                    ? "bg-primary text-primary-foreground shadow-glow scale-110" 
                    : "hover:bg-surface-muted text-muted-foreground"
                )}
              >
                <Icon className={cn("h-5 w-5", isVibeActive ? "animate-spin-slow" : vibe.color)} />
              </button>
            );
          })}
        </div>
        
        {active && (
          <div className="px-2 pt-1 pb-1">
             <p className="text-[9px] font-bold text-primary animate-in fade-in slide-in-from-bottom-1">
               Now playing: {VIBES.find(v => v.id === active)?.label}
             </p>
          </div>
        )}
      </div>
    </div>
  );
}
