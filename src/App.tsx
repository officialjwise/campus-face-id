import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ApiProvider } from "@/providers/ApiProvider";
import { AdminLayout } from "@/layouts/AdminLayout";
import Navigation from "@/components/Navigation";
import ErrorBoundary from "@/components/ErrorBoundary";
import AuthGuard from "@/components/AuthGuard";
import Index from "./pages/Index";
import Register from "./pages/Register";
import Recognition from "./pages/Recognition";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import StudentManagement from "./pages/StudentManagement";
import Colleges from "./pages/Colleges";
import Departments from "./pages/Departments";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import RoomManagement from "./pages/RoomManagement";
import ExamHall from "./pages/ExamHall";
import RoomStatus from "./pages/RoomStatus";
import IndexLookup from "./pages/IndexLookup";
import ApiTest from "./pages/ApiTest";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const App = () => (
  <ErrorBoundary>
    <ApiProvider>
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
            
            {/* Exam Hall Route - Public access for students */}
            <Route path="/exam-hall" element={
              <div className="min-h-screen bg-background">
                <Navigation />
                <ExamHall />
              </div>
            } />
            
            {/* Room Status Board - Public access for monitoring */}
            <Route path="/room-status" element={
              <div className="min-h-screen bg-background">
                <Navigation />
                <RoomStatus />
              </div>
            } />
            
            {/* Quick Index Lookup - Public access for validation */}
            <Route path="/index-lookup" element={
              <div className="min-h-screen bg-background">
                <Navigation />
                <IndexLookup />
              </div>
            } />
            
            {/* API Test - Temporary for debugging */}
            <Route path="/api-test" element={
              <div className="min-h-screen bg-background">
                <Navigation />
                <ApiTest />
              </div>
            } />
            
            <Route path="/login" element={<Login />} />
            
            {/* Admin routes with admin layout - Protected */}
            <Route path="/admin/*" element={
              <AuthGuard>
                <AdminLayout>
                  <Routes>
                    <Route path="" element={<Admin />} />
                    <Route path="students" element={<StudentManagement />} />
                    <Route path="colleges" element={<Colleges />} />
                    <Route path="departments" element={<Departments />} />
                    <Route path="rooms" element={<RoomManagement />} />
                    <Route path="reports" element={<Reports />} />
                    <Route path="settings" element={<Settings />} />
                  </Routes>
                </AdminLayout>
              </AuthGuard>
            } />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </ApiProvider>
  </ErrorBoundary>
);

export default App;