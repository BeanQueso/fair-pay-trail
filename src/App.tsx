import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Loader2 } from "lucide-react";
import AppLayout from "./components/layout/AppLayout";
import OnboardingTour from "./components/OnboardingTour";
import { CaseProvider, useCase } from "./context/CaseProvider";
import { I18nProvider } from "./lib/i18n";
import Auth from "./pages/Auth";
import Index from "./pages/Index";
import Evidence from "./pages/Evidence";
import Timeline from "./pages/Timeline";
import WageEstimate from "./pages/WageEstimate";
import NextSteps from "./pages/NextSteps";
import CasePacket from "./pages/CasePacket";
import SimilarCases from "./pages/SimilarCases";
import Advocates from "./pages/Advocates";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function Shell() {
  const { session, authLoading } = useCase();

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-label="Loading" />
      </div>
    );
  }

  if (!session) return <Auth />;

  return (
    <AppLayout>
      <OnboardingTour />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/evidence" element={<Evidence />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/wage-estimate" element={<WageEstimate />} />
        <Route path="/next-steps" element={<NextSteps />} />
        <Route path="/case-packet" element={<CasePacket />} />
        <Route path="/similar-cases" element={<SimilarCases />} />
        <Route path="/advocates" element={<Advocates />} />
        <Route path="/settings" element={<Settings />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppLayout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <I18nProvider>
          <CaseProvider>
            <Shell />
          </CaseProvider>
        </I18nProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);


export default App;
