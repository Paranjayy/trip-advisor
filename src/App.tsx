import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CurrencyProvider } from "@/lib/currency";
import { ThemeProvider } from "@/lib/theme";
import { UserSettingsProvider } from "@/lib/user-settings";
import Index from "./pages/Index";
import Explore from "./pages/Explore";
import CountryDetail from "./pages/CountryDetail";
import Compare from "./pages/Compare";
import Timing from "./pages/Timing";
import Favorites from "./pages/Favorites";
import MapPage from "./pages/Map";
import Itineraries from "./pages/Itineraries";
import ItineraryDetail from "./pages/ItineraryDetail";
import CustomItinerary from "./pages/CustomItinerary";
import Planner from "./pages/Planner";
import NotFound from "./pages/NotFound";
import { CustomItineraryProvider } from "@/hooks/useCustomItineraries";
import { AiAdvisor } from "@/components/AiAdvisor";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <UserSettingsProvider>
        <CurrencyProvider>
          <CustomItineraryProvider>
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
          </CustomItineraryProvider>
        </CurrencyProvider>
      </UserSettingsProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
