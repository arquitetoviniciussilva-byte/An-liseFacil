import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

import { DashboardLayout } from "./layouts/DashboardLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AnalysisList from "./pages/AnalysisList";
import NewAnalysis from "./pages/NewAnalysis";
import AnalysisDetails from "./pages/AnalysisDetails";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import WaitingApproval from "./pages/WaitingApproval";
import UserManagement from "./pages/admin/UserManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-right" />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Register />} />
            <Route path="/aguardando-aprovacao" element={<WaitingApproval />} />
            
            {/* Private Routes */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/analises" element={<AnalysisList />} />
              <Route path="/analises/nova" element={<NewAnalysis />} />
              <Route path="/analises/:id" element={<AnalysisDetails />} />
              <Route path="/aprovados" element={<AnalysisList />} />
              <Route path="/alvaras" element={<AnalysisList />} />
              <Route path="/configuracoes" element={<Settings />} />
              
              {/* Admin Only */}
              <Route path="/admin/usuarios" element={<UserManagement />} />
            </Route>
            
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;