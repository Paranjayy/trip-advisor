import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, Globe2, Heart, Map as MapIcon, Route, ChevronRight, Zap, Image as ImageIcon, Shuffle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CurrencySwitcher } from "@/components/CurrencySwitcher";
import { TranslateMenu } from "@/components/TranslateMenu";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SettingsMenu } from "@/components/SettingsMenu";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GlobalPulse } from "./GlobalPulse";
import { ITINERARIES } from "@/lib/itineraries";
import { useToast } from "@/hooks/use-toast";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/explore", label: "Explore" },
  { to: "/map", label: "Map", icon: MapIcon },
  { to: "/itinerary", label: "Trips", icon: Route },
  { to: "/gallery", label: "Gallery", icon: ImageIcon },
  { to: "/planner", label: "Planner" },
  { to: "/compare", label: "Compare" },
];

export function SiteNav() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRandomTrip = () => {
    const random = ITINERARIES[Math.floor(Math.random() * ITINERARIES.length)];
    toast({ 
      title: "Taking you anywhere...", 
      description: `Exploring: ${random.title}`,
      className: "bg-primary text-white font-black"
    });
    navigate(`/itinerary/${random.slug}`);
  };

  return (
    <header className="sticky top-0 z-50">
      <div className="border-b border-border/60 bg-background/80 backdrop-blur-md">
        <nav className="container-fluid mx-auto flex h-20 items-center justify-between gap-8 px-6 lg:px-12">
          <div className="flex items-center gap-10 min-w-0">
            <Link to="/" className="flex items-center gap-3 group shrink-0">
              <div className="grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-2xl bg-gradient-primary shadow-glow group-hover:scale-110 transition-all duration-500">
                <Globe2 className="h-6 w-6 sm:h-7 sm:w-7 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-xl sm:text-2xl font-black tracking-tighter leading-none">TripAdvisor</span>
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary/60 mt-0.5 hidden sm:block">Travel Engine</span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-1.5 p-1.5 bg-secondary/30 rounded-2xl border border-border/40 overflow-hidden">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  className={({ isActive }) =>
                    cn(
                      "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] xl:text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                      isActive
                        ? "bg-primary text-white shadow-glow translate-y-[-1px]"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    )
                  }
                >
                  {l.icon && <l.icon className="h-4 w-4" />}
                  <span className="hidden xl:inline">{l.label}</span>
                  <span className="xl:hidden">{l.label.charAt(0)}</span>
                </NavLink>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <div className="hidden md:flex items-center gap-1.5 border-r border-border/40 pr-4 mr-2">
               <button 
                  onClick={handleRandomTrip}
                  title="Take me anywhere (Randomize)"
                  className="h-11 w-11 rounded-2xl flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all group"
               >
                  <Shuffle className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
               </button>
               <div className="flex items-center gap-1 bg-surface-muted/50 rounded-2xl p-1 border border-border/40">
                  <SettingsMenu />
                  <ThemeToggle />
                  <TranslateMenu />
                  <CurrencySwitcher />
               </div>
            </div>
            
            <NavLink
              to="/favorites"
              className={({ isActive }) =>
                cn(
                  "inline-flex items-center gap-3 h-11 px-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all",
                  isActive ? "bg-accent text-white shadow-glow" : "text-muted-foreground hover:text-accent hover:bg-accent/5 border border-transparent hover:border-accent/20"
                )
              }
            >
              <Heart className="h-4 w-4 fill-current" />
              <span className="hidden 2xl:inline">Discovery Vault</span>
            </NavLink>

            <Button variant="ghost" size="icon" className="lg:hidden rounded-2xl h-11 w-11 bg-secondary/50 shrink-0 border border-border/40" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </nav>
      </div>
      <GlobalPulse />

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-md z-[51]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="lg:hidden fixed inset-y-0 right-0 w-full max-w-sm bg-background border-l border-border/60 p-8 flex flex-col gap-8 z-[52] shadow-2xl"
            >
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
                       <Globe2 className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex flex-col">
                       <span className="font-display text-xl font-black leading-tight">TripAdvisor</span>
                       <span className="text-[8px] font-black uppercase tracking-widest text-primary/60">Build v1.5.8-GOATED</span>
                    </div>
                 </div>
                 <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full h-10 w-10 hover:bg-secondary">
                    <X className="h-5 w-5" />
                 </Button>
              </div>
              
              <div className="space-y-2">
                {links.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    end={l.end}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center justify-between p-4 rounded-2xl text-base font-black transition-all",
                        isActive ? "bg-primary text-white shadow-glow" : "text-muted-foreground hover:bg-secondary"
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-4">
                           {l.icon && <l.icon className="h-5 w-5" />}
                           {l.label}
                        </div>
                        <ChevronRight className={cn("h-5 w-5 transition-transform", isActive ? "rotate-90" : "opacity-20")} />
                      </>
                    )}
                  </NavLink>
                ))}
                <button 
                  onClick={() => { setIsOpen(false); handleRandomTrip(); }}
                  className="flex items-center justify-between p-4 rounded-2xl text-base font-black transition-all text-accent hover:bg-accent/5 w-full"
                >
                   <div className="flex items-center gap-4">
                      <Shuffle className="h-5 w-5" />
                      Take me anywhere
                   </div>
                   <Zap className="h-4 w-4 animate-pulse" />
                </button>
              </div>

              <div className="mt-auto space-y-6">
                 <div className="grid grid-cols-2 gap-3">
                    <MobileAction icon={<SettingsMenu />} label="Settings" />
                    <MobileAction icon={<ThemeToggle />} label="Appearance" />
                    <MobileAction icon={<TranslateMenu />} label="Language" />
                    <MobileAction icon={<CurrencySwitcher />} label="Currency" />
                 </div>
                 <Button className="w-full h-14 rounded-2xl font-black text-lg gap-3 shadow-glow" onClick={() => setIsOpen(false)}>
                    <Zap className="h-5 w-5" /> CLOSE NAV ENGINE
                 </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

function MobileAction({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="glass-card p-4 flex flex-col items-center gap-2 border-border/40 hover:border-primary/20 transition-colors">
       <div className="h-8 w-8 flex items-center justify-center">{icon}</div>
       <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{label}</span>
    </div>
  );
}
