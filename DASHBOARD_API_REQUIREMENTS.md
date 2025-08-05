# Dashboard API Requirements for Campus Face ID Backend

## Overview
Based on the frontend dashboard implementation, the backend needs to provide several APIs to support the admin dashboard functionality. The dashboard displays comprehensive statistics, charts, and analytics for the campus face recognition system.

## Base Configuration
- **Base URL**: `http://localhost:8000`
- **Authentication**: Bearer token (JWT) via `Authorization` header
- **Content-Type**: `application/json` (unless specified otherwise)

## Core Dashboard APIs

### 1. Health Check API
**Endpoint**: `GET /`
**Access**: Public
**Purpose**: System health monitoring
```json
{
  "status": "healthy",
  "timestamp": "2025-08-03T10:30:00Z"
}
```

### 2. Admin Dashboard Stats API
**Endpoint**: `GET /admin/stats`
**Access**: Admin only (requires authentication)
**Purpose**: Basic dashboard statistics
```json
{
  "total_students": 1250,
  "total_colleges": 8,
  "total_departments": 45,
  "recognition_events_today": 234,
  "admins": 5
}
```

### 3. Admin Dashboard Charts API
**Endpoint**: `GET /admin/dashboard-charts`
**Access**: Admin only (requires authentication)
**Purpose**: Chart data for dashboard visualizations
```json
{
  "registration_trends": [
    {
      "month": "Feb",
      "registrations": 45
    },
    {
      "month": "Mar", 
      "registrations": 52
    }
  ],
  "college_distribution": [
    {
      "name": "Engineering College",
      "value": 35,
      "students_count": 437,
      "color": "hsl(var(--primary))"
    }
  ],
  "department_enrollment": [
    {
      "department": "Computer Science",
      "students": 156,
      "college_name": "Engineering College"
    }
  ],
  "performance_metrics": [
    {
      "metric": "Registration Rate",
      "current": 92,
      "target": 90
    }
  ]
}
```

## Authentication APIs

### 4. Admin Registration
**Endpoint**: `POST /auth/register`
**Access**: Public
**Content-Type**: `application/json`
```json
// Request
{
  "name": "John Doe",
  "email": "admin@university.edu",
  "password": "securePassword123"
}

// Response
{
  "message": "OTP sent to email",
  "otp_expires_in": 300
}
```

### 5. Verify Registration OTP
**Endpoint**: `POST /auth/verify-otp`
**Access**: Public
```json
// Request
{
  "email": "admin@university.edu",
  "otp": "123456"
}

// Response
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### 6. Request Login OTP
**Endpoint**: `POST /auth/login-otp`
**Access**: Public
```json
// Request
{
  "email": "admin@university.edu",
  "password": "securePassword123"
}

// Response
{
  "message": "OTP sent to email",
  "otp_expires_in": 300
}
```

### 7. Verify Login OTP
**Endpoint**: `POST /auth/verify-login-otp`
**Access**: Public
```json
// Request
{
  "email": "admin@university.edu",
  "otp": "123456"
}

// Response
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### 8. Legacy Direct Login
**Endpoint**: `POST /auth/login`
**Access**: Public
**Content-Type**: `application/x-www-form-urlencoded`
```
username=admin@university.edu&password=securePassword123
```

### 9. Refresh Token
**Endpoint**: `POST /auth/refresh`
**Access**: Public
```json
// Request
{
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}

// Response
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### 10. Logout
**Endpoint**: `POST /auth/logout`
**Access**: Authenticated
```json
// Response
{
  "message": "Successfully logged out"
}
```

## Student Management APIs

### 11. Register Student
**Endpoint**: `POST /students/`
**Access**: Public (for student self-registration)
```json
// Request
{
  "first_name": "Jane",
  "last_name": "Doe",
  "email": "jane.doe@student.edu",
  "college_id": "uuid-college-id",
  "department_id": "uuid-department-id",
  "student_id": "ST2025001",
  "phone": "+1234567890",
  "date_of_birth": "2000-01-15",
  "address": "123 Student St, Campus City"
}

// Response: Student object
```

### 12. Get All Students (Paginated)
**Endpoint**: `GET /students/?page=1&limit=20&search=jane&college_id=uuid&department_id=uuid`
**Access**: Admin only
```json
{
  "items": [/* Student objects */],
  "total": 1250,
  "page": 1,
  "limit": 20,
  "total_pages": 63
}
```

### 13. Get Student by ID
**Endpoint**: `GET /students/{student_id}`
**Access**: Admin only
```json
// Response: Student object with college and department details
```

### 14. Update Student
**Endpoint**: `PUT /students/{student_id}`
**Access**: Admin only
```json
// Request: Partial Student object
// Response
{
  "message": "Student updated successfully"
}
```

### 15. Delete Student
**Endpoint**: `DELETE /students/{student_id}`
**Access**: Admin only
```json
// Response: 204 No Content
```

### 16. Upload Student Photo
**Endpoint**: `POST /students/{student_id}/photo`
**Access**: Admin only
**Content-Type**: `multipart/form-data`
```
file: [image file]
```

### 17. Face Recognition
**Endpoint**: `POST /students/recognize`
**Access**: Public
**Content-Type**: `multipart/form-data`
```json
// Response
{
  "matched": true,
  "student_id": "uuid-student-id",
  "confidence": 0.95,
  "student": {/* Student object */}
}
```

### 18. Get Recognition Events
**Endpoint**: `GET /students/recognition-events?page=1&limit=20&student_id=uuid&date_from=2025-01-01&date_to=2025-12-31`
**Access**: Admin only
```json
{
  "items": [
    {
      "id": "uuid-event-id",
      "student_id": "uuid-student-id",
      "confidence": 0.95,
      "timestamp": "2025-08-03T10:30:00Z",
      "student": {/* Student object */}
    }
  ],
  "total": 500,
  "page": 1,
  "limit": 20,
  "total_pages": 25
}
```

## College Management APIs

### 19. Create College
**Endpoint**: `POST /colleges/`
**Access**: Admin only
```json
// Request
{
  "name": "Engineering College",
  "location": "North Campus",
  "description": "Premier engineering institution"
}

// Response: College object
```

### 20. Get All Colleges
**Endpoint**: `GET /colleges/?page=1&limit=100&search=engineering`
**Access**: Public
```json
{
  "data": [
    {
      "id": "uuid-college-id",
      "name": "Engineering College",
      "location": "North Campus",
      "description": "Premier engineering institution",
      "created_at": "2025-01-01T00:00:00Z",
      "departments_count": 12,
      "departments": [/* Department objects if included */]
    }
  ]
}
```

### 21. Get College by ID
**Endpoint**: `GET /colleges/{college_id}`
**Access**: Admin only
```json
// Response: College object with full details
```

### 22. Update College
**Endpoint**: `PUT /colleges/{college_id}`
**Access**: Admin only
```json
// Request: Partial College object
// Response
{
  "message": "College updated successfully"
}
```

### 23. Delete College
**Endpoint**: `DELETE /colleges/{college_id}`
**Access**: Admin only
```json
// Response: 204 No Content
```

## Department Management APIs

### 24. Create Department
**Endpoint**: `POST /departments/`
**Access**: Admin only
```json
// Request
{
  "name": "Computer Science",
  "college_id": "uuid-college-id",
  "description": "Computer Science and Engineering",
  "department_head": "Dr. John Smith"
}

// Response: Department object
```

### 25. Get All Departments
**Endpoint**: `GET /departments/?page=1&limit=100&search=computer&college_id=uuid`
**Access**: Public
```json
{
  "data": [
    {
      "id": "uuid-department-id",
      "name": "Computer Science",
      "college_id": "uuid-college-id",
      "description": "Computer Science and Engineering",
      "department_head": "Dr. John Smith",
      "created_at": "2025-01-01T00:00:00Z",
      "students_count": 156
    }
  ]
}
```

### 26. Get Departments by College
**Endpoint**: `GET /departments/college/{college_id}`
**Access**: Public
```json
// Response: Array of Department objects
[
  {/* Department objects for specific college */}
]
```

### 27. Get Department by ID
**Endpoint**: `GET /departments/{department_id}`
**Access**: Admin only
```json
// Response: Department object with full details
```

### 28. Update Department
**Endpoint**: `PUT /departments/{department_id}`
**Access**: Admin only
```json
// Request: Partial Department object
// Response
{
  "message": "Department updated successfully"
}
```

### 29. Delete Department
**Endpoint**: `DELETE /departments/{department_id}`
**Access**: Admin only
```json
// Response: 204 No Content
```

## Authentication Requirements

### JWT Token Structure
- **Access Token**: Short-lived (15-30 minutes)
- **Refresh Token**: Long-lived (7-30 days)
- **Claims**: Should include user ID, email, role (admin), expiration

### Authorization Levels
- **Public**: No authentication required
- **Authenticated**: Valid access token required
- **Admin Only**: Valid access token with admin role required

## Error Responses

All endpoints should return consistent error responses:

```json
{
  "error": "Error message",
  "details": "Additional error details (optional)"
}
```

### Common HTTP Status Codes
- `200 OK`: Successful GET/PUT operations
- `201 Created`: Successful POST operations
- `204 No Content`: Successful DELETE operations
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required or failed
- `403 Forbidden`: Access denied (insufficient permissions)
- `404 Not Found`: Resource not found
- `422 Unprocessable Entity`: Validation errors
- `500 Internal Server Error`: Server-side errors

## Data Models

### Student Object
```json
{
  "id": "uuid",
  "first_name": "string",
  "last_name": "string", 
  "email": "string",
  "college_id": "uuid",
  "department_id": "uuid",
  "student_id": "string (optional)",
  "phone": "string (optional)",
  "date_of_birth": "string (optional)",
  "address": "string (optional)",
  "created_at": "string (ISO datetime)",
  "college": {/* College object (optional) */},
  "department": {/* Department object (optional) */}
}
```

### College Object
```json
{
  "id": "uuid",
  "name": "string",
  "location": "string",
  "description": "string (optional)",
  "created_at": "string (ISO datetime)",
  "departments_count": "number (optional)",
  "departments": [/* Department objects (optional) */]
}
```

### Department Object
```json
{
  "id": "uuid",
  "name": "string",
  "college_id": "uuid",
  "description": "string (optional)",
  "department_head": "string (optional)",
  "created_at": "string (ISO datetime)",
  "students_count": "number (optional)"
}
```

## Dashboard-Specific Requirements

The dashboard heavily relies on:

1. **Real-time Statistics**: `/admin/stats` should provide accurate, up-to-date counts
2. **Chart Data**: `/admin/dashboard-charts` should compute:
   - Registration trends over the last 6 months
   - College distribution with percentages
   - Top departments by enrollment
   - Performance metrics with targets vs actual

3. **Fallback Mechanism**: If admin APIs fail, the frontend computes basic stats from other endpoints:
   - Uses `/students/`, `/colleges/`, `/departments/` for basic counts
   - Generates mock chart data based on real data

4. **Performance**: Dashboard data should be cached appropriately since it's accessed frequently

5. **Security**: Admin endpoints must validate JWT tokens and admin role before responding

This comprehensive API specification should enable the backend team to implement all necessary endpoints for the dashboard to function properly.
