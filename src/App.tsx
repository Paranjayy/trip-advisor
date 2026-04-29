import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CurrencyProvider } from "@/lib/currency";
import Index from "./pages/Index.tsx";
import Explore from "./pages/Explore.tsx";
import CountryDetail from "./pages/CountryDetail.tsx";
import Compare from "./pages/Compare.tsx";
import Timing from "./pages/Timing.tsx";
import Favorites from "./pages/Favorites.tsx";
import MapPage from "./pages/Map.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </CurrencyProvider>
  </QueryClientProvider>
);

export default App;
