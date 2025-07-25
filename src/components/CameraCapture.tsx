import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, RefreshCw, Upload, Check, X } from "lucide-react";

interface CameraCaptureProps {
  onCapture: (blob: Blob) => void | Promise<void>;
  isCapturing: boolean;
}

export default function CameraCapture({ onCapture, isCapturing }: CameraCaptureProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>("");
  const [capturedImage, setCapturedImage] = useState<string>("");
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
          setCapturedImage("");
        }
      }, "image/jpeg", 0.8);
    }
  }, [onCapture]);

  const retakePhoto = useCallback(() => {
    setCapturedImage("");
  }, []);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onCapture(file);
    }
    event.target.value = '';
  }, [onCapture]);

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
                    disabled={isCapturing}
                    size="lg"
                    className="rounded-full h-12 w-12 p-0 bg-primary"
                  >
                    <Check className="h-5 w-5" />
                  </Button>
                </div>
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

          {capturedImage && (
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Photo captured! Click the checkmark to confirm or X to retake.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}