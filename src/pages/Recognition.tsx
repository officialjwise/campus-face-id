import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import FaceDetectionCamera from "@/components/FaceDetectionCamera";
import { Scan, User, Mail, GraduationCap, Building, Calendar } from "lucide-react";

interface StudentDetails {
  studentId: string;
  indexNumber: string;
  fullName: string;
  college: string;
  department: string;
  email: string;
  registrationDate: string;
  lastSeen?: string;
}

const Recognition = () => {
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [studentDetails, setStudentDetails] = useState<StudentDetails | null>(null);
  const [scanResult, setScanResult] = useState<"success" | "not-found" | null>(null);

  const handleFaceCapture = async (imageBlob: Blob, faceDetected: boolean) => {
    setIsScanning(true);
    setScanResult(null);
    setStudentDetails(null);

    try {
      // Simulate API call for facial recognition
      const formData = new FormData();
      formData.append('image', imageBlob);
      formData.append('faceDetected', faceDetected.toString());

      // TODO: Replace with actual API call to FastAPI backend
      // const response = await fetch('/api/recognition/identify', {
      //   method: 'POST',
      //   body: formData,
      // });

      // Simulate recognition process
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Mock response - better success rate if face was detected
      const baseSuccessRate = faceDetected ? 0.8 : 0.4; // 80% vs 40% success rate
      const mockSuccess = Math.random() < baseSuccessRate;

      if (mockSuccess) {
        const mockStudent: StudentDetails = {
          studentId: "STU001",
          indexNumber: "IND2024001",
          fullName: "John Doe",
          college: "College of Computing",
          department: "Computer Science",
          email: "john.doe@university.edu",
          registrationDate: "2024-01-15",
          lastSeen: new Date().toISOString(),
        };

        setStudentDetails(mockStudent);
        setScanResult("success");
        
        toast({
          title: "Student identified!",
          description: `Welcome back, ${mockStudent.fullName}${faceDetected ? ' (Face detected)' : ''}`,
        });
      } else {
        setScanResult("not-found");
        toast({
          title: "Student not found",
          description: faceDetected 
            ? "Face detected but no matching student found in the database." 
            : "No face detected and no matching student found. Try capturing with your face visible.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Recognition failed",
        description: "An error occurred during facial recognition. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleReset = () => {
    setStudentDetails(null);
    setScanResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Facial Recognition</h1>
          <p className="text-lg text-muted-foreground">Scan a face to identify and retrieve student details</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Camera Section */}
          <div>
            <Card className="shadow-elegant mb-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scan className="h-5 w-5 text-primary" />
                  Face Scanner
                </CardTitle>
                <CardDescription>
                  Position your face in the camera frame and capture to identify
                </CardDescription>
              </CardHeader>
            </Card>
            <FaceDetectionCamera 
              onCapture={handleFaceCapture} 
              isCapturing={isScanning}
              requireFaceDetection={true}
            />
            
            {scanResult && (
              <div className="mt-4 text-center">
                <Button onClick={handleReset} variant="outline">
                  Scan Another Face
                </Button>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div>
            <Card className="shadow-elegant h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Recognition Results
                </CardTitle>
                <CardDescription>
                  Student details will appear here after successful identification
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isScanning && (
                  <div className="flex flex-col items-center justify-center py-8 space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p className="text-muted-foreground">Processing facial recognition...</p>
                  </div>
                )}

                {scanResult === "not-found" && (
                  <div className="text-center py-8 space-y-4">
                    <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
                      <User className="h-8 w-8 text-destructive" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-destructive">Student Not Found</h3>
                      <p className="text-muted-foreground">
                        No matching student found in the database. Please ensure the student is registered.
                      </p>
                    </div>
                  </div>
                )}

                {studentDetails && scanResult === "success" && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <Badge variant="default" className="mb-2">
                        ✓ Identified
                      </Badge>
                      <h3 className="text-2xl font-bold text-foreground">{studentDetails.fullName}</h3>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                        <User className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Student ID</p>
                          <p className="font-medium">{studentDetails.studentId}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                        <User className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Index Number</p>
                          <p className="font-medium">{studentDetails.indexNumber}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                        <Mail className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-medium">{studentDetails.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                        <Building className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">College</p>
                          <p className="font-medium">{studentDetails.college}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                        <GraduationCap className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Department</p>
                          <p className="font-medium">{studentDetails.department}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                        <Calendar className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Registration Date</p>
                          <p className="font-medium">
                            {new Date(studentDetails.registrationDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {studentDetails.lastSeen && (
                        <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
                          <Calendar className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">Last Seen</p>
                            <p className="font-medium text-primary">
                              {new Date(studentDetails.lastSeen).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {!isScanning && !scanResult && (
                  <div className="text-center py-8 space-y-4">
                    <Scan className="h-16 w-16 text-muted-foreground mx-auto" />
                    <div>
                      <h3 className="text-lg font-semibold text-muted-foreground">Ready to Scan</h3>
                      <p className="text-muted-foreground">
                        Capture a photo using the camera to identify a student
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recognition;