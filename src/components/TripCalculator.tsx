import React, { useMemo, useState } from "react";
import { Calculator } from "lucide-react";
import { Country, MONTHS } from "@/data/countries";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Money } from "@/components/Money";
import { useCurrency } from "@/lib/currency";

type Style = "budget" | "mid" | "luxury";
const STYLE_MULT: Record<Style, number> = { budget: 0.65, mid: 1, luxury: 1.7 };

export function TripCalculator({ country }: { country: Country }) {
  const [days, setDays] = useState(7);
  const [travelers, setTravelers] = useState(1);
  const [style, setStyle] = useState<Style>("mid");
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [includeFlights, setIncludeFlights] = useState(true);
  const { format, currency } = useCurrency();

  const breakdown = useMemo(() => {
    const idx = country.monthlyPriceIndex[month - 1] / 100; // ~0.7 .. 1.4
    const m = STYLE_MULT[style];
    const dailyStay = (country.costBreakdown.stay / 7) * idx * m;
    const dailyFood = (country.costBreakdown.food / 7) * idx * m;
    const dailyTransport = (country.costBreakdown.transport / 7) * idx * m;
    const dailyActivities = country.dailyCost * 0.15 * m * idx;
    const stay = dailyStay * days * travelers;
    const food = dailyFood * days * travelers;
    const transport = dailyTransport * days * travelers;
    const activities = dailyActivities * days * travelers;
    const flights = includeFlights ? country.costBreakdown.flights * travelers : 0;
    const total = stay + food + transport + activities + flights;
    return { stay, food, transport, activities, flights, total };
  }, [country, days, travelers, style, month, includeFlights]);

  const rows: { label: string; value: number; color: string }[] = [
    { label: "Stay",       value: breakdown.stay,       color: "bg-primary" },
    { label: "Food",       value: breakdown.food,       color: "bg-success" },
    { label: "Transport",  value: breakdown.transport,  color: "bg-warn" },
    { label: "Activities", value: breakdown.activities, color: "bg-accent" },
    { label: "Flights",    value: breakdown.flights,    color: "bg-secondary-foreground" },
  ].filter((r) => r.value > 0);
  const max = Math.max(...rows.map((r) => r.value));

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <Calculator className="h-5 w-5 text-primary" />
        <h2 className="font-display text-xl font-bold">Trip price calculator</h2>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Days" value={`${days}`}>
          <Slider value={[days]} min={1} max={30} step={1} onValueChange={(v) => setDays(v[0])} />
        </Field>
        <Field label="Travelers" value={`${travelers}`}>
          <Slider value={[travelers]} min={1} max={8} step={1} onValueChange={(v) => setTravelers(v[0])} />
        </Field>
        <div>
          <label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Style</label>
          <Select value={style} onValueChange={(v) => setStyle(v as Style)}>
            <SelectTrigger className="mt-2 bg-surface"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="budget">Budget · backpacker</SelectItem>
              <SelectItem value="mid">Mid-range · comfy</SelectItem>
              <SelectItem value="luxury">Luxury · spoil me</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Travel month</label>
          <Select value={String(month)} onValueChange={(v) => setMonth(Number(v))}>
            <SelectTrigger className="mt-2 bg-surface"><SelectValue /></SelectTrigger>
            <SelectContent>
              {MONTHS.map((m, i) => <SelectItem key={i} value={String(i + 1)}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <label className="flex items-center justify-between rounded-xl bg-surface-muted px-4 py-3 cursor-pointer">
        <span className="text-sm font-medium">Include international flights</span>
        <Switch checked={includeFlights} onCheckedChange={setIncludeFlights} />
      </label>

      <div className="rounded-2xl bg-gradient-hero p-5 border border-border/60">
        <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Total estimate · {currency}</div>
        <div className="font-display text-4xl font-extrabold text-primary mt-1">
          <Money usd={breakdown.total} />
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          ≈ <Money usd={breakdown.total / Math.max(1, days * travelers)} /> per person per day
        </div>

        <div className="space-y-2 mt-4">
          {rows.map((r) => (
            <div key={r.label} className="flex items-center gap-2 text-xs">
              <div className="w-20 text-muted-foreground">{r.label}</div>
              <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                <div className={`h-full ${r.color}`} style={{ width: `${(r.value / max) * 100}%` }} />
              </div>
              <div className="w-20 text-right font-semibold tabular-nums">{format(r.value)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, children }: { label: string; value: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex justify-between text-xs uppercase tracking-wider font-semibold text-muted-foreground">
        <span>{label}</span>
        <span className="text-foreground normal-case tracking-normal font-bold">{value}</span>
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}
