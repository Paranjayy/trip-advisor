import { useCurrency } from "@/lib/currency";

/** Renders a USD amount in the user's selected display currency. */
export function Money({ usd }: { usd: number }) {
  const { format } = useCurrency();
  return <>{format(usd)}</>;
}

/** Renders a [low, high] USD range in the user's selected display currency. */
export function MoneyRange({ range }: { range: [number, number] }) {
  const { formatRange } = useCurrency();
  return <>{formatRange(range)}</>;
}
