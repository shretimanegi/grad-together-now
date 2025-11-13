import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AlumniDashboard from "./pages/alumni/Dashboard";
import AlumniDirectory from "./pages/alumni/Directory";
import AlumniEvents from "./pages/alumni/Events";
import AlumniJobs from "./pages/alumni/Jobs";
import AlumniDonations from "./pages/alumni/Donations";
import AlumniMentorship from "./pages/alumni/Mentorship";
import StudentDashboard from "./pages/student/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/alumni/dashboard" element={<AlumniDashboard />} />
            <Route path="/alumni/directory" element={<AlumniDirectory />} />
            <Route path="/alumni/events" element={<AlumniEvents />} />
            <Route path="/alumni/jobs" element={<AlumniJobs />} />
            <Route path="/alumni/donations" element={<AlumniDonations />} />
            <Route path="/alumni/mentorship" element={<AlumniMentorship />} />
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/alumni" element={<AlumniDirectory />} />
            <Route path="/student/events" element={<AlumniEvents />} />
            <Route path="/student/jobs" element={<AlumniJobs />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
