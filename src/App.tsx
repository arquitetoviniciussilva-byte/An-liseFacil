import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { DashboardLayout } from "./layouts/DashboardLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AnalysisList from "./pages/AnalysisList";
import NewAnalysis from "./pages/NewAnalysis";
import AnalysisDetails from "./pages/AnalysisDetails";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-right" />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Register />} />
          
          {/* Private Routes (Layout) */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analises" element={<AnalysisList />} />
            <Route path="/analises/nova" element={<NewAnalysis />} />
            <Route path="/analises/:id" element={<AnalysisDetails />} />
            <Route path="/aprovados" element={<AnalysisList />} /> {/* Reusing list for now */}
            <Route path="/alvaras" element={<AnalysisList />} /> {/* Reusing list for now */}
            <Route path="/configuracoes" element={<Settings />} />
          </Route>

          {/* Root Redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;