import React, { createContext, useContext, useState, useEffect, useRef } from "react";

type VibeType = "rain" | "waves" | "cafe" | "zen" | null;

interface VibeContextType {
  activeVibe: VibeType;
  isPlaying: boolean;
  setVibe: (v: VibeType) => void;
  setIsPlaying: (p: boolean) => void;
}

const VibeContext = createContext<VibeContextType | undefined>(undefined);

const VIBE_URLS: Record<string, string> = {
  rain: "https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg",
  waves: "https://actions.google.com/sounds/v1/water/waves_crashing_on_rock.ogg",
  cafe: "https://actions.google.com/sounds/v1/crowds/city_market.ogg",
  zen: "https://actions.google.com/sounds/v1/ambient/nature_atmosphere.ogg",
};

export function VibeProvider({ children }: { children: React.ReactNode }) {
  const [activeVibe, setActiveVibe] = useState<VibeType>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
    }

    if (activeVibe && isPlaying) {
      const url = VIBE_URLS[activeVibe];
      if (audioRef.current.src !== url) {
        audioRef.current.src = url;
      }
      audioRef.current.play().catch(e => console.error("Autoplay blocked", e));
    } else {
      audioRef.current.pause();
    }
  }, [activeVibe, isPlaying]);

  return (
    <VibeContext.Provider value={{ activeVibe, isPlaying, setVibe: setActiveVibe, setIsPlaying }}>
      {children}
    </VibeContext.Provider>
  );
}

export function useVibe() {
  const context = useContext(VibeContext);
  if (!context) throw new Error("useVibe must be used within VibeProvider");
  return context;
}
