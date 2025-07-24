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

  const isActive = (path: string) => {
    if (path === "/admin") {
      return currentPath === "/admin";
    }
    return currentPath.startsWith(path);
  };

  const getNavClass = (path: string) => {
    const active = isActive(path);
    return active
      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
      : "hover:bg-sidebar-accent/50 text-sidebar-foreground hover:text-sidebar-accent-foreground";
  };

  return (
    <Sidebar
      className="border-r border-sidebar-border bg-sidebar"
      collapsible="icon"
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          {open && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-sidebar-foreground">
                  Admin Panel
                </h2>
                <p className="text-xs text-sidebar-foreground/60">
                  University System
                </p>
              </div>
            </div>
          )}
          <SidebarTrigger className="ml-auto" />
        </div>
      </div>

      <SidebarContent className="p-4">
        {/* Main Navigation */}
        <SidebarGroup>
          {open && (
            <SidebarGroupLabel className="text-sidebar-foreground/60 text-xs uppercase tracking-wide mb-3">
              Navigation
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={`flex items-center px-3 py-2 rounded-lg transition-colors ${getNavClass(
                        item.url
                      )}`}
                    >
                      <item.icon className={`w-5 h-5 flex-shrink-0 ${open ? "mr-3" : ""}`} />
                      {open && (
                        <>
                          <span className="flex-1">{item.title}</span>
                          {item.badge && (
                            <Badge
                              variant="secondary"
                              className="ml-2 bg-primary/10 text-primary text-xs"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings */}
        <SidebarGroup className="mt-8">
          {open && (
            <SidebarGroupLabel className="text-sidebar-foreground/60 text-xs uppercase tracking-wide mb-3">
              Settings
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={`flex items-center px-3 py-2 rounded-lg transition-colors ${getNavClass(
                        item.url
                      )}`}
                    >
                      <item.icon className={`w-5 h-5 flex-shrink-0 ${open ? "mr-3" : ""}`} />
                      {open && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>

      {/* Footer */}
      <div className="mt-auto p-4 border-t border-sidebar-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
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
            className="text-sidebar-foreground/60 hover:text-sidebar-foreground p-1"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Sidebar>
  );
}