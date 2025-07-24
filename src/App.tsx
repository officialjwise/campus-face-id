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
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import Colleges from "./pages/Colleges";
import Departments from "./pages/Departments";
import Login from "./pages/Login";
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
            
            <Route path="/login" element={<Login />} />
            
            {/* Admin routes with admin layout */}
            <Route path="/admin/*" element={
              <AdminLayout>
                <Routes>
                  <Route path="" element={<Admin />} />
                  <Route path="students" element={<Admin />} />
                  <Route path="colleges" element={<Colleges />} />
                  <Route path="departments" element={<Departments />} />
                  <Route path="reports" element={<div className="text-center py-8">Reports coming soon...</div>} />
                  <Route path="settings" element={<div className="text-center py-8">Settings coming soon...</div>} />
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