import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, Users, Search, Plus, Edit, Trash2, Download, Building2 } from "lucide-react";
import { StudentModal } from "@/components/modals/StudentModal";
import { useToast } from "@/hooks/use-toast";

interface Student {
  id: string;
  studentId: string;
  indexNumber: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  fullName: string;
  college: string;
  department: string;
  email: string;
  profileImage?: string;
  registrationDate: string;
  status: "active" | "inactive";
}

const StudentManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | undefined>();
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const { toast } = useToast();

  // Mock data - in real app, fetch from backend
  const [students, setStudents] = useState<Student[]>([
    {
      id: "1",
      studentId: "STU12345",
      indexNumber: "IND2401",
      firstName: "John",
      middleName: "Michael",
      lastName: "Doe",
      fullName: "John Michael Doe",
      college: "College of Computing",
      department: "Computer Science",
      email: "john.doe@university.edu",
      profileImage: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400",
      registrationDate: "2024-01-15",
      status: "active",
    },
    {
      id: "2",
      studentId: "STU67890",
      indexNumber: "IND2402",
      firstName: "Jane",
      lastName: "Smith",
      fullName: "Jane Smith",
      college: "College of Computing",
      department: "Information Technology",
      email: "jane.smith@university.edu",
      profileImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400",
      registrationDate: "2024-01-16",
      status: "active",
    },
    {
      id: "3",
      studentId: "STU11111",
      indexNumber: "IND2403",
      firstName: "Mike",
      lastName: "Johnson",
      fullName: "Mike Johnson",
      college: "College of Engineering",
      department: "Civil Engineering",
      email: "mike.johnson@university.edu",
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      registrationDate: "2024-01-17",
      status: "inactive",
    },
    {
      id: "4",
      studentId: "STU22222",
      indexNumber: "IND2404",
      firstName: "Sarah",
      middleName: "Elizabeth",
      lastName: "Wilson",
      fullName: "Sarah Elizabeth Wilson",
      college: "College of Business",
      department: "Business Administration",
      email: "sarah.wilson@university.edu",
      profileImage: "https://images.unsplash.com/photo-1494790108755-2616b6f6d16b?w=400",
      registrationDate: "2024-01-18",
      status: "active",
    },
  ]);

  const departments = ["all", "Computer Science", "Information Technology", "Civil Engineering", "Business Administration"];

  const handleCreateStudent = () => {
    setSelectedStudent(undefined);
    setModalMode("create");
    setModalOpen(true);
  };

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setModalMode("edit");
    setModalOpen(true);
  };

  const handleDeleteStudent = (student: Student) => {
    setStudents(students.filter(s => s.id !== student.id));
    toast({
      title: "Student deleted",
      description: `${student.fullName} has been removed successfully.`,
    });
  };

  const handleSubmitStudent = (studentData: Student) => {
    if (modalMode === "create") {
      const newStudent = {
        ...studentData,
        id: Date.now().toString(),
        registrationDate: new Date().toISOString().split('T')[0],
        status: "active" as const,
      };
      setStudents([...students, newStudent]);
      toast({
        title: "Student created",
        description: `${studentData.fullName} has been added successfully.`,
      });
    } else {
      setStudents(students.map(s => 
        s.id === selectedStudent?.id ? { ...studentData, id: s.id } : s
      ));
      toast({
        title: "Student updated",
        description: `${studentData.fullName} has been updated successfully.`,
      });
    }
  };

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Student Management</h1>
          <p className="text-muted-foreground">Manage student registrations and data</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <p className="text-2xl font-bold text-success">{stats.active}</p>
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
                <p className="text-2xl font-bold text-destructive">{stats.inactive}</p>
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
      </div>

      {/* Student Management */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Student Records
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
              <Button onClick={handleCreateStudent}>
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
                  <TableHead>Student</TableHead>
                  <TableHead>Student ID</TableHead>
                  <TableHead>College</TableHead>
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
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={student.profileImage} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {student.fullName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{student.fullName}</p>
                          <p className="text-sm text-muted-foreground">{student.indexNumber}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{student.studentId}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{student.college}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{student.department}</Badge>
                    </TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={student.status === "active" ? "default" : "destructive"}
                        className={student.status === "active" ? "bg-success/10 text-success" : ""}
                      >
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(student.registrationDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditStudent(student)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteStudent(student)}
                        >
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

      <StudentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitStudent}
        student={selectedStudent}
        mode={modalMode}
      />
    </div>
  );
};

export default StudentManagement;