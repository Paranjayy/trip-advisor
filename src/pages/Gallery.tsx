import React, { useEffect, useMemo, useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, Search, Zap, Maximize2, MapPin, ExternalLink, Camera } from "lucide-react";
import { ITINERARIES } from "@/lib/itineraries";
import { COUNTRIES } from "@/data/countries";
import { getPhotoUrl } from "@/lib/photos";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const Gallery = () => {
  useEffect(() => { document.title = "Global Gallery — TripAdvisor"; }, []);

  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const allPhotos = useMemo(() => {
    const photos: { url: string; place: string; country: string; slug: string; type: 'country' | 'itinerary' }[] = [];
    
    COUNTRIES.forEach(c => {
      photos.push({
        url: getPhotoUrl(c.name, 800, 800),
        place: c.name,
        country: c.name,
        slug: c.slug,
        type: 'country'
      });
    });

    ITINERARIES.forEach(it => {
      photos.push({
        url: getPhotoUrl(it.slug.split('-')[0], 800, 800),
        place: it.title,
        country: it.region,
        slug: it.slug,
        type: 'itinerary'
      });
      // Add a few more from its plan
      it.plan.forEach(d => {
        photos.push({
          url: getPhotoUrl(d.base, 800, 800),
          place: d.base,
          country: it.region,
          slug: it.slug,
          type: 'itinerary'
        });
      });
    });

    // De-duplicate by place
    const seen = new Set();
    return photos.filter(p => {
      if (seen.has(p.place)) return false;
      seen.add(p.place);
      return true;
    }).filter(p => 
      !query || p.place.toLowerCase().includes(query.toLowerCase()) || p.country.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      
      <div className="container mx-auto py-10 px-4 md:px-6">
        <header className="mb-12 text-center space-y-4">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
              <ImageIcon className="h-3.5 w-3.5" /> Visual Pulse Stream
           </div>
           <h1 className="font-display text-4xl md:text-6xl font-black tracking-tighter">Global Gallery</h1>
           <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium">
              A high-fidelity stream of global travel photography. Every destination, every base camp, every road trip—visualized.
           </p>
           
           <div className="max-w-md mx-auto relative pt-4">
              <Search className="absolute left-3 top-[calc(50%+8px)] -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search places, countries, vibes..."
                className="pl-10 h-12 bg-surface-muted/30 border-border/40 rounded-2xl font-bold"
              />
           </div>
        </header>

        <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-6 space-y-6">
           {allPhotos.map((p, i) => (
             <motion.div
               key={`${p.place}-${i}`}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: (i % 10) * 0.05 }}
               className="break-inside-avoid relative group rounded-3xl overflow-hidden border border-border/40 shadow-elevated bg-surface-muted/30 cursor-zoom-in"
               onClick={() => setSelected(p.url)}
             >
                <img 
                  src={p.url} 
                  alt={p.place}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-end p-6">
                   <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">{p.place}</span>
                   </div>
                   <p className="text-[9px] font-bold text-white/60 uppercase tracking-widest mb-4">{p.country}</p>
                   <Button asChild size="sm" className="w-full rounded-xl h-9 font-black text-[10px] gap-2 bg-primary/20 hover:bg-primary backdrop-blur-md border border-white/10">
                      <Link to={p.type === 'country' ? `/country/${p.slug}` : `/itinerary/${p.slug}`} onClick={(e) => e.stopPropagation()}>
                         <ExternalLink className="h-3.5 w-3.5" /> EXPLORE NODE
                      </Link>
                   </Button>
                </div>
                <div className="absolute top-4 right-4 h-8 w-8 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <Maximize2 className="h-4 w-4 text-white" />
                </div>
             </motion.div>
           ))}
        </div>

        {allPhotos.length === 0 && (
           <div className="py-20 text-center space-y-4">
              <Camera className="h-16 w-16 mx-auto text-muted-foreground opacity-20" />
              <p className="font-black text-muted-foreground uppercase tracking-widest">No visual nodes match your query</p>
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
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  className="relative max-w-5xl w-full aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5"
               >
                  <img src={selected} alt="Selected" className="w-full h-full object-cover" />
                  <div className="absolute bottom-10 left-10">
                     <Button variant="ghost" onClick={() => setSelected(null)} className="rounded-2xl h-12 px-6 font-black bg-black/40 text-white backdrop-blur-md hover:bg-black/60 gap-3 border border-white/10">
                        <Zap className="h-5 w-5 rotate-90" /> CLOSE IMMERSION
                     </Button>
                  </div>
               </motion.div>
            </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
