# KNUST Exam Room Management System - Demo Guide

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 18+ installed
- Backend API running (see DASHBOARD_API_REQUIREMENTS.md)
- Camera permissions for face recognition

### Installation & Setup
```bash
# Clone the repository
cd /Users/phill/Desktop/campus-face-id

# Install dependencies
npm install

# Start development server
npm run dev
```

### Demo Workflow

#### 1. **Admin Dashboard - Room Management**
Navigate to: `http://localhost:8080/admin/rooms`

**Test Scenario**: Create a new exam room assignment
1. Click "Create New Assignment"
2. Fill in room details:
   - Room Code: `CSM-001`
   - Room Name: `Computer Science Lab 1`
   - Index Start: `20210001`
   - Index End: `20210050`
   - Capacity: `50`
3. Click "Preview Assignment" to see affected students
4. Save the assignment
5. Verify it appears in the room list

#### 2. **Face Recognition Validation**
Navigate to: `http://localhost:8080/exam-hall`

**Test Scenario**: Validate student entry with camera
1. Allow camera permissions
2. Select room "CSM-001" from dropdown
3. Position face in camera view
4. Wait for face detection (green box around face)
5. System validates against room assignment
6. Listen for audio feedback (success/error tones)
7. Check validation result display

#### 3. **Quick Index Lookup**
Navigate to: `http://localhost:8080/index-lookup`

**Test Scenario**: Validate student index manually
1. Select room "CSM-001"
2. Enter student index: `20210025`
3. Click "Validate Index"
4. View validation result with student details
5. Try invalid index to see error handling

#### 4. **Live Room Status Board**
Navigate to: `http://localhost:8080/room-status`

**Test Scenario**: Monitor room utilization
1. View all active room assignments
2. Check utilization percentages
3. Monitor recent validation activity
4. Observe auto-refresh functionality (every 30s)
5. Test responsive design on mobile

### API Testing

#### Test API Endpoints
Navigate to: `http://localhost:8080/api-test`

**Available Test Scenarios**:
1. **Room Preview**: Test capacity calculation
2. **Room Creation**: Create new assignments
3. **Face Recognition**: Upload image for validation
4. **Quick Validation**: Test index number lookup
5. **Status Monitoring**: Check room utilization

### Mobile Testing

#### Responsive Design Verification
1. **Desktop** (1920x1080): Full feature set
2. **Tablet** (768x1024): Responsive layouts
3. **Mobile** (375x667): Touch-optimized interface

### Error Scenarios

#### Test Error Handling
1. **Network Errors**: Disconnect internet, observe graceful degradation
2. **Invalid Data**: Enter invalid room codes, see validation messages
3. **Camera Issues**: Block camera access, verify fallback behavior
4. **Authentication**: Test protected routes without login

### Performance Testing

#### Load Testing
1. **Face Detection**: Test with multiple faces in frame
2. **Real-time Updates**: Monitor status board refresh performance
3. **Form Validation**: Test with large datasets
4. **Image Processing**: Test face recognition speed

### Accessibility Testing

#### WCAG Compliance
1. **Keyboard Navigation**: Tab through all interactive elements
2. **Screen Reader**: Test with screen reader software
3. **Color Contrast**: Verify text readability in both themes
4. **Focus Indicators**: Check visible focus states

## 🎯 Key Features to Demonstrate

### 1. **Real-time Face Recognition**
- Live camera feed with face detection
- Audio feedback system
- Visual validation results
- Room-specific validation logic

### 2. **Admin Room Management**
- CRUD operations for room assignments
- Capacity preview before creation
- Utilization tracking and analytics
- Responsive data tables

### 3. **Quick Validation Tools**
- Manual index number lookup
- Instant validation feedback
- Student information display
- Batch validation capability

### 4. **Live Monitoring Dashboard**
- Real-time room status updates
- Utilization percentages
- Recent activity tracking
- Auto-refresh functionality

## 🔧 Configuration Options

### Environment Variables
```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:8000
VITE_API_TIMEOUT=10000

# Feature Flags
VITE_ENABLE_FACE_RECOGNITION=true
VITE_ENABLE_AUDIO_FEEDBACK=true
VITE_AUTO_REFRESH_INTERVAL=30000
```

### Theme Customization
- Light/Dark mode toggle
- System theme detection
- Persistent theme selection
- Accessible color schemes

## 📱 Browser Compatibility

### Supported Browsers
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Camera Requirements
- WebRTC support
- Camera permissions
- HTTPS for production (camera access)

## 🚀 Production Deployment

### Build for Production
```bash
# Create production build
npm run build

# Serve static files
npm run preview
```

### Deployment Checklist
- [ ] Environment variables configured
- [ ] API endpoints accessible
- [ ] HTTPS certificate installed
- [ ] Camera permissions working
- [ ] Error monitoring setup
- [ ] Performance monitoring active

## 🎉 Success Criteria

### Functional Testing
- [ ] All routes load without errors
- [ ] CRUD operations work correctly
- [ ] Face recognition validates properly
- [ ] Audio feedback functions
- [ ] Real-time updates display
- [ ] Responsive design works

### Performance Testing
- [ ] Page load times < 3 seconds
- [ ] Face detection response < 1 second
- [ ] API calls complete < 2 seconds
- [ ] No memory leaks detected
- [ ] Smooth animations and transitions

### User Experience
- [ ] Intuitive navigation
- [ ] Clear error messages
- [ ] Consistent design language
- [ ] Accessible to all users
- [ ] Mobile-friendly interface

---

**Demo Status**: ✅ Ready for demonstration  
**Last Updated**: August 5, 2025  
**Version**: 1.0.0  
**Server**: http://localhost:8080
