import { useState, useRef, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Camera, 
  Shield, 
  ShieldCheck, 
  ShieldX, 
  Volume2,
  VolumeX,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  User
} from "lucide-react";
import { useRoomAssignments, useRoomRecognition } from "@/hooks/useRooms";
import FaceDetectionCamera from "@/components/FaceDetectionCamera";
import type { RoomValidationResponse } from "@/types/api";

interface AudioFeedback {
  playSuccess: () => void;
  playWarning: () => void;
}

const FaceRecognitionValidator = () => {
  const { toast } = useToast();
  const audioContextRef = useRef<AudioContext | null>(null);
  
  // Component state
  const [selectedRoomCode, setSelectedRoomCode] = useState<string>('');
  const [validationResult, setValidationResult] = useState<RoomValidationResponse | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [lastValidationTime, setLastValidationTime] = useState<Date | null>(null);
  const [validationHistory, setValidationHistory] = useState<RoomValidationResponse[]>([]);

  // Queries and mutations
  const { data: rooms } = useRoomAssignments();
  const roomValidation = useRoomRecognition();

  // Audio feedback system
  const audioFeedback: AudioFeedback = {
    playSuccess: () => {
      if (!audioEnabled) return;
      
      try {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        
        const ctx = audioContextRef.current;
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        // Success beep: 800Hz for 0.5 seconds
        oscillator.frequency.setValueAtTime(800, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.5);
      } catch (error) {
        console.error('Failed to play success beep:', error);
      }
    },

    playWarning: () => {
      if (!audioEnabled) return;
      
      try {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        
        const ctx = audioContextRef.current;
        
        // Double warning beep: 600Hz, twice
        const playBeep = (delay: number) => {
          setTimeout(() => {
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.frequency.setValueAtTime(600, ctx.currentTime);
            gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
            
            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + 0.3);
          }, delay);
        };

        playBeep(0);
        playBeep(400);
      } catch (error) {
        console.error('Failed to play warning beep:', error);
      }
    }
  };

  const handleFaceCapture = useCallback(async (imageBlob: Blob, faceDetected: boolean) => {
    if (!selectedRoomCode) {
      toast({
        title: "Room Not Selected",
        description: "Please select a room before capturing.",
        variant: "destructive",
      });
      return;
    }

    if (!faceDetected) {
      toast({
        title: "No Face Detected",
        description: "Please ensure a face is visible in the camera before capturing.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Convert blob to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1]; // Remove data:image/jpeg;base64, prefix

        try {
          const response = await roomValidation.mutateAsync({
            room_code: selectedRoomCode,
            face_image: base64Data,
          });

          setValidationResult(response);
          setLastValidationTime(new Date());
          
          // Add to history (keep last 10)
          setValidationHistory(prev => [response, ...prev.slice(0, 9)]);

          // Handle audio feedback
          if (response.beep_type === 'confirmation') {
            audioFeedback.playSuccess();
            showSuccessMessage(response);
          } else {
            audioFeedback.playWarning();
            showErrorMessage(response);
          }

        } catch (error: any) {
          console.error('Validation failed:', error);
          toast({
            title: "Validation Failed",
            description: error.message || "Failed to validate student. Please try again.",
            variant: "destructive",
          });
          
          // Play warning beep for error
          audioFeedback.playWarning();
        }
      };
      
      reader.readAsDataURL(imageBlob);
    } catch (error) {
      console.error('Failed to process image:', error);
      toast({
        title: "Image Processing Failed",
        description: "Failed to process the captured image. Please try again.",
        variant: "destructive",
      });
    }
  }, [selectedRoomCode, roomValidation, audioFeedback, toast]);

  const showSuccessMessage = (result: RoomValidationResponse) => {
    toast({
      title: "✅ Student Verified",
      description: result.message,
      duration: 3000,
    });
  };

  const showErrorMessage = (result: RoomValidationResponse) => {
    toast({
      title: "⚠️ Validation Failed",
      description: result.message,
      variant: "destructive",
      duration: 5000,
    });
  };

  const getResultStatusIcon = (result: RoomValidationResponse) => {
    if (result.status === 'valid') {
      return <CheckCircle className="h-8 w-8 text-green-500" />;
    } else {
      return <XCircle className="h-8 w-8 text-red-500" />;
    }
  };

  const getResultStatusColor = (result: RoomValidationResponse) => {
    if (result.status === 'valid') {
      return 'bg-green-50 border-green-200';
    } else {
      return 'bg-red-50 border-red-200';
    }
  };

  const clearResults = () => {
    setValidationResult(null);
    setLastValidationTime(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Face Recognition Validator</h1>
          <p className="text-muted-foreground">Real-time student validation for exam rooms</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAudioEnabled(!audioEnabled)}
          >
            {audioEnabled ? (
              <>
                <Volume2 className="h-4 w-4 mr-2" />
                Audio On
              </>
            ) : (
              <>
                <VolumeX className="h-4 w-4 mr-2" />
                Audio Off
              </>
            )}
          </Button>
          {validationResult && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearResults}
            >
              Clear Results
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Camera and Controls */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-primary" />
              Camera Feed
            </CardTitle>
            <CardDescription>
              Position student in front of camera for validation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Room Selection */}
            <div className="space-y-2">
              <label htmlFor="room-select" className="text-sm font-medium">
                Select Exam Room *
              </label>
              <Select value={selectedRoomCode} onValueChange={setSelectedRoomCode}>
                <SelectTrigger id="room-select">
                  <SelectValue placeholder="Choose exam room..." />
                </SelectTrigger>
                <SelectContent>
                  {rooms?.items?.map((room) => (
                    <SelectItem key={room.id} value={room.room_code}>
                      <div className="flex items-center justify-between w-full">
                        <span>{room.room_code} - {room.room_name}</span>
                        <Badge variant="outline" className="ml-2">
                          {room.index_start} - {room.index_end}
                        </Badge>
                      </div>
                    </SelectItem>
                  )) || []}
                </SelectContent>
              </Select>
            </div>

            {/* Camera Component */}
            <div className="border rounded-lg overflow-hidden">
              <FaceDetectionCamera
                onCapture={handleFaceCapture}
                isCapturing={roomValidation.isPending}
                requireFaceDetection={true}
              />
            </div>

            {/* Room Info */}
            {selectedRoomCode && rooms?.items && (
              <div className="bg-muted/50 p-3 rounded-lg">
                {(() => {
                  const selectedRoom = rooms.items.find(room => room.room_code === selectedRoomCode);
                  return selectedRoom ? (
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium">Room:</span>
                        <span>{selectedRoom.room_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Index Range:</span>
                        <span>{selectedRoom.index_start.toLocaleString()} - {selectedRoom.index_end.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Capacity:</span>
                        <span>{selectedRoom.assigned_students_count || 0}/{selectedRoom.capacity}</span>
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Validation Results */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Validation Results
            </CardTitle>
            <CardDescription>
              Real-time validation status and student information
            </CardDescription>
          </CardHeader>
          <CardContent>
            {roomValidation.isPending ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">Validating student...</p>
                </div>
              </div>
            ) : validationResult ? (
              <div className={`p-4 rounded-lg border-2 ${getResultStatusColor(validationResult)}`}>
                <div className="flex items-start gap-3">
                  {getResultStatusIcon(validationResult)}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">
                        {validationResult.status === 'valid' ? 'Student Verified' : 'Validation Failed'}
                      </h3>
                      <Badge 
                        variant={validationResult.status === 'valid' ? 'default' : 'destructive'}
                      >
                        {validationResult.status === 'valid' ? 'Valid' : 'Invalid'}
                      </Badge>
                    </div>
                    
                    <p className="text-sm font-medium">
                      {validationResult.message}
                    </p>

                    {validationResult.student_name && (
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Student:</span>
                          <span className="font-medium">{validationResult.student_name}</span>
                        </div>
                        {validationResult.index_number && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Index Number:</span>
                            <span className="font-medium">{validationResult.index_number}</span>
                          </div>
                        )}
                        {validationResult.room_name && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Assigned Room:</span>
                            <span className="font-medium">{validationResult.room_name}</span>
                          </div>
                        )}
                        {validationResult.confidence && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Confidence:</span>
                            <span className="font-medium">{Math.round(validationResult.confidence * 100)}%</span>
                          </div>
                        )}
                      </div>
                    )}

                    {lastValidationTime && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                        <Clock className="h-3 w-3" />
                        <span>Validated at {lastValidationTime.toLocaleTimeString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-center">
                <div>
                  <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No validation performed yet</p>
                  <p className="text-sm text-muted-foreground">
                    Select a room and capture a student's face to begin validation
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Validation History */}
      {validationHistory.length > 0 && (
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Recent Validations
            </CardTitle>
            <CardDescription>
              History of recent validation attempts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {validationHistory.map((result, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded-lg border ${
                    result.status === 'valid' 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {result.status === 'valid' ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <span className="text-sm font-medium">
                        {result.student_name || 'Unknown Student'}
                      </span>
                      {result.index_number && (
                        <Badge variant="outline" className="text-xs">
                          {result.index_number}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {result.message}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FaceRecognitionValidator;
