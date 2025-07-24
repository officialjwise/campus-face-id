import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, UserPlus, Scan, Settings } from "lucide-react";

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { to: "/", label: "Home", icon: GraduationCap },
    { to: "/register", label: "Register", icon: UserPlus },
    { to: "/recognition", label: "Recognition", icon: Scan },
    { to: "/contact", label: "Contact", icon: Settings },
  ];

  return (
    <nav className="glass-card border-b border-border/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-foreground">
                AI Student Registry
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              
              return (
                <Link key={item.to} to={item.to}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`flex items-center space-x-2 glow-hover transition-all duration-300 ${
                      isActive ? "glow-border" : ""
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;