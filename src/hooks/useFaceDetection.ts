import { useState, useEffect, useCallback } from 'react';
import * as faceapi from 'face-api.js';

export interface FaceDetectionResult {
  box: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  confidence: number;
  landmarks?: any;
  descriptor?: Float32Array;
}

export const useFaceDetection = () => {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadModels = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const MODEL_URL = '/models';
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      ]);
      setModelsLoaded(true);
    } catch (err) {
      console.error("Failed to load face detection models:", err);
      setError("Failed to load face detection models");
      setModelsLoaded(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const detectFaces = useCallback(async (
    input: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement
  ): Promise<FaceDetectionResult[]> => {
    if (!modelsLoaded) {
      throw new Error('Face detection models not loaded');
    }

    try {
      const detections = await faceapi
        .detectAllFaces(input, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();

      return detections.map(detection => ({
        box: {
          x: detection.detection.box.x,
          y: detection.detection.box.y,
          width: detection.detection.box.width,
          height: detection.detection.box.height,
        },
        confidence: detection.detection.score,
        landmarks: detection.landmarks,
        descriptor: detection.descriptor,
      }));
    } catch (err) {
      console.error("Face detection error:", err);
      throw err;
    }
  }, [modelsLoaded]);

  const compareFaces = useCallback((
    descriptor1: Float32Array, 
    descriptor2: Float32Array,
    threshold: number = 0.6
  ): { distance: number; match: boolean } => {
    const distance = faceapi.euclideanDistance(descriptor1, descriptor2);
    return {
      distance,
      match: distance < threshold
    };
  }, []);

  useEffect(() => {
    loadModels();
  }, [loadModels]);

  return {
    modelsLoaded,
    loading,
    error,
    loadModels,
    detectFaces,
    compareFaces,
  };
};

export default useFaceDetection;
