# Face Recognition Setup Guide

## 📋 **Setup Instructions for Live Face Recognition**

### **1. Download Required Model Files**

Download the following model files and place them in `/public/models/` directory:

#### **Required Models:**
1. **tiny_face_detector_model-weights_manifest.json**
2. **tiny_face_detector_model-shard1** 
3. **face_landmark_68_model-weights_manifest.json**
4. **face_landmark_68_model-shard1**
5. **face_recognition_model-weights_manifest.json**
6. **face_recognition_model-shard1**
7. **face_recognition_model-shard2**

### **2. Download Links**
```bash
# Create models directory
mkdir -p public/models

# Download from face-api.js repository
curl -o public/models/tiny_face_detector_model-weights_manifest.json \
  https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-weights_manifest.json

curl -o public/models/tiny_face_detector_model-shard1 \
  https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-shard1

curl -o public/models/face_landmark_68_model-weights_manifest.json \
  https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-weights_manifest.json

curl -o public/models/face_landmark_68_model-shard1 \
  https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-shard1

curl -o public/models/face_recognition_model-weights_manifest.json \
  https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-weights_manifest.json

curl -o public/models/face_recognition_model-shard1 \
  https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-shard1

curl -o public/models/face_recognition_model-shard2 \
  https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-shard2
```

### **3. File Structure**
After setup, your directory should look like:
```
public/
├── models/
│   ├── tiny_face_detector_model-weights_manifest.json
│   ├── tiny_face_detector_model-shard1
│   ├── face_landmark_68_model-weights_manifest.json
│   ├── face_landmark_68_model-shard1
│   ├── face_recognition_model-weights_manifest.json
│   ├── face_recognition_model-shard1
│   └── face_recognition_model-shard2
└── ...
```

### **4. Features Implemented**

✅ **Live Face Detection**
- Real-time face detection with bounding boxes
- Confidence scoring
- Auto-capture when face is properly detected

✅ **Recognition System**  
- Live recognition mode with auto-capture
- Manual capture mode (existing functionality)
- Student verification with exam room details
- Recognition history tracking

✅ **UI Enhancements**
- Live video feed with overlay
- Guidance messages for user positioning
- Countdown timer for auto-capture
- Recognition confidence display
- Exam room assignment display

### **5. Backend Integration Ready**

The frontend sends recognition requests to:
- `POST /students/recognize` - Face recognition endpoint
- `GET /students/{id}/verify` - Student verification endpoint
- `GET /recognition/status` - System status check

Expected response format:
```json
{
  "success": true,
  "student": {
    "id": "uuid",
    "first_name": "John", 
    "last_name": "Doe",
    "student_id": "12345678",
    "index_number": "1234567",
    "email": "john@knust.edu.gh",
    "college_name": "College of Sciences",
    "department_name": "Computer Science",
    "exam_room": {
      "room_number": "A101",
      "exam_title": "Database Systems",
      "exam_date": "2025-08-15T09:00:00Z",
      "seat_number": "15"
    }
  },
  "confidence": 0.95,
  "message": "Student recognized successfully"
}
```

### **6. Usage**

1. **Registration**: Students register with photos (already working)
2. **Recognition**: Students can be verified using either:
   - **Live Mode**: Auto-capture when face detected
   - **Manual Mode**: Click to capture (existing)
3. **Results**: Display student info + exam room assignment

### **7. Performance Notes**

- Model files total ~6MB (will load once and cache)
- Face detection runs at ~10 FPS for smooth real-time experience  
- Auto-capture triggered after 3 seconds of stable detection
- Works best with good lighting and clear face positioning

The system is now ready for testing! Just download the model files and the live face recognition will work immediately.
