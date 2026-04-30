import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, X } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { COUNTRIES, getCountry, MONTHS } from "@/data/countries";
import { MonthHeatmapStrip } from "@/components/MonthHeatmapStrip";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/lib/currency";
import { Money, MoneyRange } from "@/components/Money";
import { japanVibe } from "@/lib/japanVibe";

const Compare = () => {
  const { format } = useCurrency();
  useEffect(() => {
    document.title = "Compare countries — TripAdvisor";
  }, []);

  const [slots, setSlots] = useState<(string | null)[]>(["japan", "taiwan", "vietnam"]);

  const setSlot = (i: number, v: string | null) => {
    const next = [...slots];
    next[i] = v;
    setSlots(next);
  };

  const selected = slots.map((s) => (s ? getCountry(s) : undefined));

  const chartData = [
    { metric: "7-day low", ...Object.fromEntries(selected.map((c, i) => [`c${i}`, c?.costRange[0] ?? 0])) },
    { metric: "7-day high", ...Object.fromEntries(selected.map((c, i) => [`c${i}`, c?.costRange[1] ?? 0])) },
    { metric: "Daily", ...Object.fromEntries(selected.map((c, i) => [`c${i}`, c?.dailyCost ?? 0])) },
    { metric: "Flight low", ...Object.fromEntries(selected.map((c, i) => [`c${i}`, c?.flightCostRange[0] ?? 0])) },
  ];
  const colors = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--success))"];

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <div className="container mx-auto py-10">
        <header className="mb-8">
          <p className="text-xs uppercase tracking-wider text-primary font-semibold mb-1">Compare</p>
          <h1 className="font-display text-4xl font-bold">Side-by-side comparison</h1>
          <p className="text-muted-foreground mt-2">Pick up to 3 countries to compare cost, timing, and vibe.</p>
        </header>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {slots.map((slug, i) => (
            <div key={i} className="glass-card p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Slot {i + 1}</span>
                {slug && (
                  <button onClick={() => setSlot(i, null)} className="text-muted-foreground hover:text-destructive">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <Select value={slug ?? ""} onValueChange={(v) => setSlot(i, v)}>
                <SelectTrigger className="bg-surface">
                  <SelectValue placeholder={<span className="flex items-center gap-1.5"><Plus className="h-4 w-4" />Add country</span>} />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((c) => (
                    <SelectItem key={c.slug} value={c.slug}>{c.flag} {c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>

        {selected.some(Boolean) && (
          <>
            {/* Comparison table */}
            <div className="glass-card p-6 overflow-x-auto mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 pr-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Metric</th>
                    {selected.map((c, i) => (
                      <th key={i} className="text-left py-3 px-4">
                        {c ? (
                          <Link to={`/country/${c.slug}`} className="font-display text-base font-bold hover:text-primary">
                            {c.flag} {c.name}
                          </Link>
                        ) : <span className="text-muted-foreground italic">—</span>}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <Row label="Region" cells={selected.map((c) => c?.region)} />
                  <Row label="7-day cost" cells={selected.map((c) => c && <MoneyRange range={c.costRange} />)} highlight />
                  <Row label="Daily cost" cells={selected.map((c) => c && <Money usd={c.dailyCost} />)} />
                  <Row label="Flights" cells={selected.map((c) => c && <MoneyRange range={c.flightCostRange} />)} />
                  <Row label="Vegetarian" cells={selected.map((c) => c && c.vegScore)} />
                  <Row label="Japan similarity" cells={selected.map((c) => c && `${japanVibe(c.slug)}/100`)} highlight />
                  <Row label="Vibe" cells={selected.map((c) => c && c.vibe)} />
                  <Row label="Tourists / yr" cells={selected.map((c) => c && `${c.touristCount}M`)} />
                  <Row label="Best months" cells={selected.map((c) => c?.bestMonths.map((m) => MONTHS[m - 1].slice(0, 3)).join(", "))} />
                  <Row label="Cheapest" cells={selected.map((c) => c?.cheapestMonths.map((m) => MONTHS[m - 1].slice(0, 3)).join(", "))} />
                </tbody>
              </table>
            </div>

            {/* Cost chart */}
            <div className="glass-card p-6 mb-6">
              <h2 className="font-display text-xl font-bold mb-4">Cost comparison</h2>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={chartData}>
                  <XAxis dataKey="metric" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => format(v as number)} />
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }}
                    formatter={(v: number, name) => {
                      const idx = parseInt(String(name).slice(1));
                      const c = selected[idx];
                      return [format(v), c?.name ?? ""];
                    }}
                  />
                  <Legend formatter={(value) => selected[parseInt(value.slice(1))]?.name ?? value} />
                  {selected.map((c, i) => c && <Bar key={i} dataKey={`c${i}`} fill={colors[i]} radius={[6, 6, 0, 0]} />)}
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Heatmaps */}
            <div className="grid md:grid-cols-3 gap-4">
              {selected.map((c, i) => c && (
                <div key={i} className="glass-card p-5">
                  <h3 className="font-display font-bold mb-3">{c.flag} {c.name} — by month</h3>
                  <MonthHeatmapStrip monthlyPriceIndex={c.monthlyPriceIndex} bestMonths={c.bestMonths} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

function Row({ label, cells, highlight }: { label: string; cells: React.ReactNode[]; highlight?: boolean }) {
  return (
    <tr className={cn("border-b border-border/40", highlight && "bg-primary-soft/30")}>
      <td className="py-3 pr-4 text-muted-foreground font-medium">{label}</td>
      {cells.map((v, i) => (
        <td key={i} className="py-3 px-4 capitalize">{v ?? <span className="text-muted-foreground/50">—</span>}</td>
      ))}
    </tr>
  );
}

export default Compare;
