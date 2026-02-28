// Wahy App - Islamic Application
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import AppLayout from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import QuranPage from "./pages/QuranPage";
import AzkarPage from "./pages/AzkarPage";

import PrayerPage from "./pages/PrayerPage";
import QiblaPage from "./pages/QiblaPage";
import MushafPage from "./pages/MushafPage";
import MorePage from "./pages/MorePage";
import DownloadsPage from "./pages/DownloadsPage";
import DuasPage from "./pages/DuasPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppLayout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/quran" element={<QuranPage />} />
                
                <Route path="/mushaf/:page?" element={<MushafPage />} />
                <Route path="/azkar" element={<AzkarPage />} />
                <Route path="/prayer" element={<PrayerPage />} />
                <Route path="/more" element={<MorePage />} />
                <Route path="/downloads" element={<DownloadsPage />} />
                <Route path="/duas" element={<DuasPage />} />
                <Route path="/qibla" element={<QiblaPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppLayout>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
