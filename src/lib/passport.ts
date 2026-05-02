export type VisaStatus = "visa-free" | "evisa" | "on-arrival" | "required";

export const CITIZENSHIPS = [
  { value: "india", label: "India 🇮🇳" },
  { value: "usa", label: "USA 🇺🇸" },
  { value: "uk", label: "UK 🇬🇧" },
  { value: "germany", label: "Germany 🇩🇪" },
];

export const PASSPORTS = {
  india: {
    "japan": "required",
    "iceland": "required",
    "switzerland": "required",
    "thailand": "evisa",
    "indonesia": "on-arrival",
    "vietnam": "evisa",
    "malaysia": "visa-free",
    "sri-lanka": "visa-free",
    "taiwan": "required",
    "georgia": "evisa",
    "nepal": "visa-free",
    "bhutan": "visa-free",
    "singapore": "evisa",
    "mauritius": "visa-free",
    "kazakhstan": "visa-free",
    "brazil": "required",
    "norway": "required",
    "kenya": "evisa",
    "turkey": "evisa",
    "uae": "required",
  } as Record<string, VisaStatus>
};

export function getVisaStatus(countrySlug: string, citizenship: string = "india"): VisaStatus {
  const rules = PASSPORTS[citizenship as keyof typeof PASSPORTS];
  return rules?.[countrySlug] || "required";
}

export function getVisaLabel(status: VisaStatus): string {
  switch (status) {
    case "visa-free": return "Visa Free";
    case "evisa": return "e-Visa";
    case "on-arrival": return "On Arrival";
    case "required": return "Visa Required";
    default: return "Unknown";
  }
}

export function getVisaTone(status: VisaStatus): string {
  switch (status) {
    case "visa-free": return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
    case "evisa": return "text-blue-500 bg-blue-500/10 border-blue-500/20";
    case "on-arrival": return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    case "required": return "text-rose-500 bg-rose-500/10 border-rose-500/20";
    default: return "text-muted-foreground";
  }
}
