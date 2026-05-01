import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUp } from "lucide-react";
import type { Country } from "@/data/countries";
import { Money, MoneyRange } from "@/components/Money";
import { TerrainChips } from "@/components/TerrainChips";
import { Flag } from "@/components/Flag";
import { terrainsFor, difficultyFor, DIFFICULTY_META } from "@/lib/terrains";
import { japanVibe } from "@/lib/japanVibe";
import { cn } from "@/lib/utils";

type Key = "name" | "region" | "daily" | "week" | "flights" | "jp" | "difficulty";

export function CountryTable({ countries }: { countries: Country[] }) {
  const [sort, setSort] = useState<Key>("jp");
  const [dir, setDir] = useState<1 | -1>(-1);

  const rows = useMemo(() => {
    const arr = [...countries];
    arr.sort((a, b) => {
      const v = (c: Country) => {
        switch (sort) {
          case "name": return c.name;
          case "region": return c.region;
          case "daily": return c.dailyCost;
          case "week": return c.costRange[0];
          case "flights": return c.flightCostRange[0];
          case "jp": return japanVibe(c.slug);
          case "difficulty": return ["easy","moderate","hard"].indexOf(difficultyFor(c));
        }
      };
      const av = v(a) as number | string;
      const bv = v(b) as number | string;
      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;
      return 0;
    });
    return arr;
  }, [countries, sort, dir]);

  const click = (k: Key) => () => {
    if (k === sort) setDir((d) => (d === 1 ? -1 : 1));
    else { setSort(k); setDir(k === "name" || k === "region" ? 1 : -1); }
  };

  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-surface-muted text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <Th k="name" sort={sort} dir={dir} onClick={click("name")}>Country</Th>
              <Th k="region" sort={sort} dir={dir} onClick={click("region")}>Region</Th>
              <Th k="daily" sort={sort} dir={dir} onClick={click("daily")} className="text-right">Daily</Th>
              <Th k="jp" sort={sort} dir={dir} onClick={click("jp")} className="text-right">JP vibe</Th>
              <th className="px-3 py-3 text-left">Friction</th>
              <th className="px-3 py-3 text-left">Pulse</th>
              <th className="px-3 py-3 text-left">Variety</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => {
              const d = difficultyFor(c);
              const friction = c.dailyCost > 200 || d === "hard" ? 85 : d === "moderate" ? 45 : 20;
              return (
                <tr key={c.slug} className="border-t border-border/50 hover:bg-secondary/40">
                  <td className="px-3 py-2.5">
                    <Link to={`/country/${c.slug}`} className="flex items-center gap-2 font-semibold hover:text-primary">
                      <Flag emoji={c.flag} size={22} />{c.name}
                    </Link>
                  </td>
                  <td className="px-3 py-2.5 text-muted-foreground">{c.region}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums"><Money usd={c.dailyCost} /></td>
                  <td className="px-3 py-2.5 text-right font-bold text-primary tabular-nums">{japanVibe(c.slug)}</td>
                  <td className="px-3 py-2.5">
                     <div className="flex items-center gap-2">
                        <div className="h-1 w-12 rounded-full bg-border/40 overflow-hidden">
                           <div 
                              className={cn(
                                 "h-full rounded-full transition-all duration-1000",
                                 friction > 70 ? "bg-red-500" : friction > 40 ? "bg-orange-500" : "bg-green-500"
                              )} 
                              style={{ width: `${friction}%` }} 
                           />
                        </div>
                        <span className="text-[9px] font-black opacity-60">{friction}%</span>
                     </div>
                  </td>
                  <td className="px-3 py-2.5">
                     <div className="flex items-center gap-2">
                        <div className={cn("h-1.5 w-1.5 rounded-full animate-pulse", friction < 50 ? "bg-green-500" : "bg-blue-500")} />
                        <span className="text-[9px] font-bold uppercase opacity-60 tracking-tighter">Stable</span>
                     </div>
                  </td>
                  <td className="px-3 py-2.5"><TerrainChips terrains={terrainsFor(c)} max={3} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children, k, sort, dir, onClick, className }: {
  children: React.ReactNode; k: Key; sort: Key; dir: 1 | -1; onClick: () => void; className?: string;
}) {
  const active = sort === k;
  return (
    <th className={cn("px-3 py-3 text-left font-semibold cursor-pointer select-none", className)} onClick={onClick}>
      <span className={cn("inline-flex items-center gap-1", active && "text-primary")}>
        {children}
        {active && (dir === 1 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
      </span>
    </th>
  );
}
