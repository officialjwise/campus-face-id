import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import CameraCapture from "@/components/CameraCapture";
import { UserPlus, Save, Sparkles } from "lucide-react";
import { colleges, getDepartmentsByCollege } from "@/data/colleges";

interface StudentFormData {
  firstName: string;
  middleName: string;
  lastName: string;
  studentId: string;
  indexNumber: string;
  college: string;
  department: string;
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
    college: "",
    department: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableDepartments, setAvailableDepartments] = useState<string[]>([]);

  const handleInputChange = (field: keyof StudentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Reset department when college changes
    if (field === 'college') {
      setFormData(prev => ({ ...prev, department: '' }));
      setAvailableDepartments(getDepartmentsByCollege(value));
    }
  };

  const handlePhotoCapture = (blob: Blob) => {
    setFormData(prev => ({ ...prev, photo: blob }));
    toast({
      title: "Photo captured successfully",
      description: "Your photo has been captured and will be included in the registration.",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    const requiredFields = ['firstName', 'lastName', 'studentId', 'indexNumber', 'college', 'department', 'email'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof StudentFormData]);

    if (missingFields.length > 0) {
      toast({
        title: "Missing required fields",
        description: `Please fill in: ${missingFields.join(', ')}`,
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Student ID validation (8 digits)
    if (!/^\d{8}$/.test(formData.studentId)) {
      toast({
        title: "Invalid Student ID",
        description: "Student ID must be exactly 8 digits.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Index Number validation (7 digits)
    if (!/^\d{7}$/.test(formData.indexNumber)) {
      toast({
        title: "Invalid Index Number",
        description: "Index Number must be exactly 7 digits.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    if (!formData.photo) {
      toast({
        title: "Photo required",
        description: "Please capture your photo before submitting the registration.",
        variant: "destructive",
      });
      setIsSubmitting(false);
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
      setIsSubmitting(false);
      return;
    }

    try {
      // Simulate API call - replace with actual backend integration
      const formDataToSend = new FormData();
      formDataToSend.append('firstName', formData.firstName);
      formDataToSend.append('middleName', formData.middleName);
      formDataToSend.append('lastName', formData.lastName);
      formDataToSend.append('studentId', formData.studentId);
      formDataToSend.append('indexNumber', formData.indexNumber);
      formDataToSend.append('college', formData.college);
      formDataToSend.append('department', formData.department);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('photo', formData.photo);

      // TODO: Replace with actual API call to FastAPI backend
      // const response = await fetch('/api/students/register', {
      //   method: 'POST',
      //   body: formDataToSend,
      // });

      // Simulate successful registration
      await new Promise(resolve => setTimeout(resolve, 2000));

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
        college: "",
        department: "",
        email: "",
      });
      setAvailableDepartments([]);

    } catch (error) {
      toast({
        title: "Registration failed",
        description: "An error occurred during registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
                        <Select onValueChange={(value) => handleInputChange('college', value)} value={formData.college}>
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder="Select your college" />
                          </SelectTrigger>
                          <SelectContent>
                            {colleges.map((college) => (
                              <SelectItem key={college.name} value={college.name}>
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
                          onValueChange={(value) => handleInputChange('department', value)} 
                          value={formData.department}
                          disabled={!formData.college}
                        >
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder={formData.college ? "Select your department" : "Select college first"} />
                          </SelectTrigger>
                          <SelectContent>
                            {availableDepartments.map((dept) => (
                              <SelectItem key={dept} value={dept}>
                                {dept}
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
                      disabled={isSubmitting}
                      size="lg"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isSubmitting ? "Registering Student..." : "Register Student"}
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
                <CameraCapture onCapture={handlePhotoCapture} isCapturing={isSubmitting} />
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