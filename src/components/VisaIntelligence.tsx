import { useState, useMemo } from "react";
import { Contact, Globe, Clock, CheckCircle, AlertTriangle, ShieldCheck } from "lucide-react";
import { Country } from "@/data/countries";
import { cn } from "@/lib/utils";

import { useUserSettings, Citizenship as CitizenshipType } from "@/lib/user-settings";
import { CITIZENSHIPS as PASSPORT_CITIZENSHIPS } from "@/lib/passport";

export function VisaIntelligence({ country }: { country: Country }) {
  const { citizenship: citizenshipSlug, setCitizenship: setCitizenshipSlug } = useUserSettings();
  
  const citizenship = useMemo(() => 
    PASSPORT_CITIZENSHIPS.find(c => c.value === citizenshipSlug) || PASSPORT_CITIZENSHIPS[0], 
  [citizenshipSlug]);

  const visaStatus = useMemo(() => {
    if (!country.visaInfo) return { type: "Unknown", color: "text-muted-foreground", icon: Globe, days: "?" };
    
    const info = country.visaInfo;
    if (info.freeFor.includes(citizenshipSlug)) {
      return { type: "Visa Free", color: "text-emerald-500", icon: CheckCircle, days: 0 };
    }
    if (info.onArrivalFor.includes(citizenshipSlug)) {
      return { type: "Visa on Arrival", color: "text-blue-500", icon: ShieldCheck, days: 1 };
    }
    if (info.eVisaFor.includes(citizenshipSlug)) {
      return { type: "e-Visa Required", color: "text-amber-500", icon: Clock, days: info.processingDays };
    }
    return { type: "Visa Required", color: "text-rose-500", icon: AlertTriangle, days: info.processingDays };
  }, [country, citizenshipSlug]);

  return (
    <div className="p-6 rounded-3xl bg-surface border border-border/40 shadow-xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Contact className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-display font-bold leading-none">Passport Power</h3>
            <p className="text-xs text-muted-foreground mt-1 text-balance">Entry intelligence for your citizenship</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-2 block">
            Select Citizenship
          </label>
          <div className="flex flex-wrap gap-2">
            {PASSPORT_CITIZENSHIPS.map((c) => (
              <button
                key={c.value}
                onClick={() => setCitizenshipSlug(c.value as CitizenshipType)}
                className={cn(
                  "px-3 py-2 rounded-xl border text-sm font-bold flex items-center gap-2 transition-all",
                  citizenshipSlug === c.value
                    ? "bg-primary text-primary-foreground border-primary shadow-glow"
                    : "bg-surface-muted border-border/40 text-muted-foreground hover:border-primary/40"
                )}
              >
                <span>{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface-muted/50 border border-border/20 flex items-start gap-4">
          <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center shrink-0", visaStatus.color.replace("text-", "bg-") + "/10")}>
            <visaStatus.icon className={cn("h-6 w-6", visaStatus.color)} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className={cn("text-lg font-black tracking-tight", visaStatus.color)}>{visaStatus.type}</p>
              {visaStatus.days > 0 && (
                <div className="px-2 py-1 rounded-lg bg-surface border border-border/40 flex items-center gap-1.5 shrink-0">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs font-bold">{visaStatus.days}d</span>
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              For <strong>{citizenship.name}</strong> citizens entering <strong>{country.name}</strong>.
            </p>
          </div>
        </div>

        {country.visaInfo?.notes && (
          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20">
             <p className="text-[10px] font-black uppercase text-primary mb-1">Pro Tip</p>
             <p className="text-xs text-muted-foreground leading-relaxed italic">
               "{country.visaInfo.notes}"
             </p>
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-border/40">
        <p className="text-[9px] text-muted-foreground leading-tight text-center uppercase tracking-tighter opacity-50 font-medium">
          Verified via Global Mobility Index • Data refreshed 2026
        </p>
      </div>
    </div>
  );
}
