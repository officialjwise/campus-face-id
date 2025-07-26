import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import FaceDetectionCamera from "@/components/FaceDetectionCamera";
import { UserPlus, Save, Sparkles } from "lucide-react";
import { useColleges } from "@/hooks/useColleges";
import { useDepartmentsByCollege } from "@/hooks/useDepartments";
import { useRegisterStudent } from "@/hooks/useStudents";

interface StudentFormData {
  firstName: string;
  middleName: string;
  lastName: string;
  studentId: string;
  indexNumber: string;
  collegeId: string;
  collegeName: string;
  departmentId: string;
  departmentName: string;
  email: string;
  photo?: Blob;
}

const Register = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<StudentFormData>({
    firstName: "",
    middleName: "",
    lastName: "",
    studentId: "",
    indexNumber: "",
    collegeId: "",
    collegeName: "",
    departmentId: "",
    departmentName: "",
    email: "",
  });

  // API hooks
  const { data: colleges, isLoading: collegesLoading } = useColleges();
  
  // Ensure colleges is always an array
  const collegesList = Array.isArray(colleges) ? colleges : [];
  
  // Find the selected college object to get its ID
  const selectedCollege = collegesList.find(college => college.id === formData.collegeId);
  const { data: departments, isLoading: departmentsLoading } = useDepartmentsByCollege(
    formData.collegeId || ""
  );
  
  // Ensure departments is always an array
  const departmentsList = Array.isArray(departments) ? departments : [];
  
  const registerStudent = useRegisterStudent();

  const handleInputChange = (field: keyof StudentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Reset department when college changes
    if (field === 'collegeId') {
      setFormData(prev => ({ ...prev, departmentId: '', departmentName: '' }));
    }
  };

  // Handler for college selection (stores both ID and name)
  const handleCollegeChange = (collegeId: string) => {
    const college = collegesList.find(c => c.id === collegeId);
    setFormData(prev => ({ 
      ...prev, 
      collegeId, 
      collegeName: college?.name || '',
      departmentId: '',
      departmentName: ''
    }));
  };

  // Handler for department selection (stores both ID and name)
  const handleDepartmentChange = (departmentId: string) => {
    const department = departmentsList.find(d => d.id === departmentId);
    setFormData(prev => ({ 
      ...prev, 
      departmentId, 
      departmentName: department?.name || ''
    }));
  };

  const handlePhotoCapture = (blob: Blob, faceDetected: boolean) => {
    setFormData(prev => ({ ...prev, photo: blob }));
    toast({
      title: "Photo captured successfully",
      description: `Your photo has been captured${faceDetected ? ' with face detected' : ''} and will be included in the registration.`,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const requiredFields = ['firstName', 'lastName', 'studentId', 'indexNumber', 'collegeId', 'departmentId', 'email'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof StudentFormData]);

    if (missingFields.length > 0) {
      toast({
        title: "Missing required fields",
        description: `Please fill in: ${missingFields.join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    // Student ID validation (8 digits)
    if (!/^\d{8}$/.test(formData.studentId)) {
      toast({
        title: "Invalid Student ID",
        description: "Student ID must be exactly 8 digits.",
        variant: "destructive",
      });
      return;
    }

    // Index Number validation (7 digits)
    if (!/^\d{7}$/.test(formData.indexNumber)) {
      toast({
        title: "Invalid Index Number",
        description: "Index Number must be exactly 7 digits.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.photo) {
      toast({
        title: "Photo required",
        description: "Please capture your photo before submitting the registration.",
        variant: "destructive",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    // Check if college and department are selected
    if (!formData.collegeId || !formData.departmentId) {
      toast({
        title: "Missing selection",
        description: "Please select both college and department.",
        variant: "destructive",
      });
      return;
    }

    // Prepare student data for API
    const studentData = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      college_id: formData.collegeId,
      department_id: formData.departmentId,
      student_id: formData.studentId,
      // Additional fields that might be useful
      ...(formData.middleName && { middle_name: formData.middleName }),
      // Note: photo upload will be handled separately after student creation
    };

    registerStudent.mutate(studentData, {
      onSuccess: (newStudent) => {
        toast({
          title: "Registration successful!",
          description: `Student ${formData.firstName} ${formData.lastName} has been registered successfully.`,
        });

        // Reset form
        setFormData({
          firstName: "",
          middleName: "",
          lastName: "",
          studentId: "",
          indexNumber: "",
          collegeId: "",
          collegeName: "",
          departmentId: "",
          departmentName: "",
          email: "",
        });
      },
      onError: (error) => {
        toast({
          title: "Registration failed",
          description: error.message || "An error occurred during registration. Please try again.",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2">
            Student Registration
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
            Complete the form below to register a new student
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Registration Form - Takes 2/3 on XL screens */}
          <div className="xl:col-span-2">
            <Card className="shadow-elegant border-border">
              <CardHeader className="pb-4 bg-muted/30 border-b border-border">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl text-foreground">
                  <UserPlus className="h-5 w-5 text-primary" />
                  Student Information
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Please fill in all required fields marked with *
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information Section */}
                  <div>
                    <h3 className="text-base font-semibold text-foreground mb-4 pb-2 border-b border-border">
                      Personal Information
                    </h3>
                    
                    {/* Name Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-sm font-medium text-foreground">
                          First Name *
                        </Label>
                        <Input
                          id="firstName"
                          placeholder="Enter first name"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className="h-10"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="middleName" className="text-sm font-medium text-foreground">
                          Middle Name
                        </Label>
                        <Input
                          id="middleName"
                          placeholder="Enter middle name"
                          value={formData.middleName}
                          onChange={(e) => handleInputChange('middleName', e.target.value)}
                          className="h-10"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-sm font-medium text-foreground">
                          Last Name *
                        </Label>
                        <Input
                          id="lastName"
                          placeholder="Enter last name"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className="h-10"
                          required
                        />
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-2">
                       <Label htmlFor="email" className="text-sm font-medium text-foreground">
                         Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="student@knust.edu.gh"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="h-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Academic Information Section */}
                  <div>
                     <h3 className="text-base font-semibold text-foreground mb-4 pb-2 border-b border-border">
                       Academic Information
                     </h3>
                    
                    {/* ID Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <Label htmlFor="studentId" className="text-sm font-medium text-foreground">
                          Student ID *
                        </Label>
                        <Input
                          id="studentId"
                          placeholder="8 digits (e.g., 12345678)"
                          value={formData.studentId}
                          onChange={(e) => handleInputChange('studentId', e.target.value.replace(/\D/g, '').slice(0, 8))}
                          className="h-10"
                          maxLength={8}
                          required
                        />
                        <p className="text-xs text-muted-foreground">Must be exactly 8 digits</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="indexNumber" className="text-sm font-medium text-foreground">
                          Index Number *
                        </Label>
                        <Input
                          id="indexNumber"
                          placeholder="7 digits (e.g., 1234567)"
                          value={formData.indexNumber}
                          onChange={(e) => handleInputChange('indexNumber', e.target.value.replace(/\D/g, '').slice(0, 7))}
                          className="h-10"
                          maxLength={7}
                          required
                        />
                        <p className="text-xs text-muted-foreground">Must be exactly 7 digits</p>
                      </div>
                    </div>

                    {/* College and Department */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="college" className="text-sm font-medium text-foreground">
                          College *
                        </Label>
                        <Select onValueChange={handleCollegeChange} value={formData.collegeId}>
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder="Select your college" />
                          </SelectTrigger>
                          <SelectContent>
                            {collegesList.map((college) => (
                              <SelectItem key={college.id} value={college.id}>
                                {college.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="department" className="text-sm font-medium text-foreground">
                          Department *
                        </Label>
                        <Select 
                          onValueChange={handleDepartmentChange} 
                          value={formData.departmentId}
                          disabled={!formData.collegeId}
                        >
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder={formData.collegeId ? "Select your department" : "Select college first"} />
                          </SelectTrigger>
                          <SelectContent>
                            {departmentsList.map((dept) => (
                              <SelectItem key={dept.id} value={dept.id}>
                                {dept.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 border-t border-border">
                    <Button 
                      type="submit" 
                      className="w-full sm:w-auto sm:px-8 h-11"
                      disabled={registerStudent.isPending || collegesLoading || departmentsLoading}
                      size="lg"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {registerStudent.isPending ? "Registering Student..." : "Register Student"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Photo Capture Section - Takes 1/3 on XL screens */}
          <div className="xl:col-span-1">
            <Card className="shadow-elegant border-border">
              <CardHeader className="pb-4 bg-muted/30 border-b border-border">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl text-foreground">
                  <Save className="h-5 w-5 text-primary" />
                  Student Photo
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Capture or upload student photo for identification
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 sm:p-6">
                <FaceDetectionCamera 
                  onCapture={handlePhotoCapture} 
                  isCapturing={registerStudent.isPending}
                  requireFaceDetection={true}
                />
                <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                  <p className="text-xs text-primary text-center">
                    Photo capture is required for registration. Ensure the student is looking directly at the camera with good lighting.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 lg:mt-8">
          <Card className="shadow-elegant border-border">
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-base font-semibold text-foreground mb-3">Registration Instructions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-muted-foreground">
                <div>
                  <h4 className="font-medium text-foreground mb-1">Student ID Format</h4>
                  <p>Must be exactly 8 numeric digits</p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Index Number Format</h4>
                  <p>Must be exactly 7 numeric digits</p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Photo Requirements</h4>
                  <p>Clear, front-facing photo with good lighting</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Register;