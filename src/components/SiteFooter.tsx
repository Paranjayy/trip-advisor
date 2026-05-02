import React from "react";
import { Link } from "react-router-dom";
import { Globe2, Github, Twitter, Instagram, Mail, ArrowUpRight, Zap, Shield } from "lucide-react";
import { Flag } from "./Flag";

export function SiteFooter() {
  return (
    <footer className="bg-surface-muted/30 border-t border-border/60 pt-20 pb-10 mt-auto">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary shadow-glow group-hover:scale-105 transition-transform">
                <Globe2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-black tracking-tighter">TripAdvisor</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The goated travel discovery engine for high-recovery base camps and high-velocity road trips. Built for the modern nomad.
            </p>
            <div className="flex gap-4">
               <SocialLink href="#" icon={<Github className="h-5 w-5" />} />
               <SocialLink href="#" icon={<Twitter className="h-5 w-5" />} />
               <SocialLink href="#" icon={<Instagram className="h-5 w-5" />} />
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary mb-8">Navigation</h4>
            <ul className="space-y-4">
               <FooterLink to="/explore" label="Explore Matrix" />
               <FooterLink to="/map" label="Global Map" />
               <FooterLink to="/itinerary" label="Curated Trips" />
               <FooterLink to="/planner" label="Trip Planner" />
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary mb-8">Intelligence</h4>
            <ul className="space-y-4">
               <FooterLink to="/compare" label="Cost Comparison" />
               <FooterLink to="/timing" label="Seasonality Engine" />
               <FooterLink to="/favorites" label="Saved Discovery" />
               <FooterLink to="/settings" label="Agent Settings" />
            </ul>
          </div>

          <div className="glass-card p-6 border-primary/10 bg-primary/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
               <Zap className="h-12 w-12 text-primary" />
            </div>
            <h4 className="text-[11px] font-black uppercase tracking-widest text-primary mb-2">Vault Status</h4>
            <div className="flex items-center gap-2 mb-4">
               <Shield className="h-4 w-4 text-emerald-500" />
               <span className="text-xs font-bold text-foreground">Cloud Sync Active</span>
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed mb-4 italic">
               Your travel lineage and itineraries are securely encrypted and synced across all nodes.
            </p>
            <div className="flex items-center gap-2">
               <Flag emoji="🇮🇳" size={16} />
               <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Server Node: IN-WEST-1</span>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-6">
           <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              © 2026 TRIPADVISOR ENGINE — BUILT BY PARANJAY
           </p>
            <div className="flex flex-wrap items-center gap-4 sm:gap-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
               <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-border/40 text-primary">
                  <Zap className="h-3 w-3" />
                  BUILD: v1.5.8-GOATED
               </div>
               <div className="hidden sm:block opacity-40">|</div>
               <div className="flex items-center gap-2">
                  <Github className="h-3 w-3" />
                  HASH: {Math.random().toString(36).substring(7).toUpperCase()}
               </div>
               <a href="#" className="hover:text-primary transition-colors">Privacy Protocol</a>
               <a href="#" className="hover:text-primary transition-colors">Usage Terms</a>
            </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ to, label }: { to: string; label: string }) {
  return (
    <li>
      <Link to={to} className="group flex items-center justify-between text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
         {label}
         <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-40 transition-all -translate-y-1 translate-x-1" />
      </Link>
    </li>
  );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a href={href} className="h-10 w-10 rounded-xl bg-surface-muted border border-border/40 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all shadow-sm">
      {icon}
    </a>
  );
}
