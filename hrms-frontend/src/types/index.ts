// ===========================
// Core Domain Types
// ===========================

export type UserRole = 'admin' | 'hr' | 'employee'

export type AttendanceStatus = 'present' | 'absent' | 'half_day' | 'leave' | 'holiday' | 'late'

export type LeaveStatus = 'pending' | 'approved' | 'rejected'

export type LeaveTypeName = 'paid_leave' | 'sick_leave' | 'unpaid_leave' | 'casual_leave' | 'annual_leave' | 'maternity_leave'

export type EmploymentType = 'full_time' | 'part_time' | 'contract' | 'internship'

export type EmploymentStatus = 'active' | 'inactive' | 'terminated' | 'on_leave'

// ===========================
// Company
// ===========================
export interface Company {
  id: string
  name: string
  logo_url: string | null
  subdomain: string
  address: string | null
  phone: string | null
  email: string | null
  website: string | null
  industry: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

// ===========================
// Auth
// ===========================
export interface AuthUser {
  id: string
  login_id: string
  email: string
  role: UserRole
  company_id: string
  is_active: boolean
  force_password_change: boolean
}

export interface AuthTokens {
  access_token: string
  refresh_token: string
  token_type: string
}

export interface LoginRequest {
  login_id: string
  password: string
  remember_me?: boolean
}

export interface LoginResponse {
  user: AuthUser
  tokens: AuthTokens
  company: Company
}

export interface RegisterCompanyRequest {
  company_name: string
  subdomain: string
  admin_first_name: string
  admin_last_name: string
  email: string
  phone: string
  password: string
  confirm_password: string
}

export interface ChangePasswordRequest {
  current_password: string
  new_password: string
  confirm_password: string
}

// ===========================
// Department
// ===========================
export interface Department {
  id: string
  name: string
  head_id: string | null
  company_id: string
  employee_count?: number
}

// ===========================
// Employee
// ===========================
export interface Employee {
  id: string
  user_id: string
  employee_id: string
  login_id: string
  first_name: string
  last_name: string
  full_name: string
  email: string
  phone: string | null
  dob: string | null
  gender: 'male' | 'female' | 'other' | null
  blood_group?: string
  marital_status?: string
  nationality?: string
  address: string | null
  emergency_contact: string | null
  department_id: string | null
  department_name: string | null
  designation: string | null
  manager_id: string | null
  manager_name: string | null
  joining_date: string
  employment_type: EmploymentType
  employment_status: EmploymentStatus
  work_location: string | null
  profile_picture_url: string | null
  company_id: string
  role: UserRole
  created_at: string
}

export interface CreateEmployeeRequest {
  first_name: string
  last_name: string
  email: string
  phone?: string
  dob?: string
  gender?: 'male' | 'female' | 'other'
  address?: string
  emergency_contact?: string
  department_id?: string
  designation?: string
  manager_id?: string
  joining_date: string
  employment_type: EmploymentType
  work_location?: string
  role: UserRole
}

export interface UpdateEmployeeRequest extends Partial<CreateEmployeeRequest> {}

export interface EmployeeCredentials {
  employee_id: string
  login_id: string
  temporary_password: string
  email: string
}

// ===========================
// Attendance
// ===========================
export interface AttendanceRecord {
  id: string
  employee_id: string
  employee_name: string
  employee_avatar: string | null
  date: string
  check_in: string | null
  check_out: string | null
  work_hours: number
  extra_hours: number
  status: AttendanceStatus
  work_place: string | null
  company_id: string
}

export interface AttendanceSummary {
  total_present: number
  total_absent: number
  total_leave: number
  total_half_day: number
  total_worked_hours: number
  total_paid_absence_hours: number
  total_missed_hours: number
  total_unpaid_absence_hours: number
  month: number
  year: number
}

export interface CheckInResponse {
  id: string
  check_in: string
  message: string
}

export interface CheckOutResponse {
  id: string
  check_out: string
  work_hours: number
  message: string
}

// ===========================
// Leave
// ===========================
export interface LeaveType {
  id: string
  name: LeaveTypeName
  label: string
  paid: boolean
  days_allowed: number
  company_id: string
}

export interface LeaveBalance {
  leave_type_id: string
  leave_type_name: string
  leave_type_label: string
  days_allowed: number
  days_taken: number
  days_remaining: number
}

export interface LeaveRequest {
  id: string
  employee_id: string
  employee_name: string
  employee_avatar: string | null
  employee_department: string | null
  leave_type_id: string
  leave_type_label: string
  start_date: string
  end_date: string
  days: number
  reason: string
  status: LeaveStatus
  reviewer_id: string | null
  reviewer_name: string | null
  reviewer_comment: string | null
  attachment_url: string | null
  created_at: string
  company_id: string
}

export interface CreateLeaveRequest {
  leave_type_id: string
  start_date: string
  end_date: string
  reason: string
  attachment?: File
}

// ===========================
// Payroll / Salary
// ===========================
export interface SalaryStructure {
  id: string
  employee_id: string
  monthly_wage: number
  basic_percent: number
  hra_percent: number
  standard_allowance: number
  performance_bonus_percent: number
  lta: number
  fixed_allowance: number
  pf_percent: number
  professional_tax: number
  additional_deductions: number
  company_id: string
  // Calculated fields from backend
  basic: number
  hra: number
  performance_bonus: number
  gross_salary: number
  pf_deduction: number
  net_salary: number
  yearly_salary: number
}

export interface Payslip {
  id: string
  employee_id: string
  employee_name: string
  employee_id_code: string
  department_name: string | null
  designation: string | null
  month: number
  year: number
  payable_days: number
  working_days: number
  basic: number
  hra: number
  performance_bonus: number
  lta: number
  fixed_allowance: number
  standard_allowance: number
  gross_salary: number
  pf_deduction: number
  professional_tax: number
  additional_deductions: number
  net_salary: number
  generated_at: string
  company_id: string
}

// ===========================
// Dashboard
// ===========================
export interface DashboardStats {
  total_employees: number
  present_today: number
  absent_today: number
  on_leave_today: number
  pending_leaves: number
  this_month_payroll: number
  attendance_percentage: number
  new_employees_this_month: number
}

export interface EmployeeDashboardData {
  employee: Employee
  today_attendance: AttendanceRecord | null
  leave_balance: LeaveBalance[]
  recent_activities: Activity[]
  notifications: Notification[]
}

export interface Activity {
  id: string
  type: 'attendance' | 'leave' | 'payroll' | 'system'
  message: string
  status?: string
  created_at: string
}

// ===========================
// Notifications
// ===========================
export interface Notification {
  id: string
  user_id: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  is_read: boolean
  created_at: string
  company_id: string
}

// ===========================
// Documents
// ===========================
export interface Document {
  id: string
  employee_id: string
  name: string
  type: string
  file_url: string
  uploaded_at: string
  company_id: string
}

// ===========================
// API Response Wrappers
// ===========================
export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  per_page: number
  total_pages: number
}

export interface ApiError {
  message: string
  detail?: string
  status_code?: number
}
