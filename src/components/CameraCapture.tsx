import { useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, CameraOff, RotateCcw } from "lucide-react";

interface CameraCaptureProps {
  onCapture: (imageBlob: Blob) => void;
  isCapturing?: boolean;
}

const CameraCapture = ({ onCapture, isCapturing = false }: CameraCaptureProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraOn(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setIsCameraOn(false);
    }
  }, []);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const imageUrl = URL.createObjectURL(blob);
            setCapturedImage(imageUrl);
            onCapture(blob);
            stopCamera();
          }
        }, "image/jpeg", 0.8);
      }
    }
  }, [onCapture, stopCamera]);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    startCamera();
  }, [startCamera]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="relative">
            {capturedImage ? (
              <div className="relative">
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="w-full h-64 object-cover rounded-lg border-2 border-primary/20"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg" />
              </div>
            ) : (
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-64 object-cover rounded-lg border-2 border-primary/20 bg-muted"
                />
                {!isCameraOn && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-lg">
                    <Camera className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          <div className="flex gap-2 justify-center">
            {!isCameraOn && !capturedImage && (
              <Button onClick={startCamera} variant="camera" className="flex-1">
                <Camera className="h-4 w-4" />
                Start Camera
              </Button>
            )}

            {isCameraOn && !capturedImage && (
              <>
                <Button 
                  onClick={capturePhoto} 
                  variant="hero" 
                  className="flex-1"
                  disabled={isCapturing}
                >
                  <Camera className="h-4 w-4" />
                  {isCapturing ? "Processing..." : "Capture"}
                </Button>
                <Button onClick={stopCamera} variant="outline">
                  <CameraOff className="h-4 w-4" />
                </Button>
              </>
            )}

            {capturedImage && (
              <Button onClick={retakePhoto} variant="outline" className="flex-1">
                <RotateCcw className="h-4 w-4" />
                Retake
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CameraCapture;