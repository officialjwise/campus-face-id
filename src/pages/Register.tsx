import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import CameraCapture from "@/components/CameraCapture";
import { UserPlus, Save } from "lucide-react";

interface StudentFormData {
  studentId: string;
  indexNumber: string;
  fullName: string;
  college: string;
  department: string;
  email: string;
  photo?: Blob;
}

const Register = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<StudentFormData>({
    studentId: "",
    indexNumber: "",
    fullName: "",
    college: "",
    department: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock departments - in real app, fetch from backend
  const departments = [
    "Computer Science",
    "Information Technology", 
    "Software Engineering",
    "Data Science",
    "Cybersecurity",
    "Engineering",
    "Business Administration",
    "Accounting",
    "Marketing",
  ];

  const handleInputChange = (field: keyof StudentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
    const requiredFields = ['studentId', 'indexNumber', 'fullName', 'college', 'department', 'email'];
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
      formDataToSend.append('studentId', formData.studentId);
      formDataToSend.append('indexNumber', formData.indexNumber);
      formDataToSend.append('fullName', formData.fullName);
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
        description: `Student ${formData.fullName} has been registered successfully.`,
      });

      // Reset form
      setFormData({
        studentId: "",
        indexNumber: "",
        fullName: "",
        college: "",
        department: "",
        email: "",
      });

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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Student Registration</h1>
          <p className="text-lg text-muted-foreground">Register a new student with facial recognition</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Registration Form */}
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-primary" />
                Student Information
              </CardTitle>
              <CardDescription>
                Fill in the student details below
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="studentId">Student ID *</Label>
                    <Input
                      id="studentId"
                      placeholder="e.g., STU001"
                      value={formData.studentId}
                      onChange={(e) => handleInputChange('studentId', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="indexNumber">Index Number *</Label>
                    <Input
                      id="indexNumber"
                      placeholder="e.g., IND2024001"
                      value={formData.indexNumber}
                      onChange={(e) => handleInputChange('indexNumber', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    placeholder="Enter full name"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="college">College *</Label>
                    <Input
                      id="college"
                      placeholder="e.g., College of Computing"
                      value={formData.college}
                      onChange={(e) => handleInputChange('college', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department *</Label>
                    <Select onValueChange={(value) => handleInputChange('department', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="student@university.edu"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                  variant="hero"
                >
                  <Save className="h-4 w-4" />
                  {isSubmitting ? "Registering..." : "Register Student"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Camera Capture */}
          <div>
            <Card className="shadow-elegant mb-4">
              <CardHeader>
                <CardTitle>Student Photo</CardTitle>
                <CardDescription>
                  Capture the student's photo for facial recognition
                </CardDescription>
              </CardHeader>
            </Card>
            <CameraCapture onCapture={handlePhotoCapture} isCapturing={isSubmitting} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;