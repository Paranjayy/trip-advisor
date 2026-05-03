import React from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Flag } from "./Flag";
import { Money } from "./Money";
import { type Country } from "@/data/countries";
import { japanVibe } from "@/lib/japanVibe";
import { TerrainChips } from "./TerrainChips";
import { terrainsFor } from "@/lib/terrains";
import { cn } from "@/lib/utils";
import { getVisaStatus, getVisaLabel, getVisaTone } from "@/lib/passport";
import { getPhotoUrl } from "@/lib/photos";
import { useFavorites } from "@/hooks/useFavorites";
import { useToast } from "@/hooks/use-toast";

export function CountryCard({ country: c }: { country: Country }) {
  const jp = japanVibe(c.slug);
  const visa = getVisaStatus(c.slug);
  const photoUrl = getPhotoUrl(c.name, 800, 500);
  
  const { isFavorite, toggle } = useFavorites();
  const saved = isFavorite(c.slug);
  const { toast } = useToast();

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(c.slug);
    toast({
       title: saved ? "Removed from Vault" : "Saved to Vault",
       description: `${c.name} has been ${saved ? 'removed from' : 'saved to'} your Discovery Vault.`,
       className: saved ? "bg-background" : "bg-accent text-white font-black border-accent"
    });
  };

  return (
    <Link to={`/country/${c.slug}`} className="glass-card hover-lift overflow-hidden group border-primary/5 flex flex-col h-full relative">
      <div className="aspect-[16/10] relative overflow-hidden shrink-0">
        <img 
          src={photoUrl} 
          alt={c.name}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
        
        {/* Discovery Vault Button */}
        <button 
          onClick={handleSave}
          className={`absolute top-3 left-3 h-8 w-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all border ${saved ? 'bg-accent/80 border-accent text-white shadow-glow' : 'bg-background/20 border-white/20 text-white hover:bg-background/40'}`}
        >
           <Heart className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} />
        </button>

        <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
          <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded bg-background/50 backdrop-blur-md border border-white/10 text-white">
            {c.region.split(',')[0]}
          </span>
          <span className={`text-[8px] font-black uppercase px-2 py-1 rounded border backdrop-blur-md ${getVisaTone(visa)}`}>
            {getVisaLabel(visa)}
          </span>
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between pointer-events-none">
           <div className="flex items-center gap-2.5">
              <Flag emoji={c.flag} size={28} className="shadow-lg border border-white/20" />
              <div>
                 <h3 className="font-display font-black text-base text-white leading-tight">{c.name}</h3>
                 <div className="text-[10px] font-bold text-white/70 uppercase tracking-tighter">
                    <Money usd={c.dailyCost} /> / day
                 </div>
              </div>
           </div>
           <div className="text-right">
              <div className="text-[10px] font-black text-accent uppercase tracking-widest">{jp}% JP</div>
           </div>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1 gap-3">
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed italic">{c.blurb}</p>
        <div className="mt-auto pt-2">
           <TerrainChips terrains={terrainsFor(c)} max={4} />
        </div>
      </div>
    </Link>
  );
}
