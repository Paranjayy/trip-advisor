export type VisaStatus = "visa-free" | "e-visa" | "visa-required" | "visa-on-arrival";

export type PassportPower = {
  homeSlug: string;
  access: Record<string, { status: VisaStatus; duration: number }>;
};

export const PASSPORTS: Record<string, PassportPower> = {
  "india": {
    homeSlug: "india",
    access: {
      "thailand": { status: "visa-free", duration: 30 },
      "vietnam": { status: "e-visa", duration: 90 },
      "indonesia": { status: "visa-on-arrival", duration: 30 },
      "malaysia": { status: "visa-free", duration: 30 },
      "sri-lanka": { status: "e-visa", duration: 30 },
      "japan": { status: "e-visa", duration: 90 },
      "switzerland": { status: "visa-required", duration: 90 },
      "france": { status: "visa-required", duration: 90 },
      "usa": { status: "visa-required", duration: 180 },
    }
  },
  "usa": {
    homeSlug: "usa",
    access: {
      "thailand": { status: "visa-free", duration: 30 },
      "japan": { status: "visa-free", duration: 90 },
      "switzerland": { status: "visa-free", duration: 90 },
      "france": { status: "visa-free", duration: 90 },
      "vietnam": { status: "e-visa", duration: 90 },
      "india": { status: "e-visa", duration: 30 },
    }
  }
};

export function getVisaStatus(homePassport: string, destinationSlug: string) {
  const passport = PASSPORTS[homePassport.toLowerCase()];
  if (!passport) return { status: "visa-required" as VisaStatus, duration: 0 };
  
  const status = passport.access[destinationSlug];
  if (!status) return { status: "visa-required" as VisaStatus, duration: 0 };
  
  return status;
}

export const CITIZENSHIPS = [
  { label: "India 🇮🇳", value: "india" },
  { label: "USA 🇺🇸", value: "usa" },
  { label: "UK 🇬🇧", value: "uk" },
  { label: "Germany 🇩🇪", value: "germany" },
];
