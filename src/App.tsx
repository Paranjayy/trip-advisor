import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CurrencyProvider } from "@/lib/currency";
import { ThemeProvider } from "@/lib/theme";
import { UserSettingsProvider } from "@/lib/user-settings";
import { motion, AnimatePresence } from "framer-motion";
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
import Gallery from "./pages/Gallery";
import NotFound from "./pages/NotFound";
import { CustomItineraryProvider } from "@/hooks/useCustomItineraries";
import { AiAdvisor } from "@/components/AiAdvisor";
import { SiteFooter } from "./components/SiteFooter";

const queryClient = new QueryClient();

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.2, ease: "easeOut" }}
    className="flex flex-col min-h-screen"
  >
    <div className="flex-1">
      {children}
    </div>
    <SiteFooter />
  </motion.div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Index /></PageWrapper>} />
        <Route path="/explore" element={<PageWrapper><Explore /></PageWrapper>} />
        <Route path="/map" element={<PageWrapper><MapPage /></PageWrapper>} />
        <Route path="/country/:slug" element={<PageWrapper><CountryDetail /></PageWrapper>} />
        <Route path="/compare" element={<PageWrapper><Compare /></PageWrapper>} />
        <Route path="/timing" element={<PageWrapper><Timing /></PageWrapper>} />
        <Route path="/favorites" element={<PageWrapper><Favorites /></PageWrapper>} />
        <Route path="/trips" element={<Navigate to="/itinerary" replace />} />
        <Route path="/itinerary" element={<PageWrapper><Itineraries /></PageWrapper>} />
        <Route path="/itinerary/:slug" element={<PageWrapper><ItineraryDetail /></PageWrapper>} />
        <Route path="/itinerary/edit/:slug" element={<PageWrapper><CustomItinerary /></PageWrapper>} />
        <Route path="/planner" element={<PageWrapper><Planner /></PageWrapper>} />
        <Route path="/gallery" element={<PageWrapper><Gallery /></PageWrapper>} />
        <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
};

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
                <AnimatedRoutes />
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
