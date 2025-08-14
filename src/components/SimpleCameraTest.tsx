import React, { useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Camera, CameraOff, AlertCircle } from 'lucide-react';

interface SimpleCameraTestProps {
  onError?: (error: string) => void;
}

export const SimpleCameraTest: React.FC<SimpleCameraTestProps> = ({
  onError,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isStreaming, setIsStreaming] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');

  // Start camera stream
  const startCamera = useCallback(async () => {
    try {
      setCameraError(null);
      setDebugInfo('Requesting camera access...');

      // Check if getUserMedia is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported in this browser');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
        },
      });

      setDebugInfo('Camera access granted, setting up video...');

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        // Wait for video to load
        videoRef.current.onloadedmetadata = () => {
          setDebugInfo('Video metadata loaded');
          setIsStreaming(true);
        };

        videoRef.current.oncanplay = () => {
          setDebugInfo('Video can play');
        };

        videoRef.current.onerror = (e) => {
          setDebugInfo(`Video error: ${e}`);
          setCameraError('Video playback error');
        };
      }
    } catch (err: any) {
      const errorMessage = `Camera error: ${err.message || err}`;
      setCameraError(errorMessage);
      setDebugInfo(errorMessage);
      onError?.(errorMessage);
      console.error('Camera access error:', err);
    }
  }, [onError]);

  // Stop camera stream
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsStreaming(false);
    setDebugInfo('Camera stopped');
  }, []);

  // Capture photo
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !isStreaming) {
      setDebugInfo('Cannot capture: video not ready');
      return;
    }

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setDebugInfo('Canvas context not available');
        return;
      }

      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      setDebugInfo(`Photo captured: ${imageData.substring(0, 50)}...`);
      
      console.log('Captured image data:', imageData.substring(0, 100));
    } catch (err: any) {
      setDebugInfo(`Capture error: ${err.message}`);
      console.error('Capture error:', err);
    }
  }, [isStreaming]);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="w-5 h-5" />
          Camera Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Debug Info */}
        {debugInfo && (
          <Alert>
            <AlertDescription>Debug: {debugInfo}</AlertDescription>
          </Alert>
        )}

        {/* Error Messages */}
        {cameraError && (
          <Alert variant="destructive">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>{cameraError}</AlertDescription>
          </Alert>
        )}

        {/* Camera Controls */}
        <div className="flex gap-2">
          <Button
            onClick={isStreaming ? stopCamera : startCamera}
            variant={isStreaming ? "destructive" : "default"}
          >
            {isStreaming ? (
              <>
                <CameraOff className="w-4 h-4 mr-2" />
                Stop Camera
              </>
            ) : (
              <>
                <Camera className="w-4 h-4 mr-2" />
                Start Camera
              </>
            )}
          </Button>

          {isStreaming && (
            <Button onClick={capturePhoto} variant="outline">
              Capture Test Photo
            </Button>
          )}
        </div>

        {/* Video Feed */}
        {isStreaming && (
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-auto rounded-lg bg-black"
            />
          </div>
        )}

        {/* Browser Support Info */}
        <div className="text-sm text-muted-foreground">
          <p>Browser Support:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>getUserMedia: {navigator.mediaDevices ? '✅' : '❌'}</li>
            <li>Video: {document.createElement('video').canPlayType('video/mp4') ? '✅' : '❌'}</li>
            <li>Canvas: {document.createElement('canvas').getContext ? '✅' : '❌'}</li>
            <li>HTTPS: {window.location.protocol === 'https:' || window.location.hostname === 'localhost' ? '✅' : '❌'}</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
