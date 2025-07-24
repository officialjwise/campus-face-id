import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, UserPlus, Scan, Settings, Users, Camera, Shield } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <div className="bg-gradient-primary text-primary-foreground py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <GraduationCap className="h-16 w-16 mr-4" />
            <h1 className="text-5xl font-bold">Student Registry</h1>
          </div>
          <p className="text-xl mb-8 text-primary-foreground/90 max-w-3xl mx-auto">
            Advanced Student Registration & Facial Recognition System for modern educational institutions
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge className="bg-primary-foreground/20 text-primary-foreground px-4 py-2">
              <Camera className="h-4 w-4 mr-2" />
              Live Camera Integration
            </Badge>
            <Badge className="bg-primary-foreground/20 text-primary-foreground px-4 py-2">
              <Shield className="h-4 w-4 mr-2" />
              Facial Recognition
            </Badge>
            <Badge className="bg-primary-foreground/20 text-primary-foreground px-4 py-2">
              <Users className="h-4 w-4 mr-2" />
              Student Management
            </Badge>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">System Features</h2>
            <p className="text-lg text-muted-foreground">
              Comprehensive tools for student registration and identification
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Student Registration */}
            <Card className="shadow-elegant hover:shadow-glow transition-smooth group">
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-lg mb-4 group-hover:scale-110 transition-smooth">
                  <UserPlus className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>Student Registration</CardTitle>
                <CardDescription>
                  Register new students with comprehensive details and live photo capture
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                  <li>• Complete student information form</li>
                  <li>• Live camera integration</li>
                  <li>• Department management</li>
                  <li>• Email validation</li>
                </ul>
                <Link to="/register">
                  <Button variant="hero" className="w-full">
                    Register Student
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Facial Recognition */}
            <Card className="shadow-elegant hover:shadow-glow transition-smooth group">
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-lg mb-4 group-hover:scale-110 transition-smooth">
                  <Scan className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>Facial Recognition</CardTitle>
                <CardDescription>
                  Identify students instantly using advanced facial recognition technology
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                  <li>• Real-time face scanning</li>
                  <li>• Instant student identification</li>
                  <li>• Complete profile display</li>
                  <li>• Attendance tracking</li>
                </ul>
                <Link to="/recognition">
                  <Button variant="hero" className="w-full">
                    Start Recognition
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Admin Panel */}
            <Card className="shadow-elegant hover:shadow-glow transition-smooth group">
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-lg mb-4 group-hover:scale-110 transition-smooth">
                  <Settings className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>Admin Panel</CardTitle>
                <CardDescription>
                  Comprehensive management dashboard for administrators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                  <li>• Student database management</li>
                  <li>• Search and filtering</li>
                  <li>• Analytics dashboard</li>
                  <li>• Data export capabilities</li>
                </ul>
                <Link to="/admin">
                  <Button variant="hero" className="w-full">
                    Access Admin
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">98%</div>
              <div className="text-muted-foreground">Recognition Accuracy</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">&lt;2s</div>
              <div className="text-muted-foreground">Average Processing Time</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">System Availability</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
