# Campus Face ID - Facial Recognition with Bounding Boxes

## Enhanced Facial Recognition Features

This Campus Face ID application now includes improved facial recognition capabilities with real-time face detection and bounding box visualization.

### New Features Added

#### 1. Real-time Face Detection with Bounding Boxes
- **Live Face Detection**: Real-time detection of faces in camera feed using face-api.js
- **Visual Bounding Boxes**: Green boxes appear around detected faces with confidence scores
- **Multiple Face Support**: Can detect and highlight multiple faces simultaneously
- **Confidence Indicators**: Color-coded boxes based on detection confidence:
  - Green: High confidence (>70%)
  - Amber: Medium confidence (40-70%)
  - Red: Low confidence (<40%)

#### 2. Enhanced Camera Component (`FaceDetectionCamera.tsx`)
- **Smart Capture**: Only allows photo capture when face is detected (configurable)
- **Visual Guidance**: Red dashed outline shows where to position face when none detected
- **Real-time Status**: Live indicators showing face detection status
- **Fallback Support**: Graceful degradation if face detection models fail to load

#### 3. Improved Registration & Recognition
- **Registration**: Enhanced student registration with face detection validation
- **Recognition**: Better identification accuracy with face-detected images
- **Feedback**: Clear visual and textual feedback about face detection status

### Technical Implementation

#### Dependencies Added
- `face-api.js`: Core facial recognition and detection library
- Pre-trained models for face detection, landmarks, and recognition

#### Key Components
1. **FaceDetectionCamera**: Enhanced camera component with face detection
2. **useFaceDetection**: Custom React hook for face detection logic
3. **faceDetectionUtils**: Utility functions for drawing bounding boxes

#### Model Files
The application uses the following pre-trained models (automatically downloaded):
- `tiny_face_detector_model`: Lightweight face detection
- `face_landmark_68_model`: Facial landmark detection
- `face_recognition_model`: Face encoding for recognition

### Usage

#### For Student Registration
1. Navigate to `/register`
2. Fill in student details
3. Use the camera to capture photo - face detection will guide positioning
4. System will only allow submission if face is detected (configurable)

#### For Student Recognition
1. Navigate to `/recognition`
2. Use the camera to scan a face
3. Real-time bounding boxes will appear around detected faces
4. Capture photo when face is properly detected
5. System will attempt to identify the student

### Configuration Options

The `FaceDetectionCamera` component accepts these props:
- `requireFaceDetection`: Whether to require face detection for capture (default: true)
- `onCapture`: Callback with image blob and face detection status
- `isCapturing`: Loading state for the capture process

### Browser Requirements
- Modern browser with WebRTC support
- Camera permissions
- HTTPS for production deployment (required for camera access)

### Performance Optimization
- Detection runs every 100ms to balance accuracy and performance
- Models are loaded once and cached
- Overlay canvas for smooth bounding box rendering
- Configurable detection requirements for flexibility

### Future Enhancements
- Face recognition model training with captured images
- Anti-spoofing detection
- Face matching confidence thresholds
- Batch processing for multiple students
- Integration with backend facial recognition APIs
