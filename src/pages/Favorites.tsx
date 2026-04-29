import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { CountryCard } from "@/components/CountryCard";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/useFavorites";
import { COUNTRIES } from "@/data/countries";

const Favorites = () => {
  useEffect(() => {
    document.title = "Saved trips — GlobeWise";
  }, []);

  const { favorites } = useFavorites();
  const saved = COUNTRIES.filter((c) => favorites.includes(c.slug));

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <div className="container mx-auto py-10">
        <header className="mb-8">
          <p className="text-xs uppercase tracking-wider text-accent font-semibold mb-1 flex items-center gap-1.5">
            <Heart className="h-3.5 w-3.5" /> Saved
          </p>
          <h1 className="font-display text-4xl font-bold">Your shortlist</h1>
          <p className="text-muted-foreground mt-2">Countries you've saved for later — stored locally in your browser.</p>
        </header>

        {saved.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="font-display text-xl font-bold mb-2">No saved trips yet</h2>
            <p className="text-muted-foreground mb-6">Tap the heart on any country card to save it here.</p>
            <Button asChild className="rounded-xl"><Link to="/explore">Browse countries</Link></Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {saved.map((c) => <CountryCard key={c.slug} country={c} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
