import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, BarChart3, Building2, GraduationCap, Loader2, Activity, Zap } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
import { 
  useAdminStats, 
  useRegistrationTrends, 
  useCollegeDistribution, 
  useDepartmentEnrollment, 
  useSystemHealth 
} from "@/hooks/useAdmin";

const Admin = () => {
  // Fetch real data from analytics endpoints
  const { data: stats, isLoading: statsLoading, error: statsError } = useAdminStats();
  const { data: registrationTrends, isLoading: trendsLoading, error: trendsError } = useRegistrationTrends();
  const { data: collegeDistribution, isLoading: collegeLoading, error: collegeError } = useCollegeDistribution();
  const { data: departmentEnrollment, isLoading: departmentLoading, error: departmentError } = useDepartmentEnrollment();
  const { data: systemHealth, isLoading: healthLoading, error: healthError } = useSystemHealth();

  // Use mock stats as fallback if API fails
  const computedStats = {
    total_students: 1250,
    total_colleges: 8,
    total_departments: 45,
    recognition_events_today: 234,
    admins: 5
  };

  const finalStats = stats || computedStats;

  // Debug logging for API responses (remove in production)
  if (process.env.NODE_ENV === 'development') {
    console.log('Dashboard API Data:', {
      stats,
      registrationTrends,
      collegeDistribution,
      departmentEnrollment,
      systemHealth
    });
  }

  // Loading state - show loading if any core data is loading
  const isLoading = statsLoading || trendsLoading || collegeLoading || departmentLoading;
  
  if (isLoading && !finalStats) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading dashboard analytics...</span>
      </div>
    );
  }

  // Show error only if stats fail and we don't have computed stats
  const hasErrors = statsError || trendsError || collegeError || departmentError || healthError;
  
  if (statsError && !finalStats) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">University management system overview</p>
          </div>
          <Badge variant="destructive">
            API Connection Error
          </Badge>
        </div>
        <Card className="shadow-elegant">
          <CardContent className="p-6 text-center">
            <p className="text-destructive">Failed to load dashboard data. Please check your connection to the backend API.</p>
            <p className="text-sm text-muted-foreground mt-2">Backend URL: http://localhost:8000</p>
            {statsError && (
              <p className="text-sm text-muted-foreground mt-2">Stats Error: {statsError.message}</p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Use real data with fallback to mock data
  const registrationData = (Array.isArray(registrationTrends) ? registrationTrends : null) || [
    { month: "Feb", registrations: 45 },
    { month: "Mar", registrations: 52 },
    { month: "Apr", registrations: 48 },
    { month: "May", registrations: 61 },
    { month: "Jun", registrations: 55 },
    { month: "Jul", registrations: 67 }
  ];
  
  const collegeData = (Array.isArray(collegeDistribution) ? collegeDistribution?.map((item, index) => ({
    ...item,
    color: item.color || getDefaultColor(index)
  })) : null) || [
    { name: "Engineering College", value: 35, students_count: 437, color: "hsl(var(--primary))" },
    { name: "Business College", value: 25, students_count: 312, color: "hsl(210, 70%, 50%)" },
    { name: "Arts & Sciences", value: 20, students_count: 250, color: "hsl(150, 70%, 50%)" },
    { name: "Medical College", value: 20, students_count: 251, color: "hsl(30, 70%, 50%)" }
  ];
  
  const departmentData = (Array.isArray(departmentEnrollment) ? departmentEnrollment : null) || [
    { department: "Computer Science", students: 156, college_name: "Engineering College" },
    { department: "Business Admin", students: 134, college_name: "Business College" },
    { department: "Mechanical Eng", students: 128, college_name: "Engineering College" },
    { department: "Psychology", students: 95, college_name: "Arts & Sciences" },
    { department: "Medicine", students: 89, college_name: "Medical College" },
    { department: "Marketing", students: 78, college_name: "Business College" }
  ];
  
  // Convert system health metrics to performance data format
  const performanceData = systemHealth ? [
    { metric: "API Response Time", current: Math.min(100, (1000 - systemHealth.api_response_time) / 10), target: 90 },
    { metric: "Memory Usage", current: 100 - systemHealth.memory_usage, target: 80 },
    { metric: "CPU Usage", current: 100 - systemHealth.cpu_usage, target: 75 },
    { metric: "System Health", current: Math.min(100, systemHealth.uptime / 100), target: 95 }
  ] : [
    { metric: "Registration Rate", current: 92, target: 90 },
    { metric: "College Coverage", current: 85, target: 85 },
    { metric: "Department Active", current: 88, target: 88 },
    { metric: "System Health", current: 98, target: 95 }
  ];

  // Helper function for default colors
  const getDefaultColor = (index: number) => {
    const colors = [
      "hsl(var(--primary))",
      "hsl(210, 70%, 50%)",
      "hsl(150, 70%, 50%)",
      "hsl(30, 70%, 50%)",
      "hsl(280, 70%, 50%)",
      "hsl(0, 70%, 50%)"
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">University management system overview</p>
        </div>
        <div className="flex gap-2">
          {hasErrors && (
            <Badge variant="destructive">
              Some Data Unavailable
            </Badge>
          )}
          <Badge 
            variant="outline" 
            className={systemHealth?.uptime && systemHealth.uptime > 95 
              ? "bg-success/10 text-success" 
              : "bg-warning/10 text-warning"
            }
          >
            {systemHealth?.uptime && systemHealth.uptime > 95 
              ? "All Systems Operational" 
              : "System Monitoring"
            }
          </Badge>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <Card className="shadow-elegant">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold text-foreground">{finalStats?.total_students || 0}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-elegant">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Recognition Events</p>
                <p className="text-2xl font-bold text-success">{finalStats?.recognition_events_today || 0}</p>
              </div>
              <Badge className="bg-success/10 text-success">
                Today
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-elegant">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Colleges</p>
                <p className="text-2xl font-bold text-foreground">{finalStats?.total_colleges || 0}</p>
              </div>
              <Building2 className="h-8 w-8 text-info" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-elegant">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Departments</p>
                <p className="text-2xl font-bold text-foreground">{finalStats?.total_departments || 0}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-elegant">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold text-info">{systemHealth?.active_users || finalStats?.admins || 0}</p>
              </div>
              <Activity className="h-8 w-8 text-info" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-elegant">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">System Health</p>
                <p className="text-2xl font-bold text-success">
                  {systemHealth?.uptime ? `${Math.round(systemHealth.uptime)}%` : "✓"}
                </p>
              </div>
              <Zap className={`h-8 w-8 ${
                systemHealth?.uptime && systemHealth.uptime > 95 
                  ? "text-success" 
                  : "text-warning"
              }`} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Student Registrations
              {trendsLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            </CardTitle>
            <CardDescription>Monthly registration trends</CardDescription>
          </CardHeader>
          <CardContent>
            {trendsLoading ? (
              <div className="flex items-center justify-center h-[300px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading trends...</span>
              </div>
            ) : trendsError ? (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                <div className="text-center">
                  <p>Failed to load registration trends</p>
                  <p className="text-sm">Using fallback data</p>
                </div>
              </div>
            ) : registrationData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={registrationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="registrations" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No registration data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Students by College
              {collegeLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            </CardTitle>
            <CardDescription>Distribution across colleges</CardDescription>
          </CardHeader>
          <CardContent>
            {collegeLoading ? (
              <div className="flex items-center justify-center h-[300px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading distribution...</span>
              </div>
            ) : collegeError ? (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                <div className="text-center">
                  <p>Failed to load college distribution</p>
                  <p className="text-sm">Using fallback data</p>
                </div>
              </div>
            ) : collegeData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={collegeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {collegeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }} 
                      formatter={(value: any, name: any, props: any) => [
                        `${props.payload.students_count} students (${value}%)`,
                        props.payload.name
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-4 mt-4">
                  {collegeData.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-muted-foreground">
                        {item.name} ({item.students_count} students)
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No college data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Students by Department
              {departmentLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            </CardTitle>
            <CardDescription>Enrollment across departments</CardDescription>
          </CardHeader>
          <CardContent>
            {departmentLoading ? (
              <div className="flex items-center justify-center h-[300px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading departments...</span>
              </div>
            ) : departmentError ? (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                <div className="text-center">
                  <p>Failed to load department enrollment</p>
                  <p className="text-sm">Using fallback data</p>
                </div>
              </div>
            ) : departmentData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="department" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }} 
                    formatter={(value: any, name: any, props: any) => [
                      `${value} students`,
                      props.payload.college_name ? `${props.payload.department} (${props.payload.college_name})` : props.payload.department
                    ]}
                  />
                  <Bar 
                    dataKey="students" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No department data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics / System Health */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            System Health Metrics
            {healthLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          </CardTitle>
          <CardDescription>
            {systemHealth 
              ? `Real-time performance monitoring • Last updated: ${new Date(systemHealth.last_updated).toLocaleTimeString()}`
              : "Current performance vs targets"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {healthLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading system health...</span>
            </div>
          ) : performanceData.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {performanceData.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{item.metric}</span>
                      <span className="text-sm text-muted-foreground">{Math.round(item.current)}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          item.current >= item.target ? 'bg-success' : 'bg-warning'
                        }`}
                        style={{ width: `${Math.min(100, item.current)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Target: {item.target}%</span>
                      <span className={item.current >= item.target ? 'text-success' : 'text-warning'}>
                        {item.current >= item.target ? '✓ Met' : '△ Below'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {systemHealth && (
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <p className="text-muted-foreground">Response Time</p>
                      <p className="font-semibold">{systemHealth.api_response_time}ms</p>
                    </div>
                    <div className="text-center">
                      <p className="text-muted-foreground">DB Connections</p>
                      <p className="font-semibold">{systemHealth.database_connections}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-muted-foreground">Error Rate</p>
                      <p className="font-semibold">{systemHealth.error_rate}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-muted-foreground">Uptime</p>
                      <p className="font-semibold">{Math.round(systemHealth.uptime)}%</p>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              No system health metrics available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;