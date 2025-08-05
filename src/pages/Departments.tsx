import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookOpen, Search, Plus, Edit, Trash2, Building2, User } from "lucide-react";
import { DepartmentModal } from "@/components/modals/DepartmentModal";
import { useToast } from "@/hooks/use-toast";
import { useDepartments, useDeleteDepartment, useCreateDepartment, useUpdateDepartment } from "@/hooks/useDepartments";
import { useColleges } from "@/hooks/useColleges";
import type { Department } from "@/types/api";

const Departments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCollege, setSelectedCollege] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | undefined>();
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const { toast } = useToast();

  // Fetch data from API
  const { data: departments, isLoading: departmentsLoading, error: departmentsError, refetch } = useDepartments();
  const { data: colleges } = useColleges();
  const deleteDepartmentMutation = useDeleteDepartment();
  const createDepartmentMutation = useCreateDepartment();
  const updateDepartmentMutation = useUpdateDepartment();

  const departmentsList = departments || [];
  const collegesList = colleges || [];

  // Create colleges options for filter
  const collegeOptions = ["all", ...collegesList.map(college => college.name)];

  const filteredDepartments = departmentsList.filter(dept => {
    const matchesSearch = dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (dept.description && dept.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (dept.department_head && dept.department_head.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCollege = selectedCollege === "all" || 
                          (collegesList.find(college => college.id === dept.college_id)?.name === selectedCollege);
    return matchesSearch && matchesCollege;
  });

  const stats = {
    total: departmentsList.length,
    withHeads: departmentsList.filter(d => d.department_head).length,
    byCollege: collegesList.map(college => ({
      name: college.name,
      count: departmentsList.filter(d => d.college_id === college.id).length
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

  const handleDeleteDepartment = async (department: Department) => {
    try {
      await deleteDepartmentMutation.mutateAsync(department.id);
      refetch(); // Refetch the departments list
      toast({
        title: "Department Deleted",
        description: `${department.name} has been removed successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete department. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmitDepartment = async (departmentData: Department) => {
    try {
      if (modalMode === "create") {
        // Create new department
        const createData = {
          name: departmentData.name,
          college_id: departmentData.college_id,
          description: departmentData.description,
          department_head: departmentData.department_head
        };
        
        await createDepartmentMutation.mutateAsync(createData);
        toast({
          title: "Department Created",
          description: `${departmentData.name} has been added successfully.`,
        });
      } else {
        // Update existing department
        if (!selectedDepartment?.id) {
          throw new Error("No department selected for update");
        }
        
        const updateData = {
          name: departmentData.name,
          description: departmentData.description,
          department_head: departmentData.department_head
        };
        
        await updateDepartmentMutation.mutateAsync({
          id: selectedDepartment.id,
          data: updateData
        });
        
        toast({
          title: "Department Updated",
          description: `${departmentData.name} has been updated successfully.`,
        });
      }
      
      setModalOpen(false);
      refetch(); // Refresh the list
      
    } catch (error) {
      console.error('Department operation failed:', error);
      toast({
        title: "Error",
        description: `Failed to ${modalMode === "create" ? "create" : "update"} department. Please try again.`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {departmentsLoading && (
        <div className="flex items-center justify-center py-8">
          <p>Loading departments...</p>
        </div>
      )}
      
      {departmentsError && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded">
          <p>Error loading departments: {departmentsError instanceof Error ? departmentsError.message : 'Unknown error'}</p>
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

      {!departmentsLoading && !departmentsError && (
        <>
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
              {collegeOptions.map(college => (
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
                      <Badge variant="outline">
                        {collegesList.find(college => college.id === department.college_id)?.name || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      {department.department_head ? (
                        <span className="font-medium text-foreground">
                          {department.department_head}
                        </span>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">
                          No Head Assigned
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell className="max-w-xs">
                      <p className="truncate">{department.description || "No description"}</p>
                    </TableCell>
                    <TableCell>
                      {department.created_at ? new Date(department.created_at).toLocaleDateString() : 'N/A'}
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
      </>
      )}
    </div>
  );
};

export default Departments;