import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { Country } from "@/data/countries";

export function CostBreakdownChart({ country }: { country: Country }) {
  const data = [
    { name: "Flights", value: country.costBreakdown.flights, color: "hsl(var(--primary))" },
    { name: "Stay", value: country.costBreakdown.stay, color: "hsl(var(--accent))" },
    { name: "Food", value: country.costBreakdown.food, color: "hsl(var(--success))" },
    { name: "Transport", value: country.costBreakdown.transport, color: "hsl(var(--warn))" },
  ];
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
        <Tooltip
          cursor={{ fill: "hsl(var(--secondary))" }}
          contentStyle={{
            background: "hsl(var(--popover))",
            border: "1px solid hsl(var(--border))",
            borderRadius: 12,
            fontSize: 12,
          }}
          formatter={(v: number) => [`$${v}`, "USD"]}
        />
        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
          {data.map((d, i) => <Cell key={i} fill={d.color} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
