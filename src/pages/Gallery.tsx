import React, { useEffect, useMemo, useState, useRef } from "react";
import { SiteNav } from "@/components/SiteNav";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Image as ImageIcon, Search, Zap, Maximize2, MapPin, 
  ExternalLink, Camera, LayoutGrid, Layers, SortAsc, 
  Filter, Globe, Route, FilterX, Library, Landmark, Sparkles, Compass, Shuffle
} from "lucide-react";
import { ITINERARIES } from "@/lib/itineraries";
import { COUNTRIES } from "@/data/countries";
import { getPhotoUrl, PhotoProvider } from "@/lib/photos";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

type PhotoNode = {
  url: string;
  place: string;
  country: string;
  slug: string;
  type: 'country' | 'itinerary';
  tag?: string;
};

const Gallery = () => {
  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => { 
    document.title = "Global Gallery — TripAdvisor"; 
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "country" | "itinerary">("all");
  const [sortBy, setSortBy] = useState<"recent" | "name">("recent");
  const [selected, setSelected] = useState<string | null>(null);
  const [isGrouped, setIsGrouped] = useState(false);
  const [provider, setProvider] = useState<PhotoProvider | "all">("all");

  const allPhotos = useMemo(() => {
    const photos: PhotoNode[] = [];
    const providers: PhotoProvider[] = provider === "all" ? ["lorem", "unsplash", "wiki", "satellite", "art"] : [provider];
    
    const knownPlaces = new Set([
       ...COUNTRIES.map(c => c.name.toLowerCase()),
       ...ITINERARIES.map(it => it.title.toLowerCase()),
       ...ITINERARIES.flatMap(it => it.plan.map(d => d.base.toLowerCase()))
    ]);

    const isGeneralSearch = query.length > 2 && !knownPlaces.has(query.toLowerCase());

    providers.forEach(p => {
      if (query && query.length > 1) {
        const mods = p === 'satellite' ? ["sat", "topo", "terrain"] : ["view", "mood", "vista", "architecture", "landscape", "night", "culture", "landmark"];
        mods.forEach((mod) => {
           photos.push({
             url: getPhotoUrl(`${query} ${mod}`, 800, 800, p),
             place: query, 
             country: isGeneralSearch ? `Global Discovery: ${query}` : "Precision Discovery",
             slug: "search",
             type: 'itinerary',
             tag: mod
           });
        });
        if (isGeneralSearch) return;
      }

      COUNTRIES.forEach(c => {
        photos.push({
          url: getPhotoUrl(c.name, 800, 800, p),
          place: c.name,
          country: c.name,
          slug: c.slug,
          type: 'country'
        });
      });

      ITINERARIES.forEach(it => {
        photos.push({
          url: getPhotoUrl(it.slug.split('-')[0], 800, 800, p),
          place: it.title,
          country: it.region,
          slug: it.slug,
          type: 'itinerary'
        });
        it.plan.forEach(d => {
          photos.push({
            url: getPhotoUrl(d.base, 800, 800, p),
            place: d.base,
            country: it.region,
            slug: it.slug,
            type: 'itinerary'
          });
        });
      });
    });

    let filtered = photos.filter(p => {
      const matchQuery = !query || p.place.toLowerCase().includes(query.toLowerCase()) || p.country.toLowerCase().includes(query.toLowerCase()) || (p.tag && p.tag.includes(query.toLowerCase()));
      const matchType = filterType === "all" || p.type === filterType;
      return matchQuery && matchType;
    });

    const seen = new Set();
    filtered = filtered.filter(p => {
      const key = `${p.url}-${p.place}-${p.tag || ''}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    if (sortBy === "name") {
      filtered.sort((a, b) => a.place.localeCompare(b.place));
    }
    
    return filtered;
  }, [query, filterType, sortBy, provider]);

  const grouped = useMemo(() => {
    const defaultLabel = query ? `Discovery Matrix: ${query}` : "Visual Stream";
    if (!isGrouped) return { [defaultLabel]: allPhotos };
    const groups: Record<string, PhotoNode[]> = {};
    allPhotos.forEach(p => {
      const g = p.country;
      if (!groups[g]) groups[g] = [];
      groups[g].push(p);
    });
    return groups;
  }, [allPhotos, isGrouped, query]);

  const isHeritage = (place: string) => {
    const landmarks = ["Junagadh", "Girnar", "Uparkot", "Kyoto", "Rome", "Paris", "Athens", "Giza", "Agra", "Jaipur"];
    return landmarks.some(l => place.toLowerCase().includes(l.toLowerCase()));
  };

  const recommendations = useMemo(() => {
    const defaultRecos = ["Switzerland", "Japan", "Iceland", "Bali", "Patagonia", "Dubai", "New Zealand", "Norway"];
    if (!query) return defaultRecos;
    
    const q = query.toLowerCase();
    
    // Regional Pulse Matrix: Maps clusters to high-fidelity nodes
    const pulseMatrix: Record<string, string[]> = {
      "india": ["Varanasi Ghats", "Hampi Ruins", "Munnar Tea Estates", "Ladakh Passes", "Udaipur Palaces", "Goa Beaches"],
      "junagadh": ["Uparkot Caves", "Mahabat Maqbara", "Somnath Temple", "Sasan Gir", "Diü Island", "Rann of Kutch"],
      "japan": ["Kyoto Temples", "Shibuya Night", "Mt Fuji Vista", "Osaka Street Food", "Nara Deer Park", "Hokkaido Snow"],
      "swiss": ["Interlaken Lakes", "Matterhorn Peak", "Lucerne Bridge", "Grindelwald Valley", "St Moritz Luxury"],
      "bali": ["Ubud Jungles", "Uluwatu Cliffs", "Seminyak Sunsets", "Mount Batur Trek", "Nusa Penida Views"],
      "nature": ["Amazon Rainforest", "Grand Canyon", "Great Barrier Reef", "Sahara Dunes", "Antarctica Ice"],
    };

    const match = Object.keys(pulseMatrix).find(key => q.includes(key));
    if (match) return pulseMatrix[match];

    return [
       `${query} Aerial`, `${query} Night`, `${query} Heritage`, 
       `${query} Architecture`, `${query} Hidden Gem`, `${query} Local Vibe`
    ];
  }, [query]);

  const [warpLoading, setWarpLoading] = useState(false);

  const handleWarp = () => {
    setWarpLoading(true);
    const recos = ["Switzerland", "Japan", "Iceland", "Bali", "Patagonia", "Dubai", "Kyoto", "Rome", "Athens"];
    const random = recos[Math.floor(Math.random() * recos.length)];
    setTimeout(() => {
      setQuery(random);
      setWarpLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Neural Drift Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
         <motion.div 
           animate={{ 
             scale: [1, 1.2, 1],
             rotate: [0, 5, 0],
             opacity: [0.1, 0.2, 0.1]
           }}
           transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
           className="absolute -top-[20%] -left-[20%] w-[140%] h-[140%] bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary-rgb),0.15),transparent_70%)]" 
         />
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      <SiteNav />
      <div className="container mx-auto py-10 px-4 md:px-6 relative z-10">
        <header className="mb-12 text-center space-y-8">
           <div className="space-y-4">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em] shadow-glow">
                 <Sparkles className="h-3 w-3 fill-current" /> Visual Intelligence Matrix
              </div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-foreground">
                 Global <span className="text-primary drop-shadow-glow">Gallery</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium">
                 "A high-fidelity stream of global travel photography. Every destination, every base camp, visualized."
              </p>
           </div>

           <div className="max-w-4xl mx-auto space-y-6 relative z-[60]">
              <div className="relative group">
                 <div className="absolute inset-0 bg-primary/20 blur-3xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000" />
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
                 <Input 
                   ref={searchRef}
                   value={query}
                   onChange={(e) => setQuery(e.target.value)}
                   placeholder="Search the global discovery matrix..."
                   className="h-20 pl-16 pr-24 text-xl font-bold bg-secondary/80 backdrop-blur-xl border-border/40 focus-visible:ring-primary/20 rounded-[2rem] shadow-2xl relative z-10"
                 />
                 <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-muted border border-border/40 text-[10px] font-black text-muted-foreground pointer-events-none group-focus-within:border-primary/40 group-focus-within:text-primary transition-all shadow-sm z-20">
                    <span className="opacity-50">⌘</span><span>K</span>
                 </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                 <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mr-2">Related Nodes:</span>
                 {recommendations.map((reco) => (
                    <button key={reco} onClick={() => setQuery(reco)} className="px-4 py-2 rounded-full bg-surface-muted/50 border border-border/40 text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all">{reco}</button>
                 ))}
              </div>
           </div>

           <div className="flex flex-wrap justify-center items-center gap-6 pt-8">
              <div className="flex bg-surface-muted/30 rounded-2xl p-1.5 border border-border/40 gap-1 shadow-inner">
                <FilterBtn active={filterType === "all"} onClick={() => setFilterType("all")} icon={<LayoutGrid className="h-4 w-4" />} label="All" />
                <FilterBtn active={filterType === "country"} onClick={() => setFilterType("country")} icon={<Globe className="h-4 w-4" />} label="Nodes" />
                <FilterBtn active={filterType === "itinerary"} onClick={() => setFilterType("itinerary")} icon={<Route className="h-4 w-4" />} label="Trips" />
              </div>

              <div className="flex bg-accent/5 rounded-2xl p-1.5 border border-accent/10 gap-1 shadow-inner overflow-x-auto no-scrollbar">
                {["all", "lorem", "unsplash", "wiki", "satellite", "art"].map((p) => (
                  <button key={p} onClick={() => setProvider(p as any)} className={cn("px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all", provider === p ? "bg-accent text-white shadow-glow" : "text-muted-foreground")}>{p === "all" ? "All Access" : p === "lorem" ? "Standard" : p === "unsplash" ? "Cinematic" : p === "wiki" ? "Precision" : p === "satellite" ? "Orbital" : "Abstract"}</button>
                ))}
              </div>

              <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                 <SelectTrigger className="w-[160px] h-12 bg-surface-muted/30 rounded-2xl border-border/40 font-black text-[10px] uppercase tracking-widest"><SelectValue /></SelectTrigger>
                 <SelectContent>
                    <SelectItem value="recent">Sort: Recent</SelectItem>
                    <SelectItem value="name">Sort: Name A-Z</SelectItem>
                 </SelectContent>
              </Select>

              <Toggle pressed={isGrouped} onPressedChange={setIsGrouped} className="rounded-2xl h-12 border border-border/40 bg-surface-muted/30 text-[10px] font-black uppercase tracking-widest data-[state=on]:bg-primary/10 data-[state=on]:text-primary px-6">
                 <Layers className="h-4 w-4 mr-2" /> Group
              </Toggle>
           </div>
        </header>

        <div className="space-y-24">
          {Object.entries(grouped).map(([groupName, photos]) => (
            photos.length > 0 && (
              <div key={groupName} className="space-y-10">
                {isGrouped && (
                  <div className="flex items-center gap-6">
                    <h2 className="text-3xl font-black tracking-tighter">{groupName}</h2>
                    <div className="h-px bg-gradient-to-r from-border/60 to-transparent flex-1" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/5 px-4 py-1 rounded-full border border-primary/10">{photos.length} Captures</span>
                  </div>
                )}
                <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-6 space-y-6">
                   {photos.map((p, i) => (
                     <GalleryItem key={`${p.place}-${i}`} p={p} i={i} onZoom={() => setSelected(p.url)} isHeritage={isHeritage(p.place)} />
                   ))}
                </div>
              </div>
            )
          ))}
        </div>

        {allPhotos.length === 0 && (
           <div className="py-40 text-center space-y-6 glass-card border-dashed border-2 bg-surface-muted/10 max-w-2xl mx-auto rounded-[3rem]">
              <FilterX className="h-20 w-20 mx-auto text-muted-foreground opacity-10" />
              <div className="space-y-2">
                 <h3 className="text-2xl font-black tracking-tight">Empty Visual Signal</h3>
                 <p className="font-bold text-muted-foreground uppercase tracking-widest text-[10px]">Your filters returned zero nodes from the global matrix.</p>
              </div>
              <Button onClick={() => { setQuery(""); setFilterType("all"); }} variant="outline" className="rounded-2xl font-black">RESET FILTERS</Button>
           </div>
        )}
      </div>

      {/* Discovery Compass / Warp Button */}
      <div className="fixed bottom-10 right-10 z-[100]">
         <motion.button
           whileHover={{ scale: 1.1, rotate: 5 }}
           whileTap={{ scale: 0.9 }}
           onClick={handleWarp}
           disabled={warpLoading}
           className="relative h-20 w-20 rounded-full bg-primary shadow-glow shadow-primary/40 flex items-center justify-center group overflow-hidden border-4 border-background"
         >
            <AnimatePresence mode="wait">
               {warpLoading ? (
                 <motion.div
                   key="loading"
                   initial={{ rotate: 0 }}
                   animate={{ rotate: 360 }}
                   transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                 >
                    <Shuffle className="h-8 w-8 text-white" />
                 </motion.div>
               ) : (
                 <motion.div key="icon" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                    <Compass className="h-10 w-10 text-white fill-current animate-pulse" />
                 </motion.div>
               )}
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
         </motion.button>
         
         <div className="absolute -top-12 right-0 bg-surface border border-border px-4 py-2 rounded-2xl shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all pointer-events-none">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Discovery Warp Engine</span>
         </div>
      </div>

      <AnimatePresence>
         {selected && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)} className="fixed inset-0 z-[2000] bg-background/95 backdrop-blur-3xl flex items-center justify-center p-10 cursor-zoom-out">
               <motion.div initial={{ scale: 0.8, y: 40 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8, y: 40 }} className="relative max-w-5xl w-full aspect-video rounded-[3rem] overflow-hidden shadow-2xl border border-white/5 bg-surface">
                  <img src={selected} alt="Selected" className="w-full h-full object-cover" />
                  <div className="absolute bottom-10 left-10 right-10 flex items-center justify-between">
                     <Button variant="ghost" onClick={() => setSelected(null)} className="rounded-2xl h-14 px-8 font-black bg-white/10 text-white backdrop-blur-md hover:bg-white/20 gap-4 border border-white/10 text-lg">
                        <Zap className="h-6 w-6 rotate-90" /> DISMISS
                     </Button>
                  </div>
               </motion.div>
            </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
};

function GalleryItem({ p, i, onZoom, isHeritage }: { p: PhotoNode; i: number; onZoom: () => void; isHeritage?: boolean }) {
  const getNeuralFact = (place: string, tag?: string) => {
    const facts = [
       "Geospatial alignment verified via local node network.",
       "Spectral analysis indicates optimal viewing window: 16:00 - 18:00.",
       "Discovery Pulse: High-fidelity historical significance detected.",
       "Cultural density: 9.4/10 based on recent field captures.",
       "Topographical scan: Peak visibility confirmed for current season.",
       "Neural signature matches known architectural masterpieces.",
    ];
    const seed = (place + (tag || "")).length + i;
    return facts[seed % facts.length];
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: (i % 12) * 0.04 }} className="break-inside-avoid relative group rounded-[2.5rem] overflow-hidden border border-border/40 shadow-elevated bg-surface-muted/30 cursor-zoom-in mb-6" onClick={onZoom}>
       <img src={p.url} alt={p.place} className="w-full h-auto object-cover group-hover:scale-105 transition-all duration-700" loading="lazy" />
       <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
          <div className="absolute top-6 right-6 flex items-center gap-3">
             {isHeritage && (
               <div className="h-10 px-4 rounded-2xl bg-amber-500/20 backdrop-blur-md border border-amber-500/40 flex items-center gap-2 shadow-glow shadow-amber-500/20">
                  <Library className="h-4 w-4 text-amber-500 fill-current" />
                  <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Heritage</span>
               </div>
             )}
             <div className="h-10 w-10 rounded-2xl bg-primary/20 backdrop-blur-md border border-primary/40 flex items-center justify-center animate-pulse">
                <Zap className="h-5 w-5 text-primary fill-current" />
             </div>
          </div>
          <div className="space-y-4 translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
             <div className="flex items-center gap-2">
                <div className="h-1 w-10 bg-primary rounded-full animate-pulse" />
                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-primary">Neural Scan Active</span>
             </div>
             <div className="space-y-1">
                <h3 className="text-white font-black text-xl tracking-tighter leading-tight">{p.place}</h3>
                <div className="flex items-center gap-2 text-white/50 text-[9px] font-black uppercase tracking-widest">
                   <Globe className="h-3 w-3" /> {p.country.split(':').pop()?.trim()}
                </div>
             </div>
             <p className="text-white/60 text-[10px] font-medium leading-relaxed italic border-l border-primary/40 pl-4">
                "{getNeuralFact(p.place, p.tag)}"
             </p>
          </div>
       </div>
    </motion.div>
  );
}

function FilterBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button onClick={onClick} className={cn("flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", active ? "bg-primary text-white shadow-glow" : "text-muted-foreground hover:text-foreground")}>
      {icon} {label}
    </button>
  );
}

export default Gallery;
