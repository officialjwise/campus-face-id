import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Settings, Users, Search, Plus, Edit, Trash2, Download } from "lucide-react";

interface Student {
  id: string;
  studentId: string;
  indexNumber: string;
  fullName: string;
  college: string;
  department: string;
  email: string;
  registrationDate: string;
  status: "active" | "inactive";
}

const Admin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  // Mock data - in real app, fetch from backend
  const [students] = useState<Student[]>([
    {
      id: "1",
      studentId: "STU001",
      indexNumber: "IND2024001",
      fullName: "John Doe",
      college: "College of Computing",
      department: "Computer Science",
      email: "john.doe@university.edu",
      registrationDate: "2024-01-15",
      status: "active",
    },
    {
      id: "2",
      studentId: "STU002",
      indexNumber: "IND2024002",
      fullName: "Jane Smith",
      college: "College of Computing",
      department: "Information Technology",
      email: "jane.smith@university.edu",
      registrationDate: "2024-01-16",
      status: "active",
    },
    {
      id: "3",
      studentId: "STU003",
      indexNumber: "IND2024003",
      fullName: "Mike Johnson",
      college: "College of Engineering",
      department: "Engineering",
      email: "mike.johnson@university.edu",
      registrationDate: "2024-01-17",
      status: "inactive",
    },
  ]);

  const departments = ["all", "Computer Science", "Information Technology", "Engineering", "Business Administration"];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === "all" || student.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const stats = {
    total: students.length,
    active: students.filter(s => s.status === "active").length,
    inactive: students.filter(s => s.status === "inactive").length,
    recentRegistrations: students.filter(s => {
      const regDate = new Date(s.registrationDate);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return regDate >= weekAgo;
    }).length,
  };

  return (
    <div className="min-h-screen bg-gradient-subtle py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Admin Panel</h1>
          <p className="text-lg text-muted-foreground">Manage students, departments, and system settings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-elegant">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                  <p className="text-2xl font-bold text-foreground">{stats.total}</p>
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
                  <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                </div>
                <Badge variant="default" className="bg-green-100 text-green-800">
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
                  <p className="text-2xl font-bold text-red-600">{stats.inactive}</p>
                </div>
                <Badge variant="destructive" className="bg-red-100 text-red-800">
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
        </div>

        {/* Student Management */}
        <Card className="shadow-elegant">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  Student Management
                </CardTitle>
                <CardDescription>
                  View, search, and manage all registered students
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
                <Button variant="hero">
                  <Plus className="h-4 w-4" />
                  Add Student
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students by name, ID, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-3 py-2 border border-input rounded-md bg-background text-foreground"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>
                    {dept === "all" ? "All Departments" : dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Students Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Registered</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.studentId}</TableCell>
                      <TableCell>{student.fullName}</TableCell>
                      <TableCell>{student.department}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={student.status === "active" ? "default" : "destructive"}
                          className={student.status === "active" ? "bg-green-100 text-green-800" : ""}
                        >
                          {student.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(student.registrationDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredStudents.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground">No students found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or add a new student.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;