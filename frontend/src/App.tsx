import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import Report from "./pages/Report";
import Home from "./pages/Home";
import Reports from "./pages/Reports";
import MapPage from "./pages/MapPage";
import NotFound from "./pages/NotFound";
import TrashBin from "./pages/TrashBin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/melden/:binId" element={<Report />} />
          <Route path="/meldungen" element={<Reports />} />
          <Route path="/karte" element={<MapPage />} />
          <Route path="/eimer" element={<TrashBin />} />
          <Route path="/report/:binId" element={<Navigate to="/melden/1042" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
