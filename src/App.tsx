import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CurrencyProvider } from "@/lib/currency";
import { ThemeProvider } from "@/lib/theme";
import Index from "./pages/Index.tsx";
import Explore from "./pages/Explore.tsx";
import CountryDetail from "./pages/CountryDetail.tsx";
import Compare from "./pages/Compare.tsx";
import Timing from "./pages/Timing.tsx";
import Favorites from "./pages/Favorites.tsx";
import MapPage from "./pages/Map.tsx";
import Itineraries from "./pages/Itineraries.tsx";
import ItineraryDetail from "./pages/ItineraryDetail.tsx";
import CustomItinerary from "./pages/CustomItinerary.tsx";
import Planner from "./pages/Planner.tsx";
import NotFound from "./pages/NotFound.tsx";
import { AiAdvisor } from "@/components/AiAdvisor";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <CurrencyProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/country/:slug" element={<CountryDetail />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/timing" element={<Timing />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/trips" element={<Navigate to="/itinerary" replace />} />
              <Route path="/itinerary" element={<Itineraries />} />
              <Route path="/itinerary/:slug" element={<ItineraryDetail />} />
              <Route path="/itinerary/edit/:slug" element={<CustomItinerary />} />
              <Route path="/planner" element={<Planner />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <AiAdvisor />
          </BrowserRouter>
        </TooltipProvider>
      </CurrencyProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
