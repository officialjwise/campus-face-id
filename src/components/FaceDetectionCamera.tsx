import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, RefreshCw, Upload, Check, X, AlertCircle } from "lucide-react";
import { useFaceDetection, FaceDetectionResult } from '@/hooks/useFaceDetection';
import { drawMultipleFaces } from '@/lib/faceDetectionUtils';

interface FaceDetectionCameraProps {
  onCapture: (blob: Blob, faceDetected: boolean) => void | Promise<void>;
  isCapturing: boolean;
  requireFaceDetection?: boolean;
}

export default function FaceDetectionCamera({ 
  onCapture, 
  isCapturing, 
  requireFaceDetection = true 
}: FaceDetectionCameraProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>("");
  const [capturedImage, setCapturedImage] = useState<string>("");
  const [faceDetections, setFaceDetections] = useState<FaceDetectionResult[]>([]);
  const [isDetecting, setIsDetecting] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const detectionIntervalRef = useRef<number | null>(null);

  const { modelsLoaded, detectFaces: detectFacesFromHook } = useFaceDetection();

  // Detect faces in video
  const performFaceDetection = useCallback(async () => {
    if (!videoRef.current || !modelsLoaded || isDetecting) return;
    
    setIsDetecting(true);
    try {
      const detections = await detectFacesFromHook(videoRef.current);
      setFaceDetections(detections);
      setFaceDetected(detections.length > 0);
      
      // Draw bounding boxes on overlay canvas
      if (overlayCanvasRef.current) {
        drawMultipleFaces(
          overlayCanvasRef.current, 
          detections.map(d => ({ box: d.box, confidence: d.confidence }))
        );
      }
    } catch (err) {
      console.error("Face detection error:", err);
    } finally {
      setIsDetecting(false);
    }
  }, [modelsLoaded, isDetecting, detectFacesFromHook]);

  const startCamera = useCallback(async () => {
    try {
      setError("");
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: false,
      });
      
      setStream(mediaStream);
      setHasPermission(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          // Set overlay canvas dimensions to match video
          if (overlayCanvasRef.current && videoRef.current) {
            const video = videoRef.current;
            overlayCanvasRef.current.width = video.videoWidth;
            overlayCanvasRef.current.height = video.videoHeight;
          }
        };
      }
      
      // Start face detection
      if (modelsLoaded) {
        detectionIntervalRef.current = window.setInterval(performFaceDetection, 100);
      }
    } catch (err) {
      console.error("Camera error:", err);
      setError("Camera access denied or unavailable");
      setHasPermission(false);
    }
  }, [modelsLoaded, performFaceDetection]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    setFaceDetections([]);
    setFaceDetected(false);
  }, [stream]);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current && stream) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        
        // Get the captured image as a data URL for preview
        const imageDataUrl = canvas.toDataURL("image/jpeg", 0.8);
        setCapturedImage(imageDataUrl);
      }
    }
  }, [stream]);

  const confirmCapture = useCallback(() => {
    if (canvasRef.current) {
      canvasRef.current.toBlob((blob) => {
        if (blob) {
          onCapture(blob, faceDetected);
          setCapturedImage("");
        }
      }, "image/jpeg", 0.8);
    }
  }, [onCapture, faceDetected]);

  const retakePhoto = useCallback(() => {
    setCapturedImage("");
  }, []);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onCapture(file, false); // File uploads can't detect faces in real-time
    }
    event.target.value = '';
  }, [onCapture]);

  useEffect(() => {
    return () => {
      stopCamera();
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, [stopCamera]);

  if (hasPermission === false) {
    return (
      <Card className="w-full shadow-elegant">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="text-destructive">
              <Camera className="h-12 w-12 mx-auto mb-2" />
              <p className="text-sm">{error}</p>
            </div>
            <div className="space-y-2">
              <Button onClick={startCamera} variant="outline" className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isCapturing}
                />
                <Button variant="secondary" className="w-full" disabled={isCapturing}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Photo Instead
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-elegant">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="relative">
            {capturedImage ? (
              // Show captured image preview
              <div className="relative">
                <img 
                  src={capturedImage} 
                  alt="Captured photo" 
                  className="w-full rounded-lg bg-muted"
                  style={{ maxHeight: '400px', objectFit: 'cover' }}
                />
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  <Button 
                    onClick={retakePhoto}
                    variant="outline"
                    size="lg"
                    className="rounded-full h-12 w-12 p-0"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                  <Button 
                    onClick={confirmCapture}
                    disabled={isCapturing || (requireFaceDetection && !faceDetected)}
                    size="lg"
                    className="rounded-full h-12 w-12 p-0 bg-primary"
                  >
                    <Check className="h-5 w-5" />
                  </Button>
                </div>
                {requireFaceDetection && !faceDetected && (
                  <div className="absolute top-4 left-4 right-4">
                    <Badge variant="destructive" className="w-full justify-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      No face detected in captured image
                    </Badge>
                  </div>
                )}
              </div>
            ) : (
              // Show live camera feed with face detection overlay
              <>
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full rounded-lg bg-muted"
                    style={{ maxHeight: '400px' }}
                  />
                  <canvas
                    ref={overlayCanvasRef}
                    className="absolute top-0 left-0 w-full h-full pointer-events-none rounded-lg"
                    style={{ maxHeight: '400px' }}
                  />
                  <canvas ref={canvasRef} className="hidden" />
                  
                  {hasPermission === null && (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-lg">
                      <Button onClick={startCamera} size="lg">
                        <Camera className="h-5 w-5 mr-2" />
                        Start Camera
                      </Button>
                    </div>
                  )}
                  
                  {stream && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
                      <Button 
                        onClick={capturePhoto} 
                        disabled={isCapturing || (requireFaceDetection && !faceDetected)}
                        size="lg"
                        className="rounded-full h-16 w-16 p-0"
                        aria-label="Capture Photo"
                      >
                        <Camera className="h-8 w-8" />
                      </Button>
                      <span className="mt-2 text-sm font-medium text-foreground">Capture</span>
                    </div>
                  )}

                  {/* Face detection status */}
                  {stream && modelsLoaded && (
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                      <Badge 
                        variant={faceDetected ? "default" : "secondary"}
                        className={faceDetected ? "bg-green-600" : ""}
                      >
                        {faceDetected ? `${faceDetections.length} Face${faceDetections.length > 1 ? 's' : ''} Detected` : 'No Face Detected'}
                      </Badge>
                      {requireFaceDetection && !faceDetected && (
                        <Badge variant="outline" className="bg-background/80">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Face Required
                        </Badge>
                      )}
                    </div>
                  )}

                  {stream && !modelsLoaded && (
                    <div className="absolute top-4 left-4">
                      <Badge variant="secondary">
                        Loading face detection...
                      </Badge>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
          
          {stream && !capturedImage && (
            <div className="flex justify-between items-center">
              <Badge variant="secondary" className="text-primary">
                Camera Active
              </Badge>
              <div className="space-x-2">
                <Button variant="outline" size="sm" onClick={stopCamera}>
                  Stop Camera
                </Button>
                <div className="relative inline-block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isCapturing}
                  />
                  <Button variant="outline" size="sm" disabled={isCapturing}>
                    <Upload className="h-4 w-4 mr-1" />
                    Upload
                  </Button>
                </div>
              </div>
            </div>
          )}

          {capturedImage && (
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Photo captured! {requireFaceDetection && !faceDetected 
                  ? "No face detected - please retake or disable face detection requirement." 
                  : "Click the checkmark to confirm or X to retake."}
              </p>
            </div>
          )}

          {/* Face detection guidance */}
          {stream && !capturedImage && modelsLoaded && (
            <div className="text-center space-y-2">
              <p className="text-xs text-muted-foreground">
                {faceDetected 
                  ? "Great! Your face is detected. You can now capture the photo." 
                  : "Please position your face within the camera frame for better recognition."}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
