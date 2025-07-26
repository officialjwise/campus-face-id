import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import FaceDetectionCamera from "@/components/FaceDetectionCamera";
import { Scan, User, Mail, GraduationCap, Building, Calendar } from "lucide-react";
import { useFaceRecognition } from "@/hooks/useStudents";
import type { Student } from "@/types/api";

const Recognition = () => {
  const { toast } = useToast();
  const [studentDetails, setStudentDetails] = useState<Student | null>(null);
  const [scanResult, setScanResult] = useState<"success" | "not-found" | null>(null);
  const [recognitionData, setRecognitionData] = useState<{ matched: boolean; confidence?: number } | null>(null);

  const faceRecognition = useFaceRecognition();

  const handleFaceCapture = async (imageBlob: Blob, faceDetected: boolean) => {
    setScanResult(null);
    setStudentDetails(null);
    setRecognitionData(null);

    if (!faceDetected) {
      toast({
        title: "No face detected",
        description: "Please ensure your face is clearly visible in the camera frame.",
        variant: "destructive",
      });
      return;
    }

    // Convert blob to File
    const imageFile = new File([imageBlob], 'face-capture.jpg', { type: 'image/jpeg' });

    faceRecognition.mutate(imageFile, {
      onSuccess: (response) => {
        setRecognitionData({
          matched: response.matched,
          confidence: response.confidence,
        });

        if (response.matched && response.student) {
          setStudentDetails(response.student);
          setScanResult("success");
          
          toast({
            title: "Student identified!",
            description: `Welcome back, ${response.student.first_name} ${response.student.last_name}! Confidence: ${Math.round((response.confidence || 0) * 100)}%`,
          });
        } else {
          setScanResult("not-found");
          toast({
            title: "Student not found",
            description: "Face detected but no matching student found in the database.",
            variant: "destructive",
          });
        }
      },
      onError: (error) => {
        setScanResult("not-found");
        toast({
          title: "Recognition failed",
          description: error.message || "An error occurred during facial recognition. Please try again.",
          variant: "destructive",
        });
      },
    });
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
              isCapturing={faceRecognition.isPending}
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
                {faceRecognition.isPending && (
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
                        ✓ Identified {recognitionData?.confidence && `(${Math.round(recognitionData.confidence * 100)}%)`}
                      </Badge>
                      <h3 className="text-2xl font-bold text-foreground">
                        {studentDetails.first_name} {studentDetails.last_name}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                        <User className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Student ID</p>
                          <p className="font-medium">{studentDetails.student_id || studentDetails.id}</p>
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
                          <p className="font-medium">
                            {studentDetails.college?.name || 'College information not available'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                        <GraduationCap className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Department</p>
                          <p className="font-medium">
                            {studentDetails.department?.name || 'Department information not available'}
                          </p>
                        </div>
                      </div>

                      {studentDetails.created_at && (
                        <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                          <Calendar className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">Registration Date</p>
                            <p className="font-medium">
                              {new Date(studentDetails.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
                        <Calendar className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Recognized At</p>
                          <p className="font-medium text-primary">
                            {new Date().toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {!faceRecognition.isPending && !scanResult && (
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