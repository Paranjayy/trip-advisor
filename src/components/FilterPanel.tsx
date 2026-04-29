import { Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { REGIONS } from "@/data/countries";
import { Filters } from "@/lib/recommend";

type Props = {
  filters: Filters;
  setFilters: (f: Filters) => void;
  layout?: "horizontal" | "sidebar";
};

export function FilterPanel({ filters, setFilters, layout = "horizontal" }: Props) {
  const update = <K extends keyof Filters>(k: K, v: Filters[K]) => setFilters({ ...filters, [k]: v });

  const isSidebar = layout === "sidebar";

  return (
    <div className={isSidebar ? "space-y-6" : "grid gap-5 md:grid-cols-2 lg:grid-cols-4"}>
      <div className={isSidebar ? "" : "lg:col-span-2"}>
        <Label className="text-xs font-medium text-muted-foreground">Search</Label>
        <div className="relative mt-1.5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={filters.query}
            onChange={(e) => update("query", e.target.value)}
            placeholder="Country, region, or tag…"
            className="pl-9 bg-surface"
          />
        </div>
      </div>

      <div>
        <Label className="text-xs font-medium text-muted-foreground">Region</Label>
        <Select value={filters.region} onValueChange={(v) => update("region", v)}>
          <SelectTrigger className="mt-1.5 bg-surface"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All regions</SelectItem>
            {REGIONS.map((r) => (
              <SelectItem key={r} value={r}>{r}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-xs font-medium text-muted-foreground">Vibe</Label>
        <Select value={filters.vibe} onValueChange={(v) => update("vibe", v as Filters["vibe"])}>
          <SelectTrigger className="mt-1.5 bg-surface"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any vibe</SelectItem>
            <SelectItem value="chill">Chill</SelectItem>
            <SelectItem value="adventure">Adventure</SelectItem>
            <SelectItem value="balanced">Balanced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className={isSidebar ? "" : "lg:col-span-2"}>
        <div className="flex justify-between items-baseline">
          <Label className="text-xs font-medium text-muted-foreground">Max 7-day budget</Label>
          <span className="text-sm font-semibold text-primary">${filters.budgetMax}</span>
        </div>
        <Slider
          value={[filters.budgetMax]}
          min={500}
          max={3500}
          step={100}
          onValueChange={(v) => update("budgetMax", v[0])}
          className="mt-3"
        />
      </div>

      <div className="flex items-center justify-between rounded-xl bg-surface-muted px-4 py-3">
        <Label htmlFor="veg" className="text-sm font-medium cursor-pointer">Vegetarian-friendly</Label>
        <Switch id="veg" checked={filters.vegFriendly} onCheckedChange={(v) => update("vegFriendly", v)} />
      </div>

      <div className="flex items-center justify-between rounded-xl bg-primary-soft/60 px-4 py-3">
        <Label htmlFor="jp" className="text-sm font-medium cursor-pointer flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> Japan-like vibe
        </Label>
        <Switch id="jp" checked={filters.japanLike} onCheckedChange={(v) => update("japanLike", v)} />
      </div>
    </div>
  );
}
