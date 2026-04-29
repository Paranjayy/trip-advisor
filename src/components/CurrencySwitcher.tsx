import { Coins } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CURRENCY_META, SUPPORTED_CURRENCIES, useCurrency } from "@/lib/currency";

export function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();
  const meta = CURRENCY_META[currency];
  return (
    <Select value={currency} onValueChange={setCurrency}>
      <SelectTrigger
        aria-label="Select currency"
        className="h-9 w-auto gap-2 rounded-lg border-border/60 bg-background px-3 text-sm font-medium"
      >
        <Coins className="h-3.5 w-3.5 text-muted-foreground" />
        <SelectValue>
          <span className="hidden sm:inline">{meta?.flag} </span>{currency}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="max-h-80">
        {SUPPORTED_CURRENCIES.map((code) => {
          const m = CURRENCY_META[code];
          return (
            <SelectItem key={code} value={code}>
              <span className="mr-1.5">{m.flag}</span>
              <span className="font-mono mr-2">{code}</span>
              <span className="text-muted-foreground text-xs">{m.name}</span>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
