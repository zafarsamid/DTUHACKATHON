
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import Index from "./pages/Index";
import LoginPage from "./pages/auth/login";
import PatientDashboard from "./pages/patient/index";
import DoctorDashboard from "./pages/doctor/index";
import PharmacyDashboard from "./pages/pharmacy/index";
import PatientRecords from "./pages/patient/records/index";
import PatientAppointments from "./pages/patient/appointments/index";
import BillingPage from "./pages/billing/index";
import DiseasePredictionPage from "./pages/disease-prediction/index";
import SettingsPage from "./pages/settings/index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="healthsync-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/auth/login" replace />} />
            <Route path="/auth/login" element={<LoginPage />} />
            
            {/* Patient Routes */}
            <Route path="/patient" element={<DashboardLayout><PatientDashboard /></DashboardLayout>} />
            <Route path="/patient/records" element={<DashboardLayout><PatientRecords /></DashboardLayout>} />
            <Route path="/patient/appointments" element={<DashboardLayout><PatientAppointments /></DashboardLayout>} />
            <Route path="/patient/vitals" element={<DashboardLayout><div>Patient Vitals</div></DashboardLayout>} />
            
            {/* Doctor Routes */}
            <Route path="/doctor" element={<DashboardLayout><DoctorDashboard /></DashboardLayout>} />
            <Route path="/doctor/patients" element={<DashboardLayout><div>Doctor Patients</div></DashboardLayout>} />
            <Route path="/doctor/schedule" element={<DashboardLayout><div>Doctor Schedule</div></DashboardLayout>} />
            
            {/* Pharmacy Routes */}
            <Route path="/pharmacy" element={<DashboardLayout><PharmacyDashboard /></DashboardLayout>} />
            <Route path="/pharmacy/inventory" element={<DashboardLayout><div>Pharmacy Inventory</div></DashboardLayout>} />
            <Route path="/pharmacy/prescriptions" element={<DashboardLayout><div>Pharmacy Prescriptions</div></DashboardLayout>} />
            
            {/* Common Routes */}
            <Route path="/billing" element={<DashboardLayout><BillingPage /></DashboardLayout>} />
            <Route path="/disease-prediction" element={<DashboardLayout><DiseasePredictionPage /></DashboardLayout>} />
            <Route path="/settings" element={<DashboardLayout><SettingsPage /></DashboardLayout>} />
            
            {/* Catch All */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
