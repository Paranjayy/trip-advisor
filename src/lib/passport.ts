export type VisaStatus = "visa-free" | "e-visa" | "visa-required" | "visa-on-arrival";

export type VisaDetails = {
  status: VisaStatus;
  stay: number; // days
  validity: number; // months
  entries: "single" | "multiple";
};

export const VISA_JARGON = [
  { term: "Stay Duration", definition: "The total number of consecutive days you are allowed to remain in the country after entry." },
  { term: "Validity Period", definition: "The timeframe within which you must use the visa to enter the country. It starts from the date of issue." },
  { term: "Single Entry", definition: "A visa that becomes invalid once you leave the country, even if the stay duration hasn't expired." },
  { term: "Multiple Entry", definition: "Allows you to enter and leave the country as many times as you like within the validity period." },
  { term: "Visa-on-Arrival (VoA)", definition: "A visa obtained at the port of entry. Usually requires a fee and specific documents (photos/proof of funds)." },
];

export type PassportPower = {
  homeSlug: string;
  access: Record<string, VisaDetails>;
};

export const PASSPORTS: Record<string, PassportPower> = {
  "india": {
    homeSlug: "india",
    access: {
      "thailand": { status: "visa-free", stay: 30, validity: 0, entries: "single" },
      "vietnam": { status: "e-visa", stay: 90, validity: 3, entries: "multiple" },
      "indonesia": { status: "visa-on-arrival", stay: 30, validity: 0, entries: "single" },
      "malaysia": { status: "visa-free", stay: 30, validity: 0, entries: "single" },
      "sri-lanka": { status: "e-visa", stay: 30, validity: 6, entries: "double" } as any,
      "japan": { status: "e-visa", stay: 90, validity: 3, entries: "single" },
      "switzerland": { status: "visa-required", stay: 90, validity: 6, entries: "multiple" },
      "france": { status: "visa-required", stay: 90, validity: 6, entries: "multiple" },
      "usa": { status: "visa-required", stay: 180, validity: 120, entries: "multiple" },
      "iceland": { status: "visa-required", stay: 90, validity: 6, entries: "multiple" },
      "norway": { status: "visa-required", stay: 90, validity: 6, entries: "multiple" },
      "singapore": { status: "e-visa", stay: 30, validity: 1, entries: "multiple" },
      "georgia": { status: "visa-free", stay: 360, validity: 0, entries: "multiple" },
      "bhutan": { status: "visa-free", stay: 14, validity: 0, entries: "single" },
      "nepal": { status: "visa-free", stay: 365, validity: 0, entries: "multiple" },
    }
  },
  "usa": {
    homeSlug: "usa",
    access: {
      "thailand": { status: "visa-free", stay: 30, validity: 0, entries: "single" },
      "japan": { status: "visa-free", stay: 90, validity: 0, entries: "single" },
      "switzerland": { status: "visa-free", stay: 90, validity: 0, entries: "multiple" },
      "france": { status: "visa-free", stay: 90, validity: 0, entries: "multiple" },
      "vietnam": { status: "e-visa", stay: 90, validity: 1, entries: "single" },
      "india": { status: "e-visa", stay: 30, validity: 1, entries: "single" },
    }
  },
  "uk": {
    homeSlug: "uk",
    access: {
      "thailand": { status: "visa-free", stay: 30, validity: 0, entries: "single" },
      "japan": { status: "visa-free", stay: 90, validity: 0, entries: "single" },
      "switzerland": { status: "visa-free", stay: 90, validity: 0, entries: "multiple" },
      "france": { status: "visa-free", stay: 90, validity: 0, entries: "multiple" },
      "indonesia": { status: "visa-free", stay: 30, validity: 0, entries: "single" },
      "india": { status: "e-visa", stay: 30, validity: 1, entries: "single" },
    }
  },
  "germany": {
    homeSlug: "germany",
    access: {
      "thailand": { status: "visa-free", stay: 30, validity: 0, entries: "single" },
      "japan": { status: "visa-free", stay: 90, validity: 0, entries: "single" },
      "switzerland": { status: "visa-free", stay: 90, validity: 0, entries: "multiple" },
      "france": { status: "visa-free", stay: 90, validity: 0, entries: "multiple" },
      "vietnam": { status: "visa-free", stay: 45, validity: 0, entries: "single" },
      "india": { status: "e-visa", stay: 30, validity: 1, entries: "single" },
    }
  }
};

export function getVisaStatus(homePassport: string, destinationSlug: string): VisaDetails {
  const passport = PASSPORTS[homePassport.toLowerCase()];
  const defaultStatus: VisaDetails = { status: "visa-required", stay: 0, validity: 0, entries: "single" };
  
  if (!passport) return defaultStatus;
  
  const details = passport.access[destinationSlug];
  if (!details) return defaultStatus;
  
  return details;
}

export const CITIZENSHIPS = [
  { label: "India 🇮🇳", value: "india" },
  { label: "USA 🇺🇸", value: "usa" },
  { label: "UK 🇬🇧", value: "uk" },
  { label: "Germany 🇩🇪", value: "germany" },
];
