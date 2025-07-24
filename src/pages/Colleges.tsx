import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building2, Search, Plus, Edit, Trash2, BookOpen } from "lucide-react";
import { CollegeModal } from "@/components/modals/CollegeModal";
import { useToast } from "@/hooks/use-toast";

interface College {
  id: string;
  name: string;
  description?: string;
  departments: string[];
  createdAt: string;
}

const Colleges = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState<College | undefined>();
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const { toast } = useToast();

  // Mock data - in real app, fetch from backend
  const [colleges, setColleges] = useState<College[]>([
    {
      id: "1",
      name: "College of Computing",
      description: "Leading institution for computer science and information technology education",
      departments: ["Computer Science", "Information Technology", "Software Engineering", "Data Science"],
      createdAt: "2024-01-10",
    },
    {
      id: "2",
      name: "College of Engineering",
      description: "Premier engineering education with focus on innovation and practical application",
      departments: ["Civil Engineering", "Mechanical Engineering", "Electrical Engineering", "Chemical Engineering"],
      createdAt: "2024-01-15",
    },
    {
      id: "3",
      name: "College of Business",
      description: "Comprehensive business education preparing future leaders and entrepreneurs",
      departments: ["Business Administration", "Marketing", "Finance", "Economics"],
      createdAt: "2024-01-20",
    },
  ]);

  const filteredColleges = colleges.filter(college =>
    college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    college.departments.some(dept => dept.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const stats = {
    total: colleges.length,
    totalDepartments: colleges.reduce((acc, college) => acc + college.departments.length, 0),
    avgDepartments: Math.round(colleges.reduce((acc, college) => acc + college.departments.length, 0) / colleges.length),
  };

  const handleCreateCollege = () => {
    setSelectedCollege(undefined);
    setModalMode("create");
    setModalOpen(true);
  };

  const handleEditCollege = (college: College) => {
    setSelectedCollege(college);
    setModalMode("edit");
    setModalOpen(true);
  };

  const handleDeleteCollege = (college: College) => {
    setColleges(colleges.filter(c => c.id !== college.id));
    toast({
      title: "College deleted",
      description: `${college.name} has been removed successfully.`,
    });
  };

  const handleSubmitCollege = (collegeData: College) => {
    if (modalMode === "create") {
      const newCollege = {
        ...collegeData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0],
      };
      setColleges([...colleges, newCollege]);
      toast({
        title: "College created",
        description: `${collegeData.name} has been added successfully.`,
      });
    } else {
      setColleges(colleges.map(c => 
        c.id === selectedCollege?.id ? { ...collegeData, id: c.id } : c
      ));
      toast({
        title: "College updated",
        description: `${collegeData.name} has been updated successfully.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary" />
            Colleges Management
          </h1>
          <p className="text-muted-foreground">Manage colleges and their departments</p>
        </div>
        <Button onClick={handleCreateCollege}>
          <Plus className="h-4 w-4 mr-2" />
          Add College
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Colleges</p>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              </div>
              <Building2 className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Departments</p>
                <p className="text-2xl font-bold text-primary">{stats.totalDepartments}</p>
              </div>
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Departments</p>
                <p className="text-2xl font-bold text-success">{stats.avgDepartments}</p>
              </div>
              <Badge className="bg-success/10 text-success">
                Per College
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Colleges Management */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                All Colleges
              </CardTitle>
              <CardDescription>
                View and manage all colleges in the system
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search colleges or departments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Colleges Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>College Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Departments</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredColleges.map((college) => (
                  <TableRow key={college.id}>
                    <TableCell className="font-medium">{college.name}</TableCell>
                    <TableCell className="max-w-md">
                      <p className="truncate">{college.description || "No description"}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {college.departments.slice(0, 2).map((dept, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {dept}
                          </Badge>
                        ))}
                        {college.departments.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{college.departments.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(college.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditCollege(college)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteCollege(college)}
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

          {filteredColleges.length === 0 && (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground">No colleges found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or add a new college.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <CollegeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitCollege}
        college={selectedCollege}
        mode={modalMode}
      />
    </div>
  );
};

export default Colleges;