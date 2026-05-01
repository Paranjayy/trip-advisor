import { useState } from "react";
import { Sparkles, ArrowRight, RotateCcw, Heart } from "lucide-react";
import { COUNTRIES } from "@/data/countries";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Flag } from "@/components/Flag";

const QUESTIONS = [
  {
    id: "vibe",
    q: "What's the energy?",
    options: [
      { label: "Urban Hustle", value: "busy", icon: "🏙️" },
      { label: "Deep Nature", value: "nature", icon: "🌲" },
      { label: "Cultural Soul", value: "culture", icon: "⛩️" }
    ]
  },
  {
    id: "budget",
    q: "Dining style?",
    options: [
      { label: "Street Food", value: "cheap", icon: "🍜" },
      { label: "Mid-Range", value: "mid", icon: "🍱" },
      { label: "Fine Dining", value: "luxe", icon: "🥂" }
    ]
  },
  {
    id: "terrain",
    q: "Preferred view?",
    options: [
      { label: "Blue Waves", value: "beach", icon: "🌊" },
      { label: "Cold Peaks", value: "mountain", icon: "🏔️" },
      { label: "Ancient Ruins", value: "desert", icon: "🏜️" }
    ]
  }
];

export function VibeMatcher() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<typeof COUNTRIES[0] | null>(null);

  const handleAnswer = (val: string) => {
    const newAnswers = { ...answers, [QUESTIONS[step].id]: val };
    setAnswers(newAnswers);
    
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      // Find a match
      const match = COUNTRIES.find(c => {
        if (newAnswers.budget === "cheap" && c.dailyCost > 60) return false;
        if (newAnswers.budget === "mid" && (c.dailyCost < 60 || c.dailyCost > 150)) return false;
        if (newAnswers.budget === "luxe" && c.dailyCost < 150) return false;
        return true;
      }) || COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
      setResult(match);
      setStep(QUESTIONS.length);
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setResult(null);
  };

  return (
    <div className="glass-card p-6 border-primary/20 bg-primary/5 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Sparkles className="h-20 w-20 text-primary" />
      </div>
      
      {step < QUESTIONS.length ? (
        <div className="space-y-4 relative z-10">
          <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px]">
            <Sparkles className="h-3 w-3" /> Step {step + 1} of 3
          </div>
          <h3 className="font-display text-xl font-bold">{QUESTIONS[step].q}</h3>
          <div className="grid gap-2">
            {QUESTIONS[step].options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleAnswer(opt.value)}
                className="flex items-center justify-between p-3 rounded-xl bg-background border border-border/40 hover:border-primary hover:bg-primary/5 transition-all group/opt text-left"
              >
                <div className="flex items-center gap-3">
                   <span className="text-xl">{opt.icon}</span>
                   <span className="font-bold text-sm">{opt.label}</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover/opt:text-primary group-hover/opt:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
        </div>
      ) : result ? (
        <div className="space-y-4 text-center relative z-10 animate-in fade-in zoom-in-95 duration-500">
           <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <Heart className="h-8 w-8 text-primary fill-primary" />
           </div>
           <h3 className="font-display text-xl font-black italic">It's a Match!</h3>
           <Link to={`/country/${result.slug}`} className="block glass-card p-4 hover:border-primary/40 transition-colors">
              <Flag emoji={result.flag} size={48} className="mx-auto mb-2" />
              <p className="font-black text-lg">{result.name}</p>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{result.region}</p>
           </Link>
           <div className="flex gap-2">
              <Button onClick={reset} variant="ghost" className="flex-1 rounded-xl text-xs font-bold gap-2">
                 <RotateCcw className="h-3.5 w-3.5" /> Restart
              </Button>
              <Button asChild className="flex-1 rounded-xl text-xs font-bold bg-primary shadow-glow">
                 <Link to={`/country/${result.slug}`}>View Details</Link>
              </Button>
           </div>
        </div>
      ) : null}
    </div>
  );
}
