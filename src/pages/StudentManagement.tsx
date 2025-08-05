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
import { useStudents, useDeleteStudent } from "@/hooks/useStudents";
import type { Student } from "@/types/api";

const StudentManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | undefined>();
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const { toast } = useToast();

  // Fetch students from API
  const { data: studentsResponse, isLoading, error, refetch } = useStudents();
  const deleteStudentMutation = useDeleteStudent();

  const students = studentsResponse?.items || [];

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

  const handleDeleteStudent = async (student: Student) => {
    try {
      await deleteStudentMutation.mutateAsync(student.id);
      refetch(); // Refetch the students list
      toast({
        title: "Student Deleted",
        description: `${student.first_name} ${student.last_name} has been removed successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete student. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmitStudent = (studentData: Student) => {
    if (modalMode === "create") {
      // This would typically call a create API
      refetch();
      toast({
        title: "Student created",
        description: `${studentData.first_name} ${studentData.last_name} has been added successfully.`,
      });
    } else {
      // This would typically call an update API
      refetch();
      toast({
        title: "Student updated", 
        description: `${studentData.first_name} ${studentData.last_name} has been updated successfully.`,
      });
    }
  };

  const filteredStudents = students.filter(student => {
    const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                         (student.student_id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === "all" || 
                             (student.department && student.department.name === selectedDepartment);
    return matchesSearch && matchesDepartment;
  });

  const stats = {
    total: students.length,
    active: students.length, // All students are considered active since we don't have a status field
    inactive: 0, // No inactive students
    recentRegistrations: students.filter(s => {
      if (!s.created_at) return false;
      const regDate = new Date(s.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return regDate >= weekAgo;
    }).length,
  };

  return (
    <div className="space-y-6">
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <p>Loading students...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded">
          <p>Error loading students: {error instanceof Error ? error.message : 'Unknown error'}</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refetch()}
            className="mt-2"
          >
            Retry
          </Button>
        </div>
      )}

      {!isLoading && !error && (
        <>
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
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {student.first_name[0]}{student.last_name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{student.first_name} {student.last_name}</p>
                          <p className="text-sm text-muted-foreground">{student.student_id || 'N/A'}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{student.student_id || 'N/A'}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{student.college?.name || 'N/A'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{student.department?.name || 'N/A'}</Badge>
                    </TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>
                      <Badge variant="default" className="bg-success/10 text-success">
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {student.created_at ? new Date(student.created_at).toLocaleDateString() : 'N/A'}
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

      {/* TODO: Fix StudentModal to work with API Student type
      <StudentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitStudent}
        student={selectedStudent}
        mode={modalMode}
      />
      */}
      </>
      )}
    </div>
  );
};

export default StudentManagement;