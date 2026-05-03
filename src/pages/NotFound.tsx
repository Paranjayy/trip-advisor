import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { Button } from "@/components/ui/button";
import { Compass, RadioReceiver, Radar, Zap } from "lucide-react";
import { ITINERARIES } from "@/lib/itineraries";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [bgUrl, setBgUrl] = useState("");

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    // Use the Zenith Discovery Engine to generate a "lost" background
    const seed = location.pathname.length + 404;
    setBgUrl(`https://image.pollinations.ai/prompt/lost%20in%20a%20beautiful%20vast%20foggy%20landscape%20cinematic%20travel%20photography?width=1920&height=1080&nologo=true&seed=${seed}`);
  }, [location.pathname]);

  const handleRandomWarp = () => {
    const random = ITINERARIES[Math.floor(Math.random() * ITINERARIES.length)];
    navigate(`/itinerary/${random.slug}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <SiteNav />
      
      {/* Generative Background */}
      <div className="absolute inset-0 z-0">
         <img src={bgUrl} alt="Lost coordinates" className="w-full h-full object-cover opacity-30" />
         <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
      </div>

      <div className="flex-1 flex items-center justify-center relative z-10 p-6">
        <div className="text-center max-w-2xl mx-auto space-y-8 glass-card p-12 md:p-16 rounded-[3rem] border-dashed border-2 bg-surface/40 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
          
          {/* Radar Animation Background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
             <div className="h-[40rem] w-[40rem] border border-primary/20 rounded-full absolute animate-[ping_4s_ease-out_infinite]" />
             <div className="h-[20rem] w-[20rem] border border-primary/40 rounded-full absolute animate-[ping_3s_ease-out_infinite]" />
          </div>

          <div className="h-24 w-24 mx-auto rounded-3xl bg-primary/10 border border-primary/30 flex items-center justify-center shadow-glow shadow-primary/20 relative">
             <Radar className="h-12 w-12 text-primary animate-pulse" />
             <div className="absolute -top-2 -right-2 h-6 w-6 bg-destructive rounded-full border-2 border-background animate-bounce flex items-center justify-center">
                <span className="text-[10px] font-black text-white">!</span>
             </div>
          </div>

          <div className="space-y-4 relative z-10">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-white/40">404</h1>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Signal Lost. Coordinate Mismatch.</h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              The telemetry data for <code className="text-primary bg-primary/10 px-2 py-1 rounded-md text-sm">{location.pathname}</code> returned a void space. The node you are looking for does not exist in the current spatial index.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 relative z-10">
             <Button asChild size="lg" className="h-14 px-8 rounded-2xl font-black text-sm w-full sm:w-auto shadow-glow shadow-primary/20">
                <Link to="/">
                   <Compass className="mr-2 h-5 w-5" /> RECALIBRATE TO BASE
                </Link>
             </Button>
             
             <Button onClick={handleRandomWarp} variant="outline" size="lg" className="h-14 px-8 rounded-2xl font-black text-sm w-full sm:w-auto bg-surface/50 backdrop-blur-md hover:bg-white hover:text-black transition-all">
                <Zap className="mr-2 h-5 w-5 fill-current opacity-50" /> EMERGENCY WARP
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
