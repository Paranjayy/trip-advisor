/** Google Website Translator helpers. */

export const LANGUAGES: { code: string; label: string; native: string }[] = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "gu", label: "Gujarati", native: "ગુજરાતી" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "bn", label: "Bengali", native: "বাংলা" },
  { code: "mr", label: "Marathi", native: "मराठी" },
  { code: "pa", label: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { code: "ur", label: "Urdu", native: "اردو" },
  { code: "fr", label: "French", native: "Français" },
  { code: "es", label: "Spanish", native: "Español" },
  { code: "de", label: "German", native: "Deutsch" },
  { code: "it", label: "Italian", native: "Italiano" },
  { code: "pt", label: "Portuguese", native: "Português" },
  { code: "ja", label: "Japanese", native: "日本語" },
  { code: "ko", label: "Korean", native: "한국어" },
  { code: "zh-CN", label: "Chinese", native: "中文" },
  { code: "ar", label: "Arabic", native: "العربية" },
  { code: "ru", label: "Russian", native: "Русский" },
  { code: "th", label: "Thai", native: "ไทย" },
  { code: "vi", label: "Vietnamese", native: "Tiếng Việt" },
  { code: "id", label: "Indonesian", native: "Bahasa Indonesia" },
];

const COOKIE = "googtrans";

function setCookie(name: string, value: string) {
  const host = window.location.hostname;
  document.cookie = `${name}=${value};path=/`;
  document.cookie = `${name}=${value};path=/;domain=${host}`;
  // also set on parent domain (xxx.lovable.app)
  const parts = host.split(".");
  if (parts.length > 1) {
    const parent = "." + parts.slice(-2).join(".");
    document.cookie = `${name}=${value};path=/;domain=${parent}`;
  }
}

export function getActiveLanguage(): string {
  if (typeof document === "undefined") return "en";
  const m = document.cookie.match(/googtrans=\/[a-zA-Z-]+\/([a-zA-Z-]+)/);
  return m ? m[1] : "en";
}

export function setLanguage(code: string) {
  if (code === "en") {
    setCookie(COOKIE, "/en/en");
  } else {
    setCookie(COOKIE, `/en/${code}`);
  }
  window.location.reload();
}
