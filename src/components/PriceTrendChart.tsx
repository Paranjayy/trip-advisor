import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine } from "recharts";
import { Country, MONTHS } from "@/data/countries";

export function PriceTrendChart({ country }: { country: Country }) {
  const data = country.monthlyPriceIndex.map((v, i) => ({ month: MONTHS[i], index: v }));
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} domain={[60, 150]} />
        <ReferenceLine y={100} stroke="hsl(var(--border))" strokeDasharray="3 3" />
        <Tooltip
          contentStyle={{
            background: "hsl(var(--popover))",
            border: "1px solid hsl(var(--border))",
            borderRadius: 12,
            fontSize: 12,
          }}
          formatter={(v: number) => [`Index ${v}`, "Price"]}
        />
        <Line
          type="monotone"
          dataKey="index"
          stroke="hsl(var(--primary))"
          strokeWidth={3}
          dot={{ r: 4, fill: "hsl(var(--primary))" }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
