import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import FaceDetectionCamera from "@/components/FaceDetectionCamera";
import { LiveFaceRecognition } from "@/components/LiveFaceRecognition";
import { SimpleCameraTest } from "@/components/SimpleCameraTest";
import { CameraDebugTest } from "@/components/CameraDebugTest";
import { 
  Scan, 
  User, 
  Mail, 
  GraduationCap, 
  Building, 
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  MapPin,
  Hash,
  Users
} from "lucide-react";
import { useFaceRecognition } from "@/hooks/useStudents";
import { recognitionApi, RecognizedStudentData } from "@/services/recognitionApi";
import { FaceDetectionResult } from "@/hooks/useFaceDetection";
import type { Student } from "@/types/api";

interface RecognitionState {
  status: 'idle' | 'recognizing' | 'success' | 'error';
  message: string;
  student?: RecognizedStudentData;
  confidence?: number;
}

const Recognition = () => {
  const { toast } = useToast();
  const [studentDetails, setStudentDetails] = useState<Student | null>(null);
  const [scanResult, setScanResult] = useState<"success" | "not-found" | null>(null);
  const [recognitionData, setRecognitionData] = useState<{ matched: boolean; confidence?: number } | null>(null);
  const [useLiveRecognition, setUseLiveRecognition] = useState<'live' | 'manual' | 'test' | 'debug'>('live');
  
  // New live recognition state
  const [recognitionState, setRecognitionState] = useState<RecognitionState>({
    status: 'idle',
    message: 'Ready to start face recognition',
  });

  const [recognitionHistory, setRecognitionHistory] = useState<Array<{
    timestamp: Date;
    student?: RecognizedStudentData;
    success: boolean;
    confidence?: number;
  }>>([]);

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

  // Handle live face detection and recognition
  const handleLiveFaceDetected = async (faceData: { image: string; detection: FaceDetectionResult }) => {
    setRecognitionState({
      status: 'recognizing',
      message: 'Processing face recognition...',
    });

    try {
      const response = await recognitionApi.recognizeFace({
        face_image: faceData.image,
      });

      if (response.success && response.student) {
        setRecognitionState({
          status: 'success',
          message: 'Student recognized successfully!',
          student: response.student,
          confidence: response.confidence,
        });

        // Also update legacy state for existing UI (convert to Student type)
        const studentForLegacy: Student = {
          id: response.student.id,
          first_name: response.student.first_name,
          last_name: response.student.last_name,
          email: response.student.email,
          student_id: response.student.student_id,
          college_id: '', // Not available in recognition response
          department_id: '', // Not available in recognition response
        };
        setStudentDetails(studentForLegacy);
        setScanResult("success");

        // Add to history
        setRecognitionHistory(prev => [{
          timestamp: new Date(),
          student: response.student!,
          success: true,
          confidence: response.confidence,
        }, ...prev.slice(0, 9)]);

        toast({
          title: "Student identified!",
          description: `Welcome back, ${response.student.first_name} ${response.student.last_name}!`,
        });

      } else {
        setRecognitionState({
          status: 'error',
          message: response.message || 'Student not recognized. Please try again.',
        });

        setScanResult("not-found");

        setRecognitionHistory(prev => [{
          timestamp: new Date(),
          success: false,
        }, ...prev.slice(0, 9)]);

        toast({
          title: "Student not found",
          description: "Face detected but no matching student found in the database.",
          variant: "destructive",
        });
      }
    } catch (error) {
      setRecognitionState({
        status: 'error',
        message: 'Recognition failed. Please check your connection and try again.',
      });

      setScanResult("not-found");

      setRecognitionHistory(prev => [{
        timestamp: new Date(),
        success: false,
      }, ...prev.slice(0, 9)]);

      toast({
        title: "Recognition failed",
        description: "An error occurred during facial recognition. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle live recognition errors
  const handleLiveRecognitionError = (error: string) => {
    setRecognitionState({
      status: 'error',
      message: error,
    });

    toast({
      title: "Camera Error",
      description: error,
      variant: "destructive",
    });
  };

  // Reset recognition state
  const resetRecognition = () => {
    setRecognitionState({
      status: 'idle',
      message: 'Ready to start face recognition',
    });
    setStudentDetails(null);
    setScanResult(null);
  };

  // Format exam room info
  const formatExamInfo = (student: RecognizedStudentData) => {
    if (!student.exam_room) {
      return (
        <Alert>
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>
            No exam room assigned for this student.
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Building className="w-5 h-5" />
            Exam Room Assignment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Room</p>
                <p className="text-lg font-bold">{student.exam_room.room_number}</p>
              </div>
            </div>
            {student.exam_room.seat_number && (
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Seat</p>
                  <p className="text-lg font-bold">{student.exam_room.seat_number}</p>
                </div>
              </div>
            )}
          </div>
          
          <Separator />
          
          <div>
            <p className="text-sm font-medium text-muted-foreground">Exam</p>
            <p className="text-lg font-semibold">{student.exam_room.exam_title}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Date & Time</p>
              <p className="font-medium">{new Date(student.exam_room.exam_date).toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const handleReset = () => {
    setStudentDetails(null);
    setScanResult(null);
    resetRecognition();
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
                  Choose your preferred recognition method
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4">
                  <Button
                    onClick={() => setUseLiveRecognition('live')}
                    variant={useLiveRecognition === 'live' ? "default" : "outline"}
                    size="sm"
                  >
                    Live Recognition
                  </Button>
                  <Button
                    onClick={() => setUseLiveRecognition('manual')}
                    variant={useLiveRecognition === 'manual' ? "default" : "outline"}
                    size="sm"
                  >
                    Manual Capture
                  </Button>
                  <Button
                    onClick={() => setUseLiveRecognition('test')}
                    variant={useLiveRecognition === 'test' ? "default" : "outline"}
                    size="sm"
                  >
                    Camera Test
                  </Button>
                  <Button
                    onClick={() => setUseLiveRecognition('debug')}
                    variant={useLiveRecognition === 'debug' ? "default" : "outline"}
                    size="sm"
                  >
                    Debug
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Live Recognition Mode */}
            {useLiveRecognition === 'live' ? (
              <>
                <LiveFaceRecognition
                  onFaceDetected={handleLiveFaceDetected}
                  onError={handleLiveRecognitionError}
                  isRecognizing={recognitionState.status === 'recognizing'}
                  autoCapture={true}
                  captureThreshold={0.8}
                />

                {/* Live Recognition Status */}
                {recognitionState.status !== 'idle' && (
                  <Alert 
                    className="mt-4"
                    variant={
                      recognitionState.status === 'success' ? 'default' :
                      recognitionState.status === 'error' ? 'destructive' : 'default'
                    }
                  >
                    {recognitionState.status === 'success' && <CheckCircle className="w-4 h-4" />}
                    {recognitionState.status === 'error' && <AlertCircle className="w-4 h-4" />}
                    {recognitionState.status === 'recognizing' && <Clock className="w-4 h-4 animate-spin" />}
                    <AlertDescription>{recognitionState.message}</AlertDescription>
                  </Alert>
                )}
              </>
            ) : (
              /* Manual Capture Mode, Camera Test, or Debug */
              useLiveRecognition === 'manual' ? (
                <FaceDetectionCamera 
                  onCapture={handleFaceCapture} 
                  isCapturing={faceRecognition.isPending}
                  requireFaceDetection={true}
                />
              ) : useLiveRecognition === 'test' ? (
                <SimpleCameraTest />
              ) : (
                <CameraDebugTest />
              )
            )}
            
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
                    {/* Show exam room info if from live recognition */}
                    {recognitionState.student && recognitionState.student.exam_room && (
                      <div className="mb-6">
                        {formatExamInfo(recognitionState.student)}
                      </div>
                    )}

                    <div className="text-center">
                      <Badge variant="default" className="mb-2">
                        ✓ Identified {(recognitionData?.confidence || recognitionState.confidence) && 
                          `(${Math.round(((recognitionData?.confidence || recognitionState.confidence) || 0) * 100)}%)`}
                      </Badge>
                      <h3 className="text-2xl font-bold text-foreground">
                        {recognitionState.student ? 
                          `${recognitionState.student.first_name} ${recognitionState.student.middle_name || ''} ${recognitionState.student.last_name}` :
                          `${studentDetails.first_name} ${studentDetails.last_name}`
                        }
                      </h3>
                      {recognitionState.student?.index_number && (
                        <p className="text-muted-foreground">Index: {recognitionState.student.index_number}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                        <User className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Student ID</p>
                          <p className="font-medium">
                            {recognitionState.student?.student_id || studentDetails.student_id || studentDetails.id}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                        <Mail className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-medium">
                            {recognitionState.student?.email || studentDetails.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                        <Building className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">College</p>
                          <p className="font-medium">
                            {recognitionState.student?.college_name || 
                             studentDetails.college?.name || 
                             'College information not available'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                        <GraduationCap className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Department</p>
                          <p className="font-medium">
                            {recognitionState.student?.department_name || 
                             studentDetails.department?.name || 
                             'Department information not available'}
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