import { useState, useRef, useEffect } from "react";
import { Headphones, Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function AmbientPulse() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // A high-quality stable ambient track with cache buster
  const ambientUrl = `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3?v=${Date.now()}`;

  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio(ambientUrl);
      audio.loop = true;
      audio.volume = 0.3; // Ambient, low volume
      audioRef.current = audio;
    }

    if (isPlaying) {
      audioRef.current.play().catch(e => console.log("Audio play blocked:", e));
    } else {
      audioRef.current.pause();
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [isPlaying]);

  return (
    <div className="relative flex items-center">
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className={cn(
          "h-7 px-2.5 rounded-lg flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest transition-all",
          isPlaying 
            ? "bg-primary text-white shadow-glow shadow-primary/20" 
            : "text-muted-foreground hover:text-primary hover:bg-primary/5"
        )}
        title="Toggle Ambient Audio"
      >
        {isPlaying ? (
          <>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
               <Headphones className="h-3 w-3 fill-current" />
            </motion.div>
            <span className="hidden sm:inline">Playing</span>
            <Volume2 className="h-3 w-3 ml-0.5" />
          </>
        ) : (
          <>
            <Headphones className="h-3 w-3" />
            <span className="hidden sm:inline">Ambient</span>
            <VolumeX className="h-3 w-3 ml-0.5 opacity-50" />
          </>
        )}
      </button>

      {/* Visualizer when playing */}
      {isPlaying && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-end gap-0.5 h-1.5">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="w-[2px] bg-primary rounded-full"
              animate={{ height: ["20%", "100%", "20%"] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.1,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
