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
    <div className="min-h-screen bg-gradient-subtle py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-accent" />
            <h1 className="text-4xl font-bold text-foreground">AI Student Registration</h1>
            <Sparkles className="h-8 w-8 text-accent" />
          </div>
          <p className="text-lg text-muted-foreground">Register students with advanced facial recognition technology</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Registration Form */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <UserPlus className="h-6 w-6 text-primary" />
                Student Information
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Complete all required fields for student registration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium">First Name *</Label>
                    <Input
                      id="firstName"
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="middleName" className="text-sm font-medium">Middle Name</Label>
                    <Input
                      id="middleName"
                      placeholder="Middle name (optional)"
                      value={formData.middleName}
                      onChange={(e) => handleInputChange('middleName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium">Last Name *</Label>
                    <Input
                      id="lastName"
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* ID Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="studentId" className="text-sm font-medium">Student ID *</Label>
                    <Input
                      id="studentId"
                      placeholder="8 digits (e.g., 12345678)"
                      value={formData.studentId}
                      onChange={(e) => handleInputChange('studentId', e.target.value.replace(/\D/g, '').slice(0, 8))}
                      maxLength={8}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="indexNumber" className="text-sm font-medium">Index Number *</Label>
                    <Input
                      id="indexNumber"
                      placeholder="7 digits (e.g., 1234567)"
                      value={formData.indexNumber}
                      onChange={(e) => handleInputChange('indexNumber', e.target.value.replace(/\D/g, '').slice(0, 7))}
                      maxLength={7}
                      required
                    />
                  </div>
                </div>

                {/* College and Department */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="college" className="text-sm font-medium">College *</Label>
                    <Select onValueChange={(value) => handleInputChange('college', value)} value={formData.college}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select college" />
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
                    <Label htmlFor="department" className="text-sm font-medium">Department *</Label>
                    <Select 
                      onValueChange={(value) => handleInputChange('department', value)} 
                      value={formData.department}
                      disabled={!formData.college}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={formData.college ? "Select department" : "Select college first"} />
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

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="student@knust.edu.gh"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full glow-hover bg-gradient-primary hover:shadow-glow transition-all duration-300" 
                  disabled={isSubmitting}
                  size="lg"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Registering..." : "Register Student"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Camera Capture */}
          <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Sparkles className="h-6 w-6 text-accent" />
                  AI Face Capture
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Capture a clear photo for facial recognition enrollment
                </CardDescription>
              </CardHeader>
            </Card>
            <div className="glass-card p-1 rounded-2xl">
              <CameraCapture onCapture={handlePhotoCapture} isCapturing={isSubmitting} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;