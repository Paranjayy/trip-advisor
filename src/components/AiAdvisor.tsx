import { useState, useRef, useEffect } from "react";
import { Send, X, MessageSquare, Sparkles, User, Bot, Loader2, ChevronDown, Compass, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "Hi! I'm your AI Travel Advisor. I've analyzed over 79 countries for budget, vibe, and Japan-likeness. How can I help you plan your next trip?",
    timestamp: new Date(),
  },
];

export function AiAdvisor() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Mock AI Response Logic
    setTimeout(() => {
      let aiContent = "That's a great question! Based on my data, you might want to look at ";
      const text = userMsg.content.toLowerCase();

      if (text.includes("budget") || text.includes("cheap")) {
        aiContent += "Vietnam or Taiwan. They offer incredible value, especially if you're looking for world-class street food and culture for under $60/day.";
      } else if (text.includes("japan")) {
        aiContent += "Taiwan or South Korea. Taiwan has a 78/100 Japan-vibe score because of its efficiency and food culture, but it's about 40% cheaper!";
      } else if (text.includes("beach")) {
        aiContent += "the Philippines or Indonesia. Palawan and Bali are currently top-rated for their turquoise waters and chill vibes.";
      } else if (text.includes("itinerary") || text.includes("plan")) {
        aiContent += "our curated 7-day Srinagar itinerary. It's perfectly balanced between nature and culture, and I've just updated it with precise GPS routes.";
      } else {
        aiContent = "I'm still learning about specific hidden gems, but I can tell you which countries match your vibe best if you tell me what you're looking for (e.g., 'adventure in Europe' or 'chill budget beach').";
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiContent,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[380px] h-[520px] bg-background/95 backdrop-blur-xl border border-border/60 rounded-2xl shadow-elevated overflow-hidden flex flex-col animate-scale-in origin-bottom-right">
          {/* Header */}
          <div className="bg-gradient-primary px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white leading-none">Travel Advisor</h3>
                <p className="text-[10px] text-white/70 mt-1 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                  Online • Smart Engine v2
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/10"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" viewportRef={scrollRef}>
            <div className="space-y-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    "flex gap-2 max-w-[85%]",
                    m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                  )}
                >
                  <div className={cn(
                    "h-7 w-7 rounded-full flex items-center justify-center shrink-0",
                    m.role === "assistant" ? "bg-primary-soft text-primary" : "bg-muted text-muted-foreground"
                  )}>
                    {m.role === "assistant" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  </div>
                  <div className={cn(
                    "px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm",
                    m.role === "assistant" 
                      ? "bg-surface-muted text-foreground rounded-tl-none border border-border/40" 
                      : "bg-primary text-primary-foreground rounded-tr-none"
                  )}>
                    {m.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-2 mr-auto max-w-[85%]">
                  <div className="h-7 w-7 rounded-full bg-primary-soft text-primary flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-surface-muted px-4 py-3 rounded-2xl rounded-tl-none border border-border/40 shadow-sm flex gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-bounce" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Suggested Actions */}
          <div className="px-4 py-2 flex flex-wrap gap-2 border-t border-border/40 bg-surface/30">
            <Suggestion label="Cheapest in Europe" onClick={() => setInput("What's the cheapest country in Europe?")} />
            <Suggestion label="Japan vibes" onClick={() => setInput("Which country feels most like Japan?")} />
            <Suggestion label="Adventure beach" onClick={() => setInput("Show me adventure beach destinations")} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-background border-t border-border/60">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2"
            >
              <Input
                placeholder="Ask about destinations, budgets..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="bg-surface border-border/60 focus-visible:ring-primary h-10 rounded-xl"
              />
              <Button type="submit" size="icon" className="h-10 w-10 shrink-0 rounded-xl bg-primary hover:bg-primary/90 shadow-glow" disabled={!input.trim() || isTyping}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Trigger Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-14 w-14 rounded-2xl shadow-glow transition-all duration-300 active:scale-95 group",
          isOpen ? "bg-destructive hover:bg-destructive/90 rotate-90" : "bg-primary hover:bg-primary/90"
        )}
      >
        {isOpen ? <X className="h-6 w-6" /> : (
          <div className="relative">
             <MessageSquare className="h-6 w-6 group-hover:scale-110 transition-transform" />
             <div className="absolute -top-1 -right-1 h-3 w-3 bg-accent rounded-full border-2 border-primary shadow-sm" />
          </div>
        )}
      </Button>
    </div>
  );
}

function Suggestion({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-[10px] font-bold uppercase tracking-wider bg-primary-soft text-primary px-2.5 py-1 rounded-full border border-primary/10 hover:bg-primary hover:text-primary-foreground transition-colors"
    >
      {label}
    </button>
  );
}
