import React, { createContext, useContext, useState, useEffect } from "react";
import { Itinerary } from "@/lib/itineraries";

const STORAGE_KEY = "ta-custom-itineraries";

type CustomItinerariesContextType = {
  customs: Itinerary[];
  saveCustom: (itinerary: Itinerary) => void;
  deleteCustom: (slug: string) => void;
  getCustom: (slug: string) => Itinerary | undefined;
};

const CustomItinerariesContext = createContext<CustomItinerariesContextType | undefined>(undefined);

export function CustomItineraryProvider({ children }: { children: React.ReactNode }) {
  const [customs, setCustoms] = useState<Itinerary[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customs));
  }, [customs]);

  const saveCustom = (itinerary: Itinerary) => {
    setCustoms((prev) => {
      const idx = prev.findIndex((c) => c.slug === itinerary.slug);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = itinerary;
        return next;
      }
      return [...prev, itinerary];
    });
  };

  const deleteCustom = (slug: string) => {
    setCustoms((prev) => prev.filter((c) => c.slug !== slug));
  };

  const getCustom = (slug: string) => {
    return customs.find((c) => c.slug === slug);
  };

  return (
    <CustomItinerariesContext.Provider value={{ customs, saveCustom, deleteCustom, getCustom }}>
      {children}
    </CustomItinerariesContext.Provider>
  );
}

export function useCustomItineraries() {
  const context = useContext(CustomItinerariesContext);
  if (!context) {
    throw new Error("useCustomItineraries must be used within a CustomItineraryProvider");
  }
  return context;
}
