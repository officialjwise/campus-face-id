import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Camera,
  FileText,
  Settings,
  LogOut,
  Building2,
  BookOpen,
  ChevronDown,
  Menu,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const menuItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    title: "Student Management",
    url: "/admin/students",
    icon: Users,
    badge: "124",
  },
  {
    title: "Colleges",
    url: "/admin/colleges",
    icon: Building2,
    badge: "3",
  },
  {
    title: "Departments",
    url: "/admin/departments",
    icon: BookOpen,
    badge: "8",
  },
  {
    title: "Reports",
    url: "/admin/reports",
    icon: FileText,
    badge: null,
  },
];

const settingsItems = [
  {
    title: "System Settings",
    url: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const { open, setOpen } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  // Collapsible state for submenus
  const [openColleges, setOpenColleges] = useState(false);
  const [openDepartments, setOpenDepartments] = useState(false);

  const isActive = (path: string) => {
    if (path === "/admin") {
      return currentPath === "/admin";
    }
    return currentPath === path || currentPath.startsWith(path + "/");
  };

  const getNavClass = (path: string) => {
    const active = isActive(path);
    return `flex items-center px-2 py-2 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-sidebar-accent/40 ${
      active
        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
        : "hover:bg-sidebar-accent/50 text-sidebar-foreground hover:text-sidebar-accent-foreground"
    }`;
  };

  return (
    <Sidebar
      className="border-r border-sidebar-border bg-sidebar transition-all duration-200"
      collapsible="icon"
      style={{ background: 'var(--sidebar-bg, #18181b)' }}
    >
      {/* Header */}
      <div className="px-2 py-2 border-b border-sidebar-border flex items-center justify-between">
        {open && (
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
              <LayoutDashboard className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-sidebar-foreground">
                Admin Panel
              </h2>
              <p className="text-xs text-sidebar-foreground/60">
                University System
              </p>
            </div>
          </div>
        )}
        <SidebarTrigger className="shrink-0" />
      </div>

      {/* Menu content */}
      <div className="flex-grow overflow-y-auto px-2 py-3">
        {/* Navigation section */}
        <div className="mb-4">
          {open && (
            <div className="text-sidebar-foreground/60 text-xs uppercase tracking-wide mb-2 px-2">
              Navigation
            </div>
          )}
          <ul className="space-y-1">
            {/* Dashboard */}
            <li>
              <NavLink to="/admin" className={getNavClass("/admin")}> 
                <LayoutDashboard className={`w-4 h-4 flex-shrink-0 ${open ? "mr-2" : "mx-auto"}`} />
                {open && <span className="flex-1 text-sm">Dashboard</span>}
              </NavLink>
            </li>
            
            {/* Student Management */}
            <li>
              <NavLink to="/admin/students" className={getNavClass("/admin/students")}> 
                <Users className={`w-4 h-4 flex-shrink-0 ${open ? "mr-2" : "mx-auto"}`} />
                {open && <span className="flex-1 text-sm">Student Management</span>}
                {open && <Badge variant="secondary" className="ml-1 bg-primary/10 text-primary text-xs px-1.5 py-0.5">124</Badge>}
              </NavLink>
            </li>
            
            {/* Colleges */}
            <li>
              <NavLink to="/admin/colleges" className={getNavClass("/admin/colleges")}> 
                <Building2 className={`w-4 h-4 flex-shrink-0 ${open ? "mr-2" : "mx-auto"}`} />
                {open && <span className="flex-1 text-sm">Colleges</span>}
                {open && <Badge variant="secondary" className="ml-1 bg-primary/10 text-primary text-xs px-1.5 py-0.5">3</Badge>}
              </NavLink>
            </li>
            
            {/* Departments */}
            <li>
              <NavLink to="/admin/departments" className={getNavClass("/admin/departments")}> 
                <BookOpen className={`w-4 h-4 flex-shrink-0 ${open ? "mr-2" : "mx-auto"}`} />
                {open && <span className="flex-1 text-sm">Departments</span>}
                {open && <Badge variant="secondary" className="ml-1 bg-primary/10 text-primary text-xs px-1.5 py-0.5">8</Badge>}
              </NavLink>
            </li>
            
            {/* Reports */}
            <li>
              <NavLink to="/admin/reports" className={getNavClass("/admin/reports")}> 
                <FileText className={`w-4 h-4 flex-shrink-0 ${open ? "mr-2" : "mx-auto"}`} />
                {open && <span className="flex-1 text-sm">Reports</span>}
              </NavLink>
            </li>
          </ul>
        </div>
        
        {/* Subtle separator */}
        <div className="my-3">
          <div className="h-px bg-sidebar-border/60 w-full" />
        </div>
        
        {/* Settings section */}
        <div className="mt-3">
          {open && (
            <div className="text-sidebar-foreground/60 text-xs uppercase tracking-wide mb-2 px-2">
              Settings
            </div>
          )}
          <ul className="space-y-1">
            {settingsItems.map((item) => (
              <li key={item.title}>
                <NavLink to={item.url} className={getNavClass(item.url)}>
                  <item.icon className={`w-4 h-4 flex-shrink-0 ${open ? "mr-2" : "mx-auto"}`} />
                  {open && <span className="text-sm">{item.title}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto p-2 border-t border-sidebar-border">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-primary-foreground">
              A
            </span>
          </div>
          {open && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                Admin User
              </p>
              <p className="text-xs text-sidebar-foreground/60 truncate">
                admin@university.edu
              </p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="text-sidebar-foreground/60 hover:text-sidebar-foreground p-1 shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Sidebar>
  );
}