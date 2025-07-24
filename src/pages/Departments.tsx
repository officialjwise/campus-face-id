import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookOpen, Search, Plus, Edit, Trash2, Building2, User } from "lucide-react";
import { DepartmentModal } from "@/components/modals/DepartmentModal";
import { useToast } from "@/hooks/use-toast";

interface Department {
  id: string;
  name: string;
  college: string;
  description?: string;
  head?: string;
  createdAt: string;
}

const Departments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCollege, setSelectedCollege] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | undefined>();
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const { toast } = useToast();

  // Mock data - in real app, fetch from backend
  const [departments, setDepartments] = useState<Department[]>([
    {
      id: "1",
      name: "Computer Science",
      college: "College of Computing",
      description: "Advanced computer science education with focus on algorithms and software development",
      head: "Dr. John Smith",
      createdAt: "2024-01-10",
    },
    {
      id: "2",
      name: "Information Technology",
      college: "College of Computing",
      description: "Practical IT skills and enterprise technology solutions",
      head: "Dr. Sarah Johnson",
      createdAt: "2024-01-15",
    },
    {
      id: "3",
      name: "Civil Engineering",
      college: "College of Engineering",
      description: "Infrastructure design and construction engineering",
      head: "Dr. Michael Brown",
      createdAt: "2024-01-20",
    },
    {
      id: "4",
      name: "Business Administration",
      college: "College of Business",
      description: "Comprehensive business management and leadership training",
      head: "Dr. Emily Davis",
      createdAt: "2024-01-25",
    },
  ]);

  const colleges = ["all", "College of Computing", "College of Engineering", "College of Business"];

  const filteredDepartments = departments.filter(dept => {
    const matchesSearch = dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dept.college.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (dept.head && dept.head.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCollege = selectedCollege === "all" || dept.college === selectedCollege;
    return matchesSearch && matchesCollege;
  });

  const stats = {
    total: departments.length,
    withHeads: departments.filter(d => d.head).length,
    byCollege: colleges.slice(1).map(college => ({
      name: college,
      count: departments.filter(d => d.college === college).length
    }))
  };

  const handleCreateDepartment = () => {
    setSelectedDepartment(undefined);
    setModalMode("create");
    setModalOpen(true);
  };

  const handleEditDepartment = (department: Department) => {
    setSelectedDepartment(department);
    setModalMode("edit");
    setModalOpen(true);
  };

  const handleDeleteDepartment = (department: Department) => {
    setDepartments(departments.filter(d => d.id !== department.id));
    toast({
      title: "Department deleted",
      description: `${department.name} has been removed successfully.`,
    });
  };

  const handleSubmitDepartment = (departmentData: Department) => {
    if (modalMode === "create") {
      const newDepartment = {
        ...departmentData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0],
      };
      setDepartments([...departments, newDepartment]);
      toast({
        title: "Department created",
        description: `${departmentData.name} has been added successfully.`,
      });
    } else {
      setDepartments(departments.map(d => 
        d.id === selectedDepartment?.id ? { ...departmentData, id: d.id } : d
      ));
      toast({
        title: "Department updated",
        description: `${departmentData.name} has been updated successfully.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" />
            Departments Management
          </h1>
          <p className="text-muted-foreground">Manage departments across all colleges</p>
        </div>
        <Button onClick={handleCreateDepartment}>
          <Plus className="h-4 w-4 mr-2" />
          Add Department
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Departments</p>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              </div>
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">With Department Heads</p>
                <p className="text-2xl font-bold text-success">{stats.withHeads}</p>
              </div>
              <User className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        {stats.byCollege.slice(0, 2).map((college, index) => (
          <Card key={college.name} className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{college.name.replace('College of ', '')}</p>
                  <p className="text-2xl font-bold text-primary">{college.count}</p>
                </div>
                <Building2 className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Departments Management */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                All Departments
              </CardTitle>
              <CardDescription>
                View and manage all departments in the system
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search departments, colleges, or heads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedCollege}
              onChange={(e) => setSelectedCollege(e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-background text-foreground"
            >
              {colleges.map(college => (
                <option key={college} value={college}>
                  {college === "all" ? "All Colleges" : college}
                </option>
              ))}
            </select>
          </div>

          {/* Departments Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department Name</TableHead>
                  <TableHead>College</TableHead>
                  <TableHead>Department Head</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDepartments.map((department) => (
                  <TableRow key={department.id}>
                    <TableCell className="font-medium">{department.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{department.college}</Badge>
                    </TableCell>
                    <TableCell>{department.head || "Not assigned"}</TableCell>
                    <TableCell className="max-w-xs">
                      <p className="truncate">{department.description || "No description"}</p>
                    </TableCell>
                    <TableCell>
                      {new Date(department.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditDepartment(department)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteDepartment(department)}
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

          {filteredDepartments.length === 0 && (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground">No departments found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or add a new department.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <DepartmentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitDepartment}
        department={selectedDepartment}
        mode={modalMode}
      />
    </div>
  );
};

export default Departments;