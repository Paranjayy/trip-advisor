import { Link, NavLink } from "react-router-dom";
import { Globe2, Heart, Map as MapIcon, Route } from "lucide-react";
import { CurrencySwitcher } from "@/components/CurrencySwitcher";
import { TranslateMenu } from "@/components/TranslateMenu";
import { ThemeToggle } from "@/components/ThemeToggle";

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
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <nav className="container mx-auto flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary shadow-glow group-hover:scale-105 transition-transform">
            <Globe2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight notranslate" translate="no">TripAdvisor</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => {
            const Icon = l.icon;
            return (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary-soft text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`
                }
              >
                {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
                {l.label}
              </NavLink>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <TranslateMenu />
          <CurrencySwitcher />
          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              `inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? "bg-accent-soft text-accent" : "text-muted-foreground hover:text-accent hover:bg-accent-soft"
              }`
            }
          >
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">Saved</span>
          </NavLink>
        </div>
      </nav>
    </header>
  );
}
