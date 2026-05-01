import { Settings, User, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useUserSettings, Citizenship } from "@/lib/user-settings";
import { CITIZENSHIPS } from "@/lib/passport";

export function SettingsMenu() {
  const { citizenship, setCitizenship } = useUserSettings();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-secondary transition-colors">
          <Settings className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mt-2 rounded-2xl p-2 shadow-elevated border-border/60 backdrop-blur-md bg-background/95" align="end">
        <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          User Settings
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border/40 mx-2" />
        
        <DropdownMenuGroup>
          <div className="px-3 py-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 flex items-center gap-1.5">
               <User className="h-3 w-3" /> Citizenship / Passport
            </p>
            <div className="space-y-1">
              {CITIZENSHIPS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setCitizenship(c.value as Citizenship)}
                  className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    citizenship === c.value 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <span>{c.label}</span>
                  {citizenship === c.value && <Check className="h-3.5 w-3.5" />}
                </button>
              ))}
            </div>
          </div>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator className="bg-border/40 mx-2" />
        <DropdownMenuItem className="rounded-lg text-[10px] font-black uppercase tracking-widest text-muted-foreground focus:text-foreground">
          Advanced Config
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
