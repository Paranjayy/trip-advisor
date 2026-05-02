import { Link, NavLink } from "react-router-dom";
import { Menu, X, Globe2, Heart, Map as MapIcon, Route, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CurrencySwitcher } from "@/components/CurrencySwitcher";
import { TranslateMenu } from "@/components/TranslateMenu";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SettingsMenu } from "@/components/SettingsMenu";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/explore", label: "Explore" },
  { to: "/map", label: "Map", icon: MapIcon },
  { to: "/itinerary", label: "Trips", icon: Route },
  { to: "/planner", label: "Planner" },
  { to: "/compare", label: "Compare" },
  { to: "/timing", label: "Timing" },
];

export function SiteNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <nav className="container mx-auto flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <Link to="/" className="flex items-center gap-2 group">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary shadow-glow group-hover:scale-105 transition-transform">
              <Globe2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold tracking-tight notranslate" translate="no">TripAdvisor</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                cn(
                  "inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary-soft text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )
              }
            >
              {l.icon && <l.icon className="h-3.5 w-3.5" />}
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2">
             <SettingsMenu />
             <ThemeToggle />
             <TranslateMenu />
             <CurrencySwitcher />
          </div>
          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              cn(
                "inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive ? "bg-accent-soft text-accent" : "text-muted-foreground hover:text-accent hover:bg-accent-soft"
              )
            }
          >
            <Heart className="h-4 w-4" />
            <span className="hidden lg:inline">Saved</span>
          </NavLink>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="md:hidden fixed inset-0 bg-background/60 backdrop-blur-sm z-[51]"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="md:hidden fixed inset-y-0 left-0 w-3/4 max-w-xs bg-background border-r border-border/60 p-6 flex flex-col gap-6 z-[52] shadow-2xl"
            >
              <div className="flex items-center gap-2 mb-4">
                 <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                    <Globe2 className="h-4 w-4 text-white" />
                 </div>
                 <span className="font-display font-bold">TripAdvisor</span>
              </div>
              
              <div className="space-y-1">
                {links.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    end={l.end}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center justify-between p-3 rounded-xl text-sm font-bold transition-all",
                        isActive ? "bg-primary text-primary-foreground shadow-glow" : "text-muted-foreground hover:bg-secondary"
                      )
                    }
                  >
                    <div className="flex items-center gap-3">
                       {l.icon && <l.icon className="h-4 w-4" />}
                       {l.label}
                    </div>
                    <ChevronRight className="h-4 w-4 opacity-40" />
                  </NavLink>
                ))}
              </div>

              <div className="mt-auto space-y-4 pt-6 border-t border-border/60">
                 <div className="grid grid-cols-2 gap-2">
                    <div className="glass-card p-2 flex justify-center"><SettingsMenu /></div>
                    <div className="glass-card p-2 flex justify-center"><ThemeToggle /></div>
                    <div className="glass-card p-2 flex justify-center"><TranslateMenu /></div>
                    <div className="glass-card p-2 flex justify-center"><CurrencySwitcher /></div>
                 </div>
                 <Button variant="outline" className="w-full h-12 rounded-xl text-xs font-black uppercase tracking-widest" onClick={() => setIsOpen(false)}>
                    Close Menu
                 </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
