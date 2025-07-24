import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, BarChart3, Building2, GraduationCap } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts";

const Admin = () => {
  // Mock statistics data for dashboard
  const stats = {
    totalStudents: 594,
    activeStudents: 569,
    inactiveStudents: 25,
    recentRegistrations: 23,
    totalColleges: 4,
    totalDepartments: 12,
  };

  // Chart data
  const registrationData = [
    { month: "Jan", registrations: 45 },
    { month: "Feb", registrations: 52 },
    { month: "Mar", registrations: 48 },
    { month: "Apr", registrations: 61 },
    { month: "May", registrations: 57 },
    { month: "Jun", registrations: 73 },
  ];

  const collegeData = [
    { name: "Computing", value: 45, color: "hsl(var(--primary))" },
    { name: "Engineering", value: 25, color: "hsl(var(--success))" },
    { name: "Business", value: 20, color: "hsl(var(--warning))" },
    { name: "Arts & Sciences", value: 10, color: "hsl(var(--info))" },
  ];

  const departmentData = [
    { department: "Computer Science", students: 156 },
    { department: "Information Technology", students: 89 },
    { department: "Civil Engineering", students: 78 },
    { department: "Business Admin", students: 67 },
    { department: "Mechanical Eng", students: 55 },
    { department: "Arts & Design", students: 43 },
  ];

  const performanceData = [
    { metric: "Registration Rate", current: 94, target: 90 },
    { metric: "Completion Rate", current: 87, target: 85 },
    { metric: "Satisfaction", current: 92, target: 88 },
    { metric: "Retention", current: 89, target: 90 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">University management system overview</p>
        </div>
        <Badge variant="outline" className="bg-success/10 text-success">
          All Systems Operational
        </Badge>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <Card className="shadow-elegant">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalStudents}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-elegant">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Students</p>
                <p className="text-2xl font-bold text-success">{stats.activeStudents}</p>
              </div>
              <Badge className="bg-success/10 text-success">
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-elegant">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Inactive Students</p>
                <p className="text-2xl font-bold text-destructive">{stats.inactiveStudents}</p>
              </div>
              <Badge variant="destructive">
                Inactive
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-elegant">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Recent (7 days)</p>
                <p className="text-2xl font-bold text-primary">{stats.recentRegistrations}</p>
              </div>
              <Badge className="bg-primary/10 text-primary">
                New
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-elegant">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Colleges</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalColleges}</p>
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
                <p className="text-2xl font-bold text-foreground">{stats.totalDepartments}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-warning" />
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
            </CardTitle>
            <CardDescription>Monthly registration trends</CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Students by College
            </CardTitle>
            <CardDescription>Distribution across colleges</CardDescription>
          </CardHeader>
          <CardContent>
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
                  <span className="text-sm text-muted-foreground">{item.name} ({item.value}%)</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Students by Department
            </CardTitle>
            <CardDescription>Enrollment across departments</CardDescription>
          </CardHeader>
          <CardContent>
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
                />
                <Bar 
                  dataKey="students" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Key Performance Indicators
          </CardTitle>
          <CardDescription>Current performance vs targets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {performanceData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{item.metric}</span>
                  <span className="text-sm text-muted-foreground">{item.current}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      item.current >= item.target ? 'bg-success' : 'bg-warning'
                    }`}
                    style={{ width: `${item.current}%` }}
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
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;