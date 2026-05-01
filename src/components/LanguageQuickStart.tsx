import { Languages, Volume2, MessageSquareText, HelpCircle } from "lucide-react";

type Phrase = {
  original: string;
  phonetic: string;
  english: string;
};

const DATA: Record<string, Phrase[]> = {
  "thailand": [
    { original: "Sawatdee (ka/krub)", phonetic: "Sa-wat-dee", english: "Hello / Goodbye" },
    { original: "Kob kun (ka/krub)", phonetic: "Kob-koon", english: "Thank you" },
    { original: "Aroy mak", phonetic: "A-roy-maak", english: "Very delicious" },
    { original: "Tao rai?", phonetic: "Tao-rai", english: "How much?" },
    { original: "Mai pen rai", phonetic: "Mai-pen-rai", english: "No problem" },
  ],
  "india": [
    { original: "Namaste", phonetic: "Na-ma-stay", english: "Hello" },
    { original: "Dhanyavad", phonetic: "Dhan-ya-vaad", english: "Thank you" },
    { original: "Kitna hai?", phonetic: "Kit-na-hai", english: "How much?" },
    { original: "Theek hai", phonetic: "Teek-hai", english: "It's okay / Good" },
    { original: "Chalo", phonetic: "Chu-lo", english: "Let's go" },
  ],
  "france": [
    { original: "Bonjour", phonetic: "Bon-zhoor", english: "Hello" },
    { original: "Merci", phonetic: "Mair-see", english: "Thank you" },
    { original: "S'il vous plaît", phonetic: "Seel-voo-play", english: "Please" },
    { original: "L'addition, s'il vous plaît", phonetic: "La-dee-syon", english: "The check, please" },
    { original: "Où est...?", phonetic: "Oo-ay", english: "Where is...?" },
  ],
  "japan": [
    { original: "Konnichiwa", phonetic: "Kon-nee-chee-wah", english: "Hello" },
    { original: "Arigato", phonetic: "Ah-ree-gah-toh", english: "Thank you" },
    { original: "Sumimasen", phonetic: "Soo-mee-mah-sen", english: "Excuse me / Sorry" },
    { original: "Ikura desu ka?", phonetic: "Ee-koo-rah-dess-kah", english: "How much?" },
    { original: "Oishii!", phonetic: "Oy-shee", english: "Delicious!" },
  ],
};

export function LanguageQuickStart({ slug }: { slug: string }) {
  const phrases = DATA[slug] || DATA["thailand"];

  return (
    <div className="glass-card p-5 border-purple-500/20 bg-purple-500/5 relative overflow-hidden">
       <div className="absolute top-0 right-0 p-4 opacity-10">
          <Languages className="h-12 w-12 text-purple-500" />
       </div>

       <div className="flex items-center gap-2 mb-6">
          <MessageSquareText className="h-4 w-4 text-purple-500" />
          <h3 className="text-[10px] font-black uppercase tracking-widest text-purple-500">Language Quick-Start</h3>
       </div>

       <div className="space-y-4">
          {phrases.map((p, i) => (
             <div key={i} className="group cursor-help">
                <div className="flex items-center justify-between mb-1">
                   <p className="text-xs font-bold group-hover:text-purple-500 transition-colors">{p.original}</p>
                   <Volume2 className="h-3 w-3 text-muted-foreground opacity-40 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="flex items-center gap-2">
                   <p className="text-[9px] font-black uppercase tracking-tight text-muted-foreground/60">{p.phonetic}</p>
                   <span className="h-px w-2 bg-border/40" />
                   <p className="text-[9px] font-bold text-muted-foreground">{p.english}</p>
                </div>
             </div>
          ))}
       </div>

       <div className="mt-6 p-2 rounded-lg bg-surface border border-border/40 flex items-start gap-2">
          <HelpCircle className="h-3 w-3 text-purple-500 shrink-0 mt-0.5" />
          <p className="text-[8px] font-medium text-muted-foreground leading-tight">
             Pro-tip: Learning just 3 phrases increases local trust by 40% in {slug}.
          </p>
       </div>
    </div>
  );
}
