import { MONTHS } from "@/data/countries";

type Props = {
  monthlyPriceIndex: number[];
  bestMonths?: number[];
};

/** Compact 12-month price strip. Greens = cheap, amber = peak. */
export function MonthHeatmapStrip({ monthlyPriceIndex, bestMonths = [] }: Props) {
  return (
    <div className="grid grid-cols-12 gap-1">
      {monthlyPriceIndex.map((v, i) => {
        const m = i + 1;
        const isBest = bestMonths.includes(m);
        const cls =
          v < 85
            ? "bg-success/80 text-white"
            : v > 120
            ? "bg-warn/80 text-white"
            : "bg-secondary text-secondary-foreground";
        return (
          <div key={i} className="flex flex-col items-center gap-1">
            <div
              className={`relative h-9 w-full rounded-md grid place-items-center text-[10px] font-semibold ${cls}`}
              title={`${MONTHS[i]}: index ${v}`}
            >
              {v}
              {isBest && <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-accent ring-2 ring-background" />}
            </div>
            <span className="text-[10px] text-muted-foreground">{MONTHS[i].slice(0, 1)}</span>
          </div>
        );
      })}
    </div>
  );
}
