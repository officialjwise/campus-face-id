import React, { useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const CameraDebugTest: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    console.log(message);
    setLogs(prev => [`${new Date().toLocaleTimeString()}: ${message}`, ...prev.slice(0, 9)]);
  };

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      addLog('Starting camera...');

      // Check browser support
      if (!navigator.mediaDevices) {
        throw new Error('navigator.mediaDevices not supported');
      }

      if (!navigator.mediaDevices.getUserMedia) {
        throw new Error('getUserMedia not supported');
      }

      addLog('Browser supports getUserMedia');

      // Check permissions
      try {
        const permissions = await navigator.permissions.query({ name: 'camera' as PermissionName });
        addLog(`Camera permission status: ${permissions.state}`);
      } catch (permErr) {
        addLog('Cannot check camera permissions');
      }

      addLog('Requesting camera access...');

      const constraints = {
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
        },
      };

      addLog(`Using constraints: ${JSON.stringify(constraints)}`);

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      addLog(`Stream obtained. Tracks: ${stream.getVideoTracks().length}`);
      
      if (stream.getVideoTracks().length === 0) {
        throw new Error('No video tracks in stream');
      }

      const videoTrack = stream.getVideoTracks()[0];
      addLog(`Video track settings: ${JSON.stringify(videoTrack.getSettings())}`);

      if (!videoRef.current) {
        throw new Error('Video element not found');
      }

      addLog('Setting video source...');
      videoRef.current.srcObject = stream;

      // Wait for metadata to load
      videoRef.current.onloadedmetadata = () => {
        addLog('Video metadata loaded');
        addLog(`Video dimensions: ${videoRef.current?.videoWidth}x${videoRef.current?.videoHeight}`);
        setIsStreaming(true);
      };

      videoRef.current.oncanplay = () => {
        addLog('Video can play');
      };

      videoRef.current.onplay = () => {
        addLog('Video started playing');
      };

      videoRef.current.onerror = (e) => {
        addLog(`Video error: ${e}`);
      };

      // Try to play
      try {
        await videoRef.current.play();
        addLog('Video play() succeeded');
      } catch (playError) {
        addLog(`Video play() failed: ${playError}`);
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      addLog(`Error: ${errorMessage}`);
      setError(errorMessage);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => {
        track.stop();
        addLog(`Stopped track: ${track.kind}`);
      });
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
    addLog('Camera stopped');
  }, []);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Camera Debug Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button
            onClick={isStreaming ? stopCamera : startCamera}
            variant={isStreaming ? "destructive" : "default"}
          >
            {isStreaming ? 'Stop Camera' : 'Start Camera'}
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isStreaming && (
          <div>
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-auto rounded-lg bg-black"
            />
          </div>
        )}

        <div className="space-y-2">
          <h3 className="font-semibold">Debug Logs:</h3>
          <div className="h-40 overflow-y-auto bg-gray-100 p-2 rounded text-sm font-mono">
            {logs.map((log, index) => (
              <div key={index}>{log}</div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
