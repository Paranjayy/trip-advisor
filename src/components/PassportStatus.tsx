import { useState, useEffect } from "react";
import { Globe, ShieldCheck, AlertCircle, Info, ChevronDown, CheckCircle2 } from "lucide-react";
import { getVisaStatus, CITIZENSHIPS, VisaStatus } from "@/lib/passport";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const STATUS_META: Record<VisaStatus, { label: string; color: string; icon: any; blurb: string }> = {
  "visa-free": { 
    label: "Visa Free", 
    color: "text-green-500 bg-green-500/10 border-green-500/20", 
    icon: CheckCircle2,
    blurb: "Pack your bags and go. No paperwork needed."
  },
  "e-visa": { 
    label: "E-Visa", 
    color: "text-blue-500 bg-blue-500/10 border-blue-500/20", 
    icon: Info,
    blurb: "Apply online before flying. Usually approved in 72 hours."
  },
  "visa-on-arrival": { 
    label: "Visa on Arrival", 
    color: "text-orange-500 bg-orange-500/10 border-orange-500/20", 
    icon: ShieldCheck,
    blurb: "Pay at the airport. Have cash and photos ready."
  },
  "visa-required": { 
    label: "Visa Required", 
    color: "text-red-500 bg-red-500/10 border-red-500/20", 
    icon: AlertCircle,
    blurb: "Requires an embassy visit or paper application."
  }
};

export function PassportStatus({ destinationSlug }: { destinationSlug: string }) {
  const [citizenship, setCitizenship] = useState(() => localStorage.getItem("user-citizenship") || "india");

  useEffect(() => {
    localStorage.setItem("user-citizenship", citizenship);
  }, [citizenship]);

  const { status, duration } = getVisaStatus(citizenship, destinationSlug);
  const meta = STATUS_META[status];
  const Icon = meta.icon;

  return (
    <div className="glass-card p-5 border-accent/20 bg-accent/5 overflow-hidden relative">
       <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Globe className="h-16 w-16" />
       </div>
       
       <div className="flex flex-wrap items-center justify-between gap-4 mb-6 relative z-10">
          <div>
             <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 mb-1">
                <Globe className="h-3 w-3" /> Passport Power
             </h3>
             <p className="text-sm font-bold text-foreground">Check your visa status</p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 rounded-lg text-xs font-bold gap-2 bg-background/50 border-border/40 hover:bg-background">
                {CITIZENSHIPS.find(c => c.value === citizenship)?.label}
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-background/95 backdrop-blur-xl border-border/40">
              {CITIZENSHIPS.map((c) => (
                <DropdownMenuItem 
                   key={c.value} 
                   onClick={() => setCitizenship(c.value)}
                   className="text-xs font-bold focus:bg-primary/10 focus:text-primary transition-colors"
                >
                  {c.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
       </div>

       <div className={cn("p-4 rounded-2xl border transition-all duration-500 flex items-start gap-4", meta.color)}>
          <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
             <Icon className="h-6 w-6" />
          </div>
          <div className="flex-1">
             <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-black uppercase tracking-tight">{meta.label}</p>
                {duration > 0 && <span className="text-[10px] font-black">{duration} Days Max</span>}
             </div>
             <p className="text-xs leading-relaxed opacity-80">{meta.blurb}</p>
          </div>
       </div>
       
       <div className="mt-4 flex items-center gap-2 px-1">
          <div className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Live Passport Integration Active</p>
       </div>
    </div>
  );
}
