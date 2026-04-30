import { useState } from "react";
import { X, Clock, MapPin, Ruler, ChevronDown, ChevronUp, Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TerrainChips } from "@/components/TerrainChips";
import { Money } from "@/components/Money";
import { type LocalTrip } from "@/lib/localTrips";
import { cn } from "@/lib/utils";

interface Props {
  trip: LocalTrip;
  onClose: () => void;
}

export function ItineraryDrawer({ trip, onClose }: Props) {
  const [expanded, setExpanded] = useState<Set<number>>(new Set([1]));

  const toggle = (day: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(day) ? next.delete(day) : next.add(day);
      return next;
    });
  };

  const expandAll = () => setExpanded(new Set(trip.itinerary?.map((d) => d.day) ?? []));
  const collapseAll = () => setExpanded(new Set());

  const totalKm = trip.itinerary?.reduce((s, d) => s + (d.distanceKm ?? 0), 0) ?? 0;
  const totalHours = trip.itinerary?.reduce((s, d) => s + (d.durationHours ?? 0), 0) ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-background border border-border rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[92vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-border/60 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Route className="h-5 w-5 text-primary" />
              <h2 className="font-display text-xl font-bold">{trip.name}</h2>
            </div>
            <p className="text-sm text-muted-foreground">{trip.region} · {trip.vibe} · {trip.days} days</p>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
              {totalKm > 0 && (
                <span className="inline-flex items-center gap-1">
                  <Ruler className="h-3 w-3 text-primary" />
                  <span className="font-semibold text-foreground">{totalKm} km</span> total travel
                </span>
              )}
              {totalHours > 0 && (
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3 text-primary" />
                  <span className="font-semibold text-foreground">{totalHours}h</span> activity time
                </span>
              )}
              <span className="inline-flex items-center gap-1 font-semibold text-primary">
                <Money usd={trip.budgetUsd} /> est. budget
              </span>
            </div>
            {trip.terrains.length > 0 && <div className="mt-2"><TerrainChips terrains={trip.terrains} max={6} /></div>}
          </div>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full border border-border/60 hover:bg-secondary transition-colors shrink-0">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Controls */}
        {trip.itinerary && trip.itinerary.length > 0 && (
          <div className="flex items-center gap-2 px-5 py-2 border-b border-border/40 shrink-0">
            <span className="text-xs text-muted-foreground flex-1">{trip.itinerary.length}-day itinerary</span>
            <button onClick={expandAll} className="text-xs text-primary hover:underline">Expand all</button>
            <span className="text-muted-foreground text-xs">·</span>
            <button onClick={collapseAll} className="text-xs text-primary hover:underline">Collapse all</button>
          </div>
        )}

        {/* Itinerary */}
        <div className="overflow-y-auto flex-1 p-5 space-y-3">
          {trip.itinerary && trip.itinerary.length > 0 ? (
            trip.itinerary.map((d) => {
              const isOpen = expanded.has(d.day);
              return (
                <div key={d.day} className="border border-border/60 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggle(d.day)}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-surface-muted hover:bg-secondary/40 transition-colors text-left"
                  >
                    <span className="shrink-0 h-7 w-7 rounded-full bg-primary text-primary-foreground text-xs font-bold grid place-items-center">
                      {d.day}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{d.title}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                        {d.distanceKm !== undefined && (
                          <span className="inline-flex items-center gap-0.5">
                            <Ruler className="h-3 w-3" /> {d.distanceKm} km
                          </span>
                        )}
                        {d.durationHours !== undefined && (
                          <span className="inline-flex items-center gap-0.5">
                            <Clock className="h-3 w-3" /> {d.durationHours}h
                          </span>
                        )}
                      </div>
                    </div>
                    {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
                  </button>

                  {isOpen && (
                    <div className="px-4 py-3 border-t border-border/40 space-y-3">
                      <p className="text-sm text-muted-foreground leading-relaxed">{d.description}</p>
                      {d.highlights.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Highlights</p>
                          <ul className="space-y-1">
                            {d.highlights.map((h) => (
                              <li key={h} className="flex items-start gap-2 text-sm">
                                <MapPin className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                                {h}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground text-sm">{trip.blurb}</p>
              <p className="text-xs text-muted-foreground mt-2">Detailed day-by-day plan coming soon.</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border/60 shrink-0">
          <Button onClick={onClose} variant="outline" className="w-full">Close</Button>
        </div>
      </div>
    </div>
  );
}
