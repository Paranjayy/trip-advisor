import { Languages, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LANGUAGES, setLanguage, getActiveLanguage } from "@/lib/translate";

const QUICK = ["en", "hi", "gu"];

export function TranslateMenu() {
  const active = typeof window !== "undefined" ? getActiveLanguage() : "en";
  const activeMeta = LANGUAGES.find((l) => l.code === active) ?? LANGUAGES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-lg notranslate" translate="no">
          <Languages className="h-4 w-4 mr-1.5" />
          <span className="hidden sm:inline">{activeMeta.native}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52 notranslate" translate="no">
        <DropdownMenuLabel>Quick</DropdownMenuLabel>
        {QUICK.map((c) => {
          const lang = LANGUAGES.find((l) => l.code === c)!;
          return (
            <DropdownMenuItem key={c} onClick={() => setLanguage(c)} className="cursor-pointer">
              <span className="flex-1">{lang.native}</span>
              {active === c && <Check className="h-3.5 w-3.5 text-primary" />}
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <DropdownMenuLabel>More languages</DropdownMenuLabel>
        <div className="max-h-60 overflow-y-auto">
          {LANGUAGES.filter((l) => !QUICK.includes(l.code)).map((l) => (
            <DropdownMenuItem key={l.code} onClick={() => setLanguage(l.code)} className="cursor-pointer">
              <span className="flex-1">{l.native}</span>
              <span className="text-[10px] text-muted-foreground ml-2">{l.label}</span>
              {active === l.code && <Check className="h-3.5 w-3.5 text-primary ml-2" />}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
