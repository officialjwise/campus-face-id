// API Response Types
   export interface AuthResponse {
     access_token: string;
     refresh_token: string;
   }

   export interface OTPResponse {
     message: string;
     otp_expires_in: number;
   }

   export interface ApiError {
     error: string;
     details?: string;
   }

   // User/Admin Types
   export interface Admin {
     id: string;
     name: string;
     email: string;
     created_at: string;
   }

   export interface RegisterRequest {
     name: string;
     email: string;
     password: string;
   }

   export interface LoginRequest {
     email: string;
     password: string;
   }

   export interface OTPRequest {
     email: string;
     otp: string;
   }

   export interface EmailRequest {
     email: string;
   }

   // College Types
   export interface College {
     id: string;
     name: string;
     location: string;
     description?: string;
     created_at?: string;
     departments_count?: number;
     departments?: Department[];
   }

   export interface CreateCollegeRequest {
     name: string;
     location: string;
     description?: string;
   }

   export interface UpdateCollegeRequest {
     name?: string;
     location?: string;
     description?: string;
   }

   // Department Types
   export interface Department {
     id: string;
     name: string;
     college_id: string;
     description?: string;
     department_head?: string;
     created_at?: string;
     students_count?: number;
   }

   export interface CreateDepartmentRequest {
     name: string;
     college_id: string;
     description?: string;
     department_head?: string;
   }

   export interface UpdateDepartmentRequest {
     name?: string;
     description?: string;
     department_head?: string;
   }

   // Student Types
   export interface Student {
     id: string;
     first_name: string;
     last_name: string;
     email: string;
     college_id: string;
     department_id: string;
     student_id?: string;
     phone?: string;
     date_of_birth?: string;
     address?: string;
     created_at?: string;
     college?: College;
     department?: Department;
   }

   export interface CreateStudentRequest {
     first_name: string;
     last_name: string;
     email: string;
     college_id: string;
     department_id: string;
     student_id: string;
     index_number: string; // Required, 7 digits
     middle_name?: string;
     phone?: string;
     date_of_birth?: string;
     address?: string;
     photo: File | Blob; // Blob or File from FaceDetectionCamera
   }

   export interface UpdateStudentRequest {
     first_name?: string;
     last_name?: string;
     email?: string;
     college_id?: string;
     department_id?: string;
     student_id?: string;
     phone?: string;
     date_of_birth?: string;
     address?: string;
   }

   // Face Recognition Types
   export interface FaceRecognitionResponse {
     matched: boolean;
     student_id?: string;
     confidence?: number;
     student?: Student;
   }

   export interface RecognitionEvent {
     id: string;
     student_id?: string;
     confidence: number;
     timestamp: string;
     student?: Student;
   }

   // Admin Dashboard Types
   export interface AdminStats {
     total_students: number;
     total_colleges: number;
     total_departments: number;
     recognition_events_today: number;
     admins: number;
   }

   // Dashboard Chart Data Types
   export interface RegistrationTrendData {
     month: string;
     registrations: number;
   }

   export interface CollegeDistributionData {
     name: string;
     value: number;
     students_count: number;
     color?: string;
   }

   export interface DepartmentEnrollmentData {
     department: string;
     students: number;
     college_name?: string;
   }

   export interface PerformanceMetric {
     metric: string;
     current: number;
     target: number;
   }

   export interface DashboardChartData {
     registration_trends: RegistrationTrendData[];
     college_distribution: CollegeDistributionData[];
     department_enrollment: DepartmentEnrollmentData[];
     performance_metrics: PerformanceMetric[];
   }

   // System Health Metrics Types
   export interface SystemHealthMetrics {
     api_response_time: number;
     database_connections: number;
     memory_usage: number;
     cpu_usage: number;
     active_users: number;
     error_rate: number;
     uptime: number;
     last_updated: string;
   }

   // Pagination Types
   export interface PaginationParams {
     page?: number;
     limit?: number;
     search?: string;
   }

   export interface PaginatedResponse<T> {
     items: T[];
     total: number;
     page: number;
     limit: number;
     total_pages: number;
   }

   // Health Check
   export interface HealthCheck {
     status: string;
     timestamp: string;
   }

   // Room Assignment Types
   export interface RoomAssignment {
     id: string;
     room_code: string;
     room_name: string;
     index_start: number;
     index_end: number;
     capacity: number;
     description?: string;
     assigned_students_count?: number;
     created_at: string;
     updated_at: string;
   }

   export interface CreateRoomAssignmentRequest {
     room_code: string;
     room_name: string;
     index_start: string | number;
     index_end: string | number;
     capacity: number;
     description?: string;
   }

   export interface UpdateRoomAssignmentRequest {
     room_code?: string;
     room_name?: string;
     index_start?: string | number;
     index_end?: string | number;
     capacity?: number;
     description?: string;
   }

   // Room Preview Types
   export interface RoomPreviewRequest {
     index_start: string | number;
     index_end: string | number;
   }

   export interface RoomPreviewResponse {
     index_start: string;
     index_end: string;
     total_students: number;
     students_preview: StudentPreview[];
     has_more: boolean;
   }

   export interface StudentPreview {
     name: string;
     index_number: string;
     email: string;
     college: string;
   }

   // Room Validation Types
   export interface RoomRecognitionRequest {
     room_code: string;
     face_image: string; // base64 encoded image
   }

   export interface RoomValidationResponse {
     status: 'valid' | 'invalid' | 'not_found';
     message: string;
     beep_type: 'confirmation' | 'warning' | 'error';
     student_name?: string;
     index_number?: string;
     room_code?: string;
     room_name?: string;
     student?: Student;
     room_assignment?: RoomAssignment;
     confidence?: number;
     timestamp: string;
   }

   // Quick Validation Types
   export interface QuickValidationResponse {
     valid: boolean;
     message: string;
     student?: Student;
     room_assignment?: RoomAssignment;
     index_number: string;
     room_code: string;
   }

   // Room Status Types
   export interface RoomStatus {
     room_code: string;
     room_name: string;
     index_start: number;
     index_end: number;
     capacity: number;
     assigned_students_count: number;
     current_occupancy?: number;
     status: 'active' | 'inactive' | 'full';
     validation_count?: number;
     rejection_count?: number;
     last_activity?: string;
     utilization_percentage?: number;
   }

   // Room Details with Students
   export interface RoomDetails extends RoomAssignment {
     students: Student[];
     total_students: number;
     utilization_percentage: number;
   }

   // Recognition Log Types
   export interface RecognitionLog {
     id: string;
     student_id?: string;
     room_code: string;
     validation_status: 'valid' | 'invalid' | 'not_found';
     confidence?: number;
     timestamp: string;
     student?: Student;
     room_assignment?: RoomAssignment;
     index_number?: string;
     message?: string;
     beep_type?: 'confirmation' | 'warning' | 'error';
   }

   // Audio feedback type
   export interface AudioFeedback {
     success: HTMLAudioElement;
     warning: HTMLAudioElement;
     playSuccess: () => void;
     playWarning: () => void;
   }