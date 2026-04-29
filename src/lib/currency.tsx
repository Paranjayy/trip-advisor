import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";

/** Approximate static FX rates relative to 1 USD. Good enough for travel-budget estimates. */
export const FX: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.78,
  JPY: 156,
  INR: 83.5,
  AUD: 1.52,
  CAD: 1.37,
  SGD: 1.34,
  AED: 3.67,
  CNY: 7.25,
  HKD: 7.82,
  KRW: 1380,
  THB: 36.5,
  VND: 25400,
  IDR: 16200,
  MYR: 4.7,
  PHP: 58,
  TWD: 32,
  LKR: 300,
  NPR: 133,
  TRY: 32,
  PLN: 4,
  HUF: 360,
  CZK: 23,
  RON: 4.6,
  CHF: 0.9,
  SEK: 10.6,
  NOK: 10.7,
  DKK: 6.85,
  ZAR: 18.5,
  EGP: 48,
  MAD: 10,
  BRL: 5.1,
  MXN: 17,
  ARS: 920,
  CLP: 920,
  COP: 4000,
  PEN: 3.75,
  NZD: 1.65,
  ILS: 3.7,
  SAR: 3.75,
  QAR: 3.64,
  KZT: 470,
  GEL: 2.7,
  PKR: 280,
  BDT: 117,
  TZS: 2600,
  KES: 130,
  NGN: 1500,
};

export const CURRENCY_META: Record<string, { name: string; symbol: string; flag: string }> = {
  USD: { name: "US Dollar", symbol: "$", flag: "🇺🇸" },
  EUR: { name: "Euro", symbol: "€", flag: "🇪🇺" },
  GBP: { name: "British Pound", symbol: "£", flag: "🇬🇧" },
  JPY: { name: "Japanese Yen", symbol: "¥", flag: "🇯🇵" },
  INR: { name: "Indian Rupee", symbol: "₹", flag: "🇮🇳" },
  AUD: { name: "Australian Dollar", symbol: "A$", flag: "🇦🇺" },
  CAD: { name: "Canadian Dollar", symbol: "C$", flag: "🇨🇦" },
  SGD: { name: "Singapore Dollar", symbol: "S$", flag: "🇸🇬" },
  AED: { name: "UAE Dirham", symbol: "د.إ", flag: "🇦🇪" },
  CNY: { name: "Chinese Yuan", symbol: "¥", flag: "🇨🇳" },
  HKD: { name: "Hong Kong Dollar", symbol: "HK$", flag: "🇭🇰" },
  KRW: { name: "Korean Won", symbol: "₩", flag: "🇰🇷" },
  THB: { name: "Thai Baht", symbol: "฿", flag: "🇹🇭" },
  VND: { name: "Vietnamese Dong", symbol: "₫", flag: "🇻🇳" },
  IDR: { name: "Indonesian Rupiah", symbol: "Rp", flag: "🇮🇩" },
  MYR: { name: "Malaysian Ringgit", symbol: "RM", flag: "🇲🇾" },
  PHP: { name: "Philippine Peso", symbol: "₱", flag: "🇵🇭" },
  TWD: { name: "Taiwan Dollar", symbol: "NT$", flag: "🇹🇼" },
  LKR: { name: "Sri Lankan Rupee", symbol: "Rs", flag: "🇱🇰" },
  NPR: { name: "Nepalese Rupee", symbol: "Rs", flag: "🇳🇵" },
  TRY: { name: "Turkish Lira", symbol: "₺", flag: "🇹🇷" },
  PLN: { name: "Polish Złoty", symbol: "zł", flag: "🇵🇱" },
  HUF: { name: "Hungarian Forint", symbol: "Ft", flag: "🇭🇺" },
  CZK: { name: "Czech Koruna", symbol: "Kč", flag: "🇨🇿" },
  RON: { name: "Romanian Leu", symbol: "lei", flag: "🇷🇴" },
  CHF: { name: "Swiss Franc", symbol: "CHF", flag: "🇨🇭" },
  SEK: { name: "Swedish Krona", symbol: "kr", flag: "🇸🇪" },
  NOK: { name: "Norwegian Krone", symbol: "kr", flag: "🇳🇴" },
  DKK: { name: "Danish Krone", symbol: "kr", flag: "🇩🇰" },
  ZAR: { name: "South African Rand", symbol: "R", flag: "🇿🇦" },
  EGP: { name: "Egyptian Pound", symbol: "E£", flag: "🇪🇬" },
  MAD: { name: "Moroccan Dirham", symbol: "DH", flag: "🇲🇦" },
  BRL: { name: "Brazilian Real", symbol: "R$", flag: "🇧🇷" },
  MXN: { name: "Mexican Peso", symbol: "$", flag: "🇲🇽" },
  ARS: { name: "Argentine Peso", symbol: "$", flag: "🇦🇷" },
  CLP: { name: "Chilean Peso", symbol: "$", flag: "🇨🇱" },
  COP: { name: "Colombian Peso", symbol: "$", flag: "🇨🇴" },
  PEN: { name: "Peruvian Sol", symbol: "S/", flag: "🇵🇪" },
  NZD: { name: "NZ Dollar", symbol: "NZ$", flag: "🇳🇿" },
  ILS: { name: "Israeli Shekel", symbol: "₪", flag: "🇮🇱" },
  SAR: { name: "Saudi Riyal", symbol: "﷼", flag: "🇸🇦" },
  QAR: { name: "Qatari Riyal", symbol: "﷼", flag: "🇶🇦" },
  KZT: { name: "Kazakh Tenge", symbol: "₸", flag: "🇰🇿" },
  GEL: { name: "Georgian Lari", symbol: "₾", flag: "🇬🇪" },
  PKR: { name: "Pakistani Rupee", symbol: "Rs", flag: "🇵🇰" },
  BDT: { name: "Bangladeshi Taka", symbol: "৳", flag: "🇧🇩" },
  TZS: { name: "Tanzanian Shilling", symbol: "TSh", flag: "🇹🇿" },
  KES: { name: "Kenyan Shilling", symbol: "KSh", flag: "🇰🇪" },
  NGN: { name: "Nigerian Naira", symbol: "₦", flag: "🇳🇬" },
};

export const SUPPORTED_CURRENCIES = Object.keys(CURRENCY_META);

export type CurrencyCode = keyof typeof CURRENCY_META;

export function convert(usd: number, code: string): number {
  const rate = FX[code] ?? 1;
  return usd * rate;
}

/** Pretty-format an amount in the target currency. Hides decimals for big numbers. */
export function formatMoney(usd: number, code: string): string {
  const value = convert(usd, code);
  const abs = Math.abs(value);
  let maximumFractionDigits = 0;
  if (abs < 10) maximumFractionDigits = 2;
  else if (abs < 100) maximumFractionDigits = 1;

  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: code,
      maximumFractionDigits,
      minimumFractionDigits: 0,
    }).format(value);
  } catch {
    const meta = CURRENCY_META[code];
    const rounded = Math.round(value);
    return `${meta?.symbol ?? ""}${rounded.toLocaleString()} ${code}`;
  }
}

/** Format a [min, max] USD range in the active currency. */
export function formatRange(range: [number, number], code: string): string {
  return `${formatMoney(range[0], code)}–${formatMoney(range[1], code)}`;
}

type Ctx = {
  currency: string;
  setCurrency: (c: string) => void;
  format: (usd: number) => string;
  formatRange: (r: [number, number]) => string;
  convert: (usd: number) => number;
};

const CurrencyContext = createContext<Ctx | null>(null);

const STORAGE_KEY = "globewise.currency";

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<string>("USD");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (saved && FX[saved]) setCurrencyState(saved);
  }, []);

  const setCurrency = (c: string) => {
    setCurrencyState(c);
    try { localStorage.setItem(STORAGE_KEY, c); } catch { /* noop */ }
  };

  const value = useMemo<Ctx>(() => ({
    currency,
    setCurrency,
    format: (usd) => formatMoney(usd, currency),
    formatRange: (r) => formatRange(r, currency),
    convert: (usd) => convert(usd, currency),
  }), [currency]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency(): Ctx {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used inside <CurrencyProvider>");
  return ctx;
}
