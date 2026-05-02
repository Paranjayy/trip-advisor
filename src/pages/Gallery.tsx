import React, { useEffect, useMemo, useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Image as ImageIcon, Search, Zap, Maximize2, MapPin, 
  ExternalLink, Camera, LayoutGrid, Layers, SortAsc, 
  Filter, Globe, Route, FilterX
} from "lucide-react";
import { ITINERARIES } from "@/lib/itineraries";
import { COUNTRIES } from "@/data/countries";
import { getPhotoUrl } from "@/lib/photos";
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
};

const Gallery = () => {
  useEffect(() => { document.title = "Global Gallery — TripAdvisor"; }, []);

  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<"all" | "country" | "itinerary">("all");
  const [sortBy, setSortBy] = useState<"name" | "recent">("recent");
  const [provider, setProvider] = useState<PhotoProvider | "all">("lorem");
  const [isGrouped, setIsGrouped] = useState(false);

  const allPhotos = useMemo(() => {
    let photos: PhotoNode[] = [];
    
    const providers: PhotoProvider[] = provider === "all" ? ["lorem", "unsplash", "wiki", "satellite", "art"] : [provider];
    
    // Check if query is a general search (not matching known places)
    const knownPlaces = new Set([
       ...COUNTRIES.map(c => c.name.toLowerCase()),
       ...ITINERARIES.map(it => it.title.toLowerCase()),
       ...ITINERARIES.flatMap(it => it.plan.map(d => d.base.toLowerCase()))
    ]);

    const isGeneralSearch = query.length > 2 && !knownPlaces.has(query.toLowerCase());

    providers.forEach(p => {
      // If search query is present, prioritize search results
      if (query && query.length > 1) {
        // Generate a large pulse for search
        const mods = p === 'satellite' ? ["sat", "topo", "terrain", "ortho"] : ["view", "mood", "vista", "detail", "street", "architecture", "landscape", "interior", "night", "candid", "aerial", "culture", "landmark", "hotel", "food", "vibe"];
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

        // If it's a general search, we skip the internal nodes to keep results relevant
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

    // 1. Initial filter by type and query
    let filtered = photos.filter(p => {
      const matchQuery = !query || p.place.toLowerCase().includes(query.toLowerCase()) || p.country.toLowerCase().includes(query.toLowerCase()) || (p.tag && p.tag.includes(query.toLowerCase()));
      const matchType = filterType === "all" || p.type === filterType;
      return matchQuery && matchType;
    });

    // 2. Deduplicate after filtering - extremely unique key
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

  const getNeuralFact = (place: string, tag?: string) => {
    const facts = [
       "Geospatial alignment verified via local node network.",
       "Spectral analysis indicates optimal viewing window: 16:00 - 18:00.",
       "Discovery Pulse: High-fidelity historical significance detected.",
       "Cultural density: 9.4/10 based on recent field captures.",
       "Topographical scan: Peak visibility confirmed for current season.",
       "Neural signature matches known architectural masterpieces.",
    ];
    const seed = (place + (tag || "")).length;
    return facts[seed % facts.length];
  };

  const isHeritage = (place: string) => {
    const landmarks = ["Junagadh", "Girnar", "Uparkot", "Kyoto", "Rome", "Paris", "Athens", "Giza", "Agra", "Jaipur"];
    return landmarks.some(l => place.toLowerCase().includes(l.toLowerCase()));
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      
      <div className="container mx-auto py-10 px-4 md:px-6">
        <header className="mb-12 text-center space-y-6">
           <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em] shadow-glow">
              <Zap className="h-3.5 w-3.5 animate-pulse" /> Visual Intelligence Matrix
           </div>
           <h1 className="font-display text-5xl md:text-7xl font-black tracking-tighter drop-shadow-sm">Global Gallery</h1>
           <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-medium leading-relaxed italic">
              "A high-fidelity stream of global travel photography. Every destination, every base camp, visualized."
           </p>
           
           <div className="max-w-5xl mx-auto space-y-6 pt-8">
              <div className="glass-card p-4 flex flex-wrap items-center gap-6 border-primary/5 shadow-elevated">
                 <div className="relative flex-1 min-w-[300px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search places, countries, vibes..."
                      className="pl-11 h-12 bg-surface-muted/30 border-border/40 rounded-2xl font-black text-sm"
                    />
                 </div>

                 <div className="flex bg-surface-muted/30 rounded-2xl p-1.5 border border-border/40 gap-1 shadow-inner">
                    <FilterBtn active={filterType === "all"} onClick={() => setFilterType("all")} icon={<LayoutGrid className="h-4 w-4" />} label="All" />
                    <FilterBtn active={filterType === "country"} onClick={() => setFilterType("country")} icon={<Globe className="h-4 w-4" />} label="Nodes" />
                    <FilterBtn active={filterType === "itinerary"} onClick={() => setFilterType("itinerary")} icon={<Route className="h-4 w-4" />} label="Trips" />
                 </div>

                 <div className="h-10 w-px bg-border/40 mx-2 hidden xl:block" />

                 <div className="flex bg-accent/5 rounded-2xl p-1.5 border border-accent/10 gap-1 shadow-inner overflow-x-auto no-scrollbar">
                   <button 
                     onClick={() => setProvider("all")}
                     className={cn("px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shrink-0", provider === "all" ? "bg-accent text-white shadow-glow" : "text-muted-foreground hover:text-accent")}
                   >All Access</button>
                   <div className="w-px h-4 bg-accent/20 mx-1 self-center" />
                   <button 
                     onClick={() => setProvider("lorem")}
                     className={cn("px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shrink-0", provider === "lorem" ? "bg-accent text-white shadow-glow" : "text-muted-foreground hover:text-accent")}
                   >Standard</button>
                   <button 
                     onClick={() => setProvider("unsplash")}
                     className={cn("px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shrink-0", provider === "unsplash" ? "bg-accent text-white shadow-glow" : "text-muted-foreground hover:text-accent")}
                   >Cinematic</button>
                    <button 
                      onClick={() => setProvider("wiki")}
                      className={cn("px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shrink-0", provider === "wiki" ? "bg-accent text-white shadow-glow" : "text-muted-foreground hover:text-accent")}
                    >Precision</button>
                    <button 
                      onClick={() => setProvider("satellite")}
                      className={cn("px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shrink-0", provider === "satellite" ? "bg-accent text-white shadow-glow" : "text-muted-foreground hover:text-accent")}
                    >Orbital</button>
                    <button 
                      onClick={() => setProvider("art")}
                      className={cn("px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shrink-0", provider === "art" ? "bg-accent text-white shadow-glow" : "text-muted-foreground hover:text-accent")}
                    >Abstract</button>
                 </div>

                 <Select value={sortBy} onValueChange={(v) => setSortBy(v as never)}>
                    <SelectTrigger className="w-[160px] h-12 bg-surface-muted/30 rounded-2xl border-border/40 font-black text-[10px] uppercase tracking-widest"><SelectValue /></SelectTrigger>
                    <SelectContent>
                       <SelectItem value="recent">Sort: Recent</SelectItem>
                       <SelectItem value="name">Sort: Name A-Z</SelectItem>
                    </SelectContent>
                 </Select>

                 <Toggle 
                    pressed={isGrouped} 
                    onPressedChange={setIsGrouped}
                    className="rounded-2xl h-12 border border-border/40 bg-surface-muted/30 text-[10px] font-black uppercase tracking-widest data-[state=on]:bg-primary/10 data-[state=on]:text-primary px-6"
                 >
                    <Layers className="h-4 w-4 mr-2" /> Group
                 </Toggle>
              </div>
           </div>
        </header>

        <div className="space-y-24">
          {Object.entries(grouped).map(([groupName, photos]) => (
            photos.length > 0 && (
              <div key={groupName} className="space-y-10">
                {isGrouped && (
                  <div className="flex items-center gap-6">
                    <h2 className="font-display text-3xl font-black tracking-tighter">{groupName}</h2>
                    <div className="h-px bg-gradient-to-r from-border/60 to-transparent flex-1" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/5 px-4 py-1 rounded-full border border-primary/10">{photos.length} Captures</span>
                  </div>
                )}
                
                <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-6 space-y-6">
                   {photos.map((p, i) => (
                     <GalleryItem 
                        key={`${p.place}-${i}`} 
                        p={p} 
                        i={i} 
                        onZoom={() => setSelected(p.url)} 
                        isHeritage={isHeritage(p.place)}
                     />
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

      <AnimatePresence>
         {selected && (
            <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setSelected(null)}
               className="fixed inset-0 z-[2000] bg-background/95 backdrop-blur-3xl flex items-center justify-center p-10 cursor-zoom-out"
            >
               <motion.div
                  initial={{ scale: 0.8, y: 40, rotate: -2 }}
                  animate={{ scale: 1, y: 0, rotate: 0 }}
                  exit={{ scale: 0.8, y: 40, rotate: 2 }}
                  className="relative max-w-5xl w-full aspect-video rounded-[3rem] overflow-hidden shadow-2xl border border-white/5 bg-surface"
               >
                  <img src={selected} alt="Selected" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-10 left-10 right-10 flex items-center justify-between">
                     <Button variant="ghost" onClick={() => setSelected(null)} className="rounded-2xl h-14 px-8 font-black bg-white/10 text-white backdrop-blur-md hover:bg-white/20 gap-4 border border-white/10 text-lg">
                        <Zap className="h-6 w-6 rotate-90" /> DISMISS IMMERSION
                     </Button>
                     <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10">
                        <Camera className="h-5 w-5 text-primary" />
                        <span className="text-xs font-black text-white uppercase tracking-widest">Visual Hash: {Math.random().toString(36).substring(7).toUpperCase()}</span>
                     </div>
                  </div>
               </motion.div>
            </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
};

function FilterBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
        active ? "bg-primary text-white shadow-glow" : "text-muted-foreground hover:text-foreground"
      )}
    >
      {icon} {label}
    </button>
  );
}

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
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: (i % 12) * 0.04 }}
      className="break-inside-avoid relative group rounded-[2.5rem] overflow-hidden border border-border/40 shadow-elevated bg-surface-muted/30 cursor-zoom-in mb-6"
      onClick={onZoom}
    >
       <img 
         src={p.url} 
         alt={p.place}
         className="w-full h-auto object-cover group-hover:scale-105 transition-all duration-700 group-hover:rotate-1"
         loading="lazy"
       />
       
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
                <h3 className="text-white font-black text-xl tracking-tighter leading-tight drop-shadow-md">{p.place}</h3>
                <div className="flex items-center gap-2 text-white/50 text-[9px] font-black uppercase tracking-widest">
                   <Globe className="h-3 w-3" /> {p.country.split(':').pop()?.trim()}
                </div>
             </div>

             <p className="text-white/60 text-[10px] font-medium leading-relaxed italic border-l border-primary/40 pl-4">
                "{getNeuralFact(p.place, p.tag)}"
             </p>

             <div className="flex items-center gap-2 pt-2">
                <Button asChild size="sm" className="flex-1 rounded-xl h-10 font-black text-[9px] gap-2 bg-white/5 hover:bg-primary backdrop-blur-md border border-white/10 uppercase tracking-[0.2em] transition-all active:scale-95">
                   <Link to={p.type === 'country' ? `/country/${p.slug}` : `/itinerary/${p.slug}`} onClick={(e) => e.stopPropagation()}>
                      <ExternalLink className="h-3 w-3" /> Explore
                   </Link>
                </Button>
                {p.tag && (
                   <div className="px-3 h-10 flex items-center rounded-xl bg-primary/10 backdrop-blur-md border border-primary/20 text-[9px] font-black text-primary uppercase tracking-widest">
                      {p.tag}
                   </div>
                )}
             </div>
          </div>
       </div>

       {/* Scanning Line Animation */}
       <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-scan transition-opacity pointer-events-none" />
    </motion.div>
  );
}

export default Gallery;
