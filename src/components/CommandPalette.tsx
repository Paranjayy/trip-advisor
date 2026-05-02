import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Route, Image as ImageIcon, Zap, Command, X, Globe, Landmark, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ITINERARIES } from "@/lib/itineraries";
import { COUNTRIES } from "@/data/countries";
import { cn } from "@/lib/utils";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setOpen((o) => !o);
    }
    if (e.key === "Escape") {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const results = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    
    const items = [
      ...COUNTRIES.map(c => ({ id: c.slug, title: c.name, type: "country", category: "Discovery Node", icon: Globe, to: `/explore?q=${c.name}` })),
      ...ITINERARIES.map(it => ({ id: it.slug, title: it.title, type: "itinerary", category: "Expedition", icon: Route, to: `/itinerary/${it.slug}` })),
      { id: "gallery", title: `Search Gallery for "${query}"`, type: "action", category: "Visual Pulse", icon: ImageIcon, to: `/gallery?q=${query}` },
      { id: "planner", title: "Open Expedition Planner", type: "action", category: "Tools", icon: Zap, to: "/planner" }
    ];

    return items.filter(i => i.title.toLowerCase().includes(q)).slice(0, 8);
  }, [query]);

  const handleSelect = (to: string) => {
    navigate(to);
    setOpen(false);
    setQuery("");
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-md"
          />
          <div className="fixed inset-0 z-[101] flex items-start justify-center pt-[15vh] px-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-2xl bg-surface border border-border shadow-2xl rounded-[2.5rem] overflow-hidden pointer-events-auto"
            >
              <div className="relative border-b border-border/60">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Find anything... (Countries, Trips, Gallery Nodes)"
                  className="w-full h-20 pl-16 pr-20 bg-transparent text-xl font-black focus:outline-none placeholder:text-muted-foreground/50"
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-muted border border-border/40 text-[10px] font-black text-muted-foreground">
                  ESC
                </div>
              </div>

              <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
                {query ? (
                  <div className="space-y-1">
                    {results.length > 0 ? (
                      results.map((res) => (
                        <button
                          key={res.id + res.type}
                          onClick={() => handleSelect(res.to)}
                          className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-primary/10 transition-all group text-left"
                        >
                          <div className="h-12 w-12 rounded-xl bg-surface-muted border border-border/40 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
                            <res.icon className="h-5 w-5 text-muted-foreground group-hover:text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="text-[10px] font-black uppercase tracking-widest text-primary/60 mb-0.5">{res.category}</div>
                            <div className="text-lg font-black tracking-tight text-foreground">{res.title}</div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                        </button>
                      ))
                    ) : (
                      <div className="py-20 text-center space-y-4">
                        <Zap className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
                        <p className="font-black text-muted-foreground uppercase tracking-widest text-xs">No intelligence nodes found for "{query}"</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-8 space-y-8">
                    <div className="space-y-4">
                      <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Recent Expeditions</div>
                      <div className="grid grid-cols-2 gap-4">
                        {ITINERARIES.slice(0, 4).map(it => (
                           <button key={it.slug} onClick={() => handleSelect(`/itinerary/${it.slug}`)} className="flex items-center gap-3 p-3 rounded-2xl border border-border/40 bg-surface-muted/30 hover:border-primary/40 transition-all text-left">
                              <Route className="h-4 w-4 text-primary" />
                              <span className="text-xs font-bold truncate">{it.title}</span>
                           </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Discovery Quick-Links</div>
                      <div className="flex flex-wrap gap-2">
                         {["Japan", "Switzerland", "Bali", "Iceland", "Dubai", "Junagadh"].map(q => (
                           <button key={q} onClick={() => handleSelect(`/gallery?q=${q}`)} className="px-4 py-2 rounded-full bg-surface-muted border border-border/40 text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all">{q}</button>
                         ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 bg-surface-muted/50 border-t border-border/40 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 rounded bg-surface border border-border/40 text-[10px] font-black">⏎</kbd>
                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Select</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 rounded bg-surface border border-border/40 text-[10px] font-black">↑↓</kbd>
                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Navigate</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-primary">
                  <Sparkles className="h-4 w-4 fill-current" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Neural Index Active</span>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6"/></svg>;
}
