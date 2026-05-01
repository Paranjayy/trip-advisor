import { Link } from "react-router-dom";
import { Network, ArrowRight, Sparkles, MapPin } from "lucide-react";
import { getCountry } from "@/data/countries";
import { similarCountries } from "@/lib/japanVibe";
import { Flag } from "@/components/Flag";
import { cn } from "@/lib/utils";

export function DegreesOfSeparation({ slug }: { slug: string }) {
  const current = getCountry(slug);
  const similar = similarCountries(slug, 3);

  if (!current) return null;

  return (
    <div className="space-y-6">
       <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
             <Network className="h-5 w-5 text-primary" />
          </div>
          <div>
             <h3 className="font-display font-bold leading-none">Vibe Nexus</h3>
             <p className="text-xs text-muted-foreground mt-1">Connectivity in the global travel graph</p>
          </div>
       </div>

       <div className="relative space-y-4">
          <div className="absolute left-[20px] top-4 bottom-4 w-px bg-dashed border-l border-border/60" />
          
          <div className="flex items-center gap-4 relative z-10">
             <div className="h-10 w-10 rounded-xl bg-primary shadow-glow flex items-center justify-center font-black text-primary-foreground border-2 border-background">
                {current.flag}
             </div>
             <div className="flex-1 p-3 rounded-2xl bg-surface border border-border/40">
                <p className="text-[10px] font-black uppercase text-primary mb-0.5">Origin</p>
                <p className="text-sm font-bold">{current.name}</p>
             </div>
          </div>

          {similar.map((s, i) => {
            const country = s.country;
            return (
              <Link 
                key={country.slug} 
                to={`/country/${country.slug}`}
                className="flex items-center gap-4 relative z-10 group"
              >
                 <div className="h-10 w-10 rounded-xl bg-surface-muted flex items-center justify-center font-black text-foreground border border-border/60 group-hover:border-primary group-hover:scale-110 transition-all">
                    {country.flag}
                 </div>
                 <div className="flex-1 p-3 rounded-2xl bg-surface border border-border/40 group-hover:border-primary/20 group-hover:bg-primary/5 transition-all">
                    <div className="flex items-center justify-between">
                       <p className="text-[10px] font-black uppercase text-muted-foreground mb-0.5">
                          {i === 0 ? "First Degree" : i === 1 ? "Second Degree" : "Third Degree"}
                       </p>
                       <span className="text-[9px] font-black text-primary flex items-center gap-1">
                          <Sparkles className="h-2 w-2" /> {s.score}% Match
                       </span>
                    </div>
                    <div className="flex items-center justify-between">
                       <p className="text-sm font-bold group-hover:text-primary transition-colors">{country.name}</p>
                       <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                    </div>
                 </div>
              </Link>
            );
          })}
       </div>
       
       <div className="p-4 rounded-2xl bg-accent/5 border border-accent/20">
          <p className="text-[10px] font-black uppercase text-accent mb-2">Network Logic</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
             Based on {current.name}'s <span className="font-bold text-foreground">{current.vibe}</span> DNA and <span className="font-bold text-foreground">{current.region}</span> proximity.
          </p>
       </div>
    </div>
  );
}
