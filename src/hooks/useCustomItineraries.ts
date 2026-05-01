import { useState, useEffect } from "react";
import { Itinerary } from "@/lib/itineraries";

const STORAGE_KEY = "ta-custom-itineraries";

export function useCustomItineraries() {
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

  return { customs, saveCustom, deleteCustom, getCustom };
}
