import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Camera, CameraOff, Users, AlertCircle } from 'lucide-react';
import { useFaceDetection, FaceDetectionResult } from '@/hooks/useFaceDetection';

interface LiveFaceRecognitionProps {
  onFaceDetected: (faceData: { image: string; detection: FaceDetectionResult }) => void;
  onError: (error: string) => void;
  isRecognizing?: boolean;
  autoCapture?: boolean;
  captureThreshold?: number;
}

export const LiveFaceRecognition: React.FC<LiveFaceRecognitionProps> = ({
  onFaceDetected,
  onError,
  isRecognizing = false,
  autoCapture = true,
  captureThreshold = 0.8,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number>();
  const captureTimeoutRef = useRef<NodeJS.Timeout>();

  const [isStreaming, setIsStreaming] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [currentDetection, setCurrentDetection] = useState<FaceDetectionResult | null>(null);
  const [captureCountdown, setCaptureCountdown] = useState<number | null>(null);
  const [guidanceMessage, setGuidanceMessage] = useState<string>('');

  const { modelsLoaded, loading, error, detectFaces } = useFaceDetection();

  // Start camera stream
  const startCamera = useCallback(async () => {
    try {
      console.log('Starting camera...');
      setCameraError(null);
      setGuidanceMessage('Starting camera...');

      // Check if getUserMedia is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access not supported by this browser');
      }

      console.log('Requesting camera access...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
        },
      });

      console.log('Camera stream obtained:', stream);

      if (videoRef.current) {
        console.log('Setting video source...');
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        // Wait for video to load
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded');
          console.log(`Video dimensions: ${videoRef.current?.videoWidth}x${videoRef.current?.videoHeight}`);
          setIsStreaming(true);
          setGuidanceMessage('Position your face in the camera');
        };

        videoRef.current.oncanplay = () => {
          console.log('Video can play');
        };

        videoRef.current.onplaying = () => {
          console.log('Video is playing');
        };

        // Also try to play the video
        try {
          await videoRef.current.play();
          console.log('Video playing');
        } catch (playError) {
          console.error('Error playing video:', playError);
        }
      } else {
        console.error('Video ref is null');
      }
    } catch (err) {
      console.error('Camera error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to access camera. Please check permissions.';
      setCameraError(errorMessage);
      onError(errorMessage);
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

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    if (captureTimeoutRef.current) {
      clearTimeout(captureTimeoutRef.current);
    }

    setIsStreaming(false);
    setCurrentDetection(null);
    setCaptureCountdown(null);
    setGuidanceMessage('');
  }, []);

  // Draw detection overlay
  const drawDetectionOverlay = useCallback((detections: FaceDetectionResult[]) => {
    if (!canvasRef.current || !videoRef.current) {
      console.log('Cannot draw overlay - missing refs:', { 
        hasCanvas: !!canvasRef.current, 
        hasVideo: !!videoRef.current 
      });
      return;
    }

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      console.log('Cannot get canvas context');
      return;
    }

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.style.width = video.offsetWidth + 'px';
    canvas.style.height = video.offsetHeight + 'px';

    console.log('Drawing overlay:', { 
      detections: detections.length,
      videoSize: `${video.videoWidth}x${video.videoHeight}`,
      canvasSize: `${canvas.width}x${canvas.height}`,
      displaySize: `${video.offsetWidth}x${video.offsetHeight}`
    });

    // Clear previous drawings
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    detections.forEach((detection, index) => {
      console.log(`Drawing detection ${index}:`, detection);
      const { x, y, width, height } = detection.box;
      const confidence = detection.confidence;
      
      // Choose color based on confidence
      let color = '#ff0000'; // Red for low confidence
      if (confidence > captureThreshold) {
        color = '#00ff00'; // Green for good detection
      } else if (confidence > 0.6) {
        color = '#ffff00'; // Yellow for medium confidence
      }

      console.log(`Drawing box at (${x}, ${y}) ${width}x${height} with color ${color}`);

      // Draw bounding box
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, width, height);

      // Draw confidence score
      ctx.fillStyle = color;
      ctx.font = '16px Arial';
      ctx.fillText(
        `${(confidence * 100).toFixed(1)}%`,
        x,
        y > 20 ? y - 5 : y + height + 20
      );

      // Draw center crosshair
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      const centerX = x + width / 2;
      const centerY = y + height / 2;
      const crossSize = 10;
      
      // Horizontal line
      ctx.beginPath();
      ctx.moveTo(centerX - crossSize, centerY);
      ctx.lineTo(centerX + crossSize, centerY);
      ctx.stroke();
      
      // Vertical line
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - crossSize);
      ctx.lineTo(centerX, centerY + crossSize);
      ctx.stroke();
    });
  }, [captureThreshold]);

  // Update guidance message based on detection
  const updateGuidanceMessage = useCallback((detections: FaceDetectionResult[]) => {
    if (detections.length === 0) {
      setGuidanceMessage('No face detected. Please position your face in the camera.');
    } else if (detections.length > 1) {
      setGuidanceMessage('Multiple faces detected. Please ensure only you are visible.');
    } else {
      const detection = detections[0];
      if (detection.confidence < 0.6) {
        setGuidanceMessage('Face detection confidence low. Please improve lighting.');
      } else if (detection.confidence < captureThreshold) {
        setGuidanceMessage('Hold still for better detection...');
      } else {
        setGuidanceMessage('Perfect! Face detected successfully.');
      }
    }
  }, [captureThreshold]);

  // Auto-capture logic
  const handleAutoCapture = useCallback(async (detection: FaceDetectionResult) => {
    if (!autoCapture || !videoRef.current || isRecognizing) return;

    // Start countdown if not already started
    if (!captureCountdown && detection.confidence > captureThreshold) {
      setCaptureCountdown(3);
      setGuidanceMessage('Great! Auto-capturing in 3 seconds...');

      captureTimeoutRef.current = setTimeout(async () => {
        try {
          // Capture image from video
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx || !videoRef.current) return;

          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          
          const imageData = canvas.toDataURL('image/jpeg', 0.8);
          
          onFaceDetected({
            image: imageData,
            detection,
          });

          setCaptureCountdown(null);
          setGuidanceMessage('Face captured! Processing...');
        } catch (err) {
          onError('Failed to capture image. Please try again.');
          setCaptureCountdown(null);
        }
      }, 3000);
    }
  }, [autoCapture, captureThreshold, isRecognizing, onFaceDetected, onError]);

  // Face detection loop
  const runDetection = useCallback(async () => {
    if (!videoRef.current || !modelsLoaded || !isStreaming) {
      console.log('Skipping detection:', { 
        hasVideo: !!videoRef.current, 
        modelsLoaded, 
        isStreaming,
        videoReady: videoRef.current?.readyState 
      });
      return;
    }

    // Check if video is ready
    if (videoRef.current.readyState < 2) {
      console.log('Video not ready for detection, readyState:', videoRef.current.readyState);
      animationRef.current = requestAnimationFrame(runDetection);
      return;
    }

    try {
      console.log('Running face detection...');
      const detections = await detectFaces(videoRef.current);
      console.log('Detections found:', detections.length, detections);
      setCurrentDetection(detections[0] || null);
      
      drawDetectionOverlay(detections);
      updateGuidanceMessage(detections);

      // Auto-capture if enabled and good detection
      if (detections.length === 1 && detections[0].confidence > captureThreshold) {
        console.log('Good detection found, starting auto-capture');
        await handleAutoCapture(detections[0]);
      } else {
        // Reset countdown if detection quality drops
        if (captureCountdown) {
          clearTimeout(captureTimeoutRef.current!);
          setCaptureCountdown(null);
        }
      }

    } catch (err) {
      console.error('Detection error:', err);
    }

    // Schedule next detection
    animationRef.current = requestAnimationFrame(runDetection);
  }, [
    modelsLoaded,
    isStreaming,
    detectFaces,
    drawDetectionOverlay,
    updateGuidanceMessage,
    handleAutoCapture,
    captureThreshold,
    captureCountdown,
  ]);

  // Start detection loop when video is ready
  useEffect(() => {
    if (isStreaming && modelsLoaded && videoRef.current) {
      console.log('Setting up detection loop...');
      const video = videoRef.current;
      
      const startDetectionLoop = () => {
        console.log('Starting detection loop, video readyState:', video.readyState);
        if (video.readyState >= 2) {
          console.log('Video is ready, starting detection immediately');
          runDetection();
        } else {
          console.log('Video not ready, waiting for loadeddata event');
        }
      };

      const handleLoadedData = () => {
        console.log('Video loadeddata event fired');
        runDetection();
      };

      const handleCanPlay = () => {
        console.log('Video canplay event fired');
        runDetection();
      };

      // Try to start immediately if video is already ready
      if (video.readyState >= 2) {
        startDetectionLoop();
      } else {
        // Otherwise wait for video to be ready
        video.addEventListener('loadeddata', handleLoadedData);
        video.addEventListener('canplay', handleCanPlay);
      }

      return () => {
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('canplay', handleCanPlay);
      };
    }
  }, [isStreaming, modelsLoaded, runDetection]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  // Update countdown display
  useEffect(() => {
    if (captureCountdown !== null && captureCountdown > 0) {
      const timer = setTimeout(() => {
        setCaptureCountdown(prev => prev ? prev - 1 : null);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [captureCountdown]);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Face Recognition Camera
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Model Loading Status */}
        {loading && (
          <Alert>
            <Loader2 className="w-4 h-4 animate-spin" />
            <AlertDescription>Loading face detection models...</AlertDescription>
          </Alert>
        )}

        {/* Error Messages */}
        {(error || cameraError) && (
          <Alert variant="destructive">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>{error || cameraError}</AlertDescription>
          </Alert>
        )}

        {/* Debug Info */}
        <Alert>
          <AlertDescription>
            <div className="space-y-1 text-xs">
              <div>Models loaded: {modelsLoaded ? '✅' : '❌'}</div>
              <div>Models loading: {loading ? '⏳' : '✅'}</div>
              <div>Camera streaming: {isStreaming ? '✅' : '❌'}</div>
              <div>Browser support: {navigator.mediaDevices ? '✅' : '❌'}</div>
              <div>getUserMedia: {navigator.mediaDevices?.getUserMedia ? '✅' : '❌'}</div>
            </div>
          </AlertDescription>
        </Alert>

        {/* Camera Controls */}
        <div className="flex gap-2">
          <Button
            onClick={isStreaming ? stopCamera : startCamera}
            disabled={loading}
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
          <div className="text-sm text-muted-foreground">
            Models: {modelsLoaded ? '✓ Loaded' : loading ? '⏳ Loading...' : '❌ Failed'}
          </div>
        </div>

        {/* Video Feed with Overlay - Always show for debugging */}
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-auto rounded-lg bg-black min-h-[200px]"
            style={{ backgroundColor: isStreaming ? 'transparent' : '#000' }}
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 pointer-events-none rounded-lg"
          />
          
          {/* Capture Countdown Overlay */}
          {captureCountdown !== null && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
              <div className="text-white text-6xl font-bold animate-pulse">
                {captureCountdown}
              </div>
            </div>
          )}

          {/* Debug overlay */}
          {!isStreaming && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 rounded-lg">
              <div className="text-white text-center">
                <Camera className="w-12 h-12 mx-auto mb-2" />
                <p>Camera not active</p>
              </div>
            </div>
          )}
        </div>

        {/* Guidance Message */}
        {guidanceMessage && (
          <Alert>
            <AlertDescription>{guidanceMessage}</AlertDescription>
          </Alert>
        )}

        {/* Detection Info */}
        {currentDetection && (
          <div className="text-sm text-muted-foreground">
            Detection Confidence: {(currentDetection.confidence * 100).toFixed(1)}%
            {autoCapture && currentDetection.confidence > captureThreshold && (
              <span className="text-green-600 ml-2">✓ Ready for capture</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
