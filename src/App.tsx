import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AdminLayout } from "@/layouts/AdminLayout";
import Navigation from "@/components/Navigation";
import Index from "./pages/Index";
import Register from "./pages/Register";
import Recognition from "./pages/Recognition";
import Admin from "./pages/Admin";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Client routes with regular navigation */}
            <Route path="/" element={
              <div className="min-h-screen bg-background">
                <Navigation />
                <Index />
              </div>
            } />
            <Route path="/register" element={
              <div className="min-h-screen bg-background">
                <Navigation />
                <Register />
              </div>
            } />
            <Route path="/recognition" element={
              <div className="min-h-screen bg-background">
                <Navigation />
                <Recognition />
              </div>
            } />
            <Route path="/contact" element={
              <div className="min-h-screen bg-background">
                <Navigation />
                <Contact />
              </div>
            } />
            
            {/* Admin routes with admin layout */}
            <Route path="/admin/*" element={
              <AdminLayout>
                <Routes>
                  <Route path="/" element={<Admin />} />
                  <Route path="/students" element={<Admin />} />
                  <Route path="/recognition" element={<Admin />} />
                  <Route path="/reports" element={<Admin />} />
                  <Route path="/settings" element={<Admin />} />
                </Routes>
              </AdminLayout>
            } />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
