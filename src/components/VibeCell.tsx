import React from "react";
import { Link } from "react-router-dom";
import { Flag } from "@/components/Flag";
import { Money } from "@/components/Money";
import { type Country } from "@/data/countries";
import { japanVibe } from "@/lib/japanVibe";
import { terrainsFor } from "@/lib/terrains";
import { getVisaStatus, getVisaLabel, getVisaTone } from "@/lib/passport";
import { getPhotoUrl } from "@/lib/photos";

export function VibeCell({ country: c }: { country: Country }) {
  const jp = japanVibe(c.slug);
  const visa = getVisaStatus(c.slug);
  const photoUrl = getPhotoUrl(c.name, 400, 250);
  
  return (
    <Link to={`/country/${c.slug}`} className="glass-card p-0 overflow-hidden hover-lift group border-primary/10 flex flex-col h-full">
       <div className="h-32 relative overflow-hidden shrink-0">
          <img src={photoUrl} alt={c.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
          <div className="absolute top-2 right-2">
             <span className={`text-[7px] font-black uppercase px-1.5 py-0.5 rounded border backdrop-blur-md ${getVisaTone(visa)}`}>
               {getVisaLabel(visa)}
             </span>
          </div>
          <div className="absolute bottom-2 left-3 flex items-center gap-2">
             <Flag emoji={c.flag} size={18} />
             <h3 className="font-display font-bold text-xs group-hover:text-primary transition-colors text-white">{c.name}</h3>
          </div>
       </div>
       
       <div className="p-4 space-y-3 flex-1 flex flex-col">
          <div className="space-y-1">
             <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-muted-foreground">
                <span>Daily Cost</span>
                <Money usd={c.dailyCost} />
             </div>
             <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${Math.min(100, (c.dailyCost / 300) * 100)}%` }} />
             </div>
          </div>
          
          <div className="space-y-1">
             <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-muted-foreground">
                <span>Japan Similarity</span>
                <span>{jp}%</span>
             </div>
             <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-accent" style={{ width: `${jp}%` }} />
             </div>
          </div>

          <div className="space-y-1 mt-auto pt-2">
             <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-muted-foreground">
                <span>Variety</span>
                <span>{terrainsFor(c).length}/8</span>
             </div>
             <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-success" style={{ width: `${(terrainsFor(c).length / 8) * 100}%` }} />
             </div>
          </div>
       </div>
    </Link>
  );
}
