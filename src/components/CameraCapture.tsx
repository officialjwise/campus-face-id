import { useState, useRef, useCallback, useEffect, forwardRef, useImperativeHandle } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, RefreshCw, Upload, Check, X } from "lucide-react";

interface CameraCaptureProps {
  onCapture: (blob: Blob) => void | Promise<void>;
  isCapturing: boolean;
}

export interface CameraCaptureRef {
  reset: () => void;
}

const CameraCapture = forwardRef<CameraCaptureRef, CameraCaptureProps>(({ onCapture, isCapturing }, ref) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>("");
  const [capturedImage, setCapturedImage] = useState<string>("");
  const [isImageConfirmed, setIsImageConfirmed] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
      }
    } catch (err) {
      console.error("Camera error:", err);
      setError("Camera access denied or unavailable");
      setHasPermission(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
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
          onCapture(blob);
          setIsImageConfirmed(true);
          stopCamera(); // Stop camera after confirming capture
        }
      }, "image/jpeg", 0.8);
    }
  }, [onCapture, stopCamera]);

  const retakePhoto = useCallback(() => {
    setCapturedImage("");
    setIsImageConfirmed(false);
    // Restart camera for retaking
    if (!stream) {
      startCamera();
    }
  }, [stream, startCamera]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      // Create a preview of the uploaded file
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setCapturedImage(e.target.result as string);
          stopCamera(); // Stop camera when file is uploaded
          
          // Store the file for later confirmation
          const confirmUpload = () => {
            onCapture(file);
            setIsImageConfirmed(true);
          };
          
          // Auto-confirm after setting the preview
          setTimeout(confirmUpload, 100);
        }
      };
      reader.readAsDataURL(file);
    }
    event.target.value = '';
  }, [onCapture, stopCamera]);

  const resetCamera = useCallback(() => {
    setCapturedImage("");
    setIsImageConfirmed(false);
    stopCamera();
    setHasPermission(null);
    setError("");
  }, [stopCamera]);

  useImperativeHandle(ref, () => ({
    reset: resetCamera
  }), [resetCamera]);

  useEffect(() => {
    return () => {
      stopCamera();
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
              // Show captured/uploaded image preview
              <div className="relative">
                <img 
                  src={capturedImage} 
                  alt="Captured photo" 
                  className="w-full rounded-lg bg-muted"
                  style={{ maxHeight: '400px', objectFit: 'cover' }}
                />
                {!isImageConfirmed && (
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
                      disabled={isCapturing}
                      size="lg"
                      className="rounded-full h-12 w-12 p-0 bg-primary"
                    >
                      <Check className="h-5 w-5" />
                    </Button>
                  </div>
                )}
                {isImageConfirmed && (
                  <div className="absolute top-4 right-4">
                    <Badge variant="default" className="bg-green-600">
                      <Check className="h-4 w-4 mr-1" />
                      Photo Confirmed
                    </Badge>
                  </div>
                )}
              </div>
            ) : (
              // Show live camera feed
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full rounded-lg bg-muted"
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
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <Button 
                      onClick={capturePhoto} 
                      disabled={isCapturing}
                      size="lg"
                      className="rounded-full h-16 w-16 p-0"
                    >
                      <Camera className="h-8 w-8" />
                    </Button>
                  </div>
                )}
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

          {capturedImage && !isImageConfirmed && (
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Photo captured! Click the checkmark to confirm or X to retake.
              </p>
            </div>
          )}

          {isImageConfirmed && (
            <div className="text-center space-y-2">
              <p className="text-sm text-green-600 font-medium">
                ✓ Your photo has been captured and will be included in the registration.
              </p>
              <Button 
                onClick={retakePhoto}
                variant="outline"
                size="sm"
              >
                <Camera className="h-4 w-4 mr-2" />
                Take New Photo
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

CameraCapture.displayName = "CameraCapture";
export default CameraCapture;