import type {
  AuthUser, Company, Employee, AttendanceRecord, AttendanceSummary,
  LeaveRequest, LeaveBalance, LeaveType, SalaryStructure, Payslip,
  DashboardStats, EmployeeDashboardData, Activity, Notification,
  Department, Document, LoginResponse, AuthTokens, EmployeeCredentials,
  CheckInResponse, CheckOutResponse
} from '@/types'
import { sleep } from '@/utils'

// ===========================
// Mock Company
// ===========================
const MOCK_COMPANY: Company = {
  id: 'comp-001',
  name: 'Odoo Industries',
  logo_url: null,
  subdomain: 'odoo-industries',
  address: '123, MG Road, Bangalore, Karnataka - 560001',
  phone: '+91 80 4567 8900',
  email: 'admin@odooindustries.com',
  website: 'https://odooindustries.com',
  industry: 'Technology',
  is_active: true,
  created_at: '2022-01-15T10:00:00Z',
  updated_at: '2024-06-01T10:00:00Z',
}

// ===========================
// Mock Users / Employees
// ===========================
const MOCK_EMPLOYEES: Employee[] = [
  {
    id: 'emp-001', user_id: 'user-001', employee_id: 'OIJODO20220001', login_id: 'OIJODO20220001',
    first_name: 'John', last_name: 'Doe', full_name: 'John Doe', email: 'john.doe@odooindustries.com',
    phone: '+91 98765 43210', dob: '1995-01-15', gender: 'male',
    blood_group: 'O+', marital_status: 'Single', nationality: 'Indian',
    address: '123, MG Road, Bangalore, Karnataka - 560001', emergency_contact: 'Jane Doe (98765 43211)',
    department_id: 'dept-001', department_name: 'Development', designation: 'Software Engineer',
    manager_id: 'emp-002', manager_name: 'Jane Smith', joining_date: '2022-01-15',
    employment_type: 'full_time', employment_status: 'active', work_location: 'Bangalore, India',
    profile_picture_url: null, company_id: 'comp-001', role: 'employee', created_at: '2022-01-15T10:00:00Z',
  },
  {
    id: 'emp-002', user_id: 'user-002', employee_id: 'OIJASM20210001', login_id: 'OIJASM20210001',
    first_name: 'Jane', last_name: 'Smith', full_name: 'Jane Smith', email: 'jane.smith@odooindustries.com',
    phone: '+91 98765 43220', dob: '1990-05-20', gender: 'female',
    blood_group: 'B+', marital_status: 'Married', nationality: 'Indian',
    address: '456, Brigade Road, Bangalore', emergency_contact: 'Mike Smith (98765 43221)',
    department_id: 'dept-002', department_name: 'HR', designation: 'HR Manager',
    manager_id: null, manager_name: null, joining_date: '2021-06-01',
    employment_type: 'full_time', employment_status: 'active', work_location: 'Bangalore, India',
    profile_picture_url: null, company_id: 'comp-001', role: 'hr', created_at: '2021-06-01T10:00:00Z',
  },
  {
    id: 'emp-003', user_id: 'user-003', employee_id: 'OIROBR20220002', login_id: 'OIROBR20220002',
    first_name: 'Robert', last_name: 'Brown', full_name: 'Robert Brown', email: 'robert.brown@odooindustries.com',
    phone: '+91 98765 43230', dob: '1988-11-10', gender: 'male',
    address: '789, Koramangala, Bangalore', emergency_contact: 'Lisa Brown (98765 43231)',
    department_id: 'dept-003', department_name: 'Sales', designation: 'Sales Executive',
    manager_id: 'emp-002', manager_name: 'Jane Smith', joining_date: '2022-03-01',
    employment_type: 'full_time', employment_status: 'active', work_location: 'Bangalore, India',
    profile_picture_url: null, company_id: 'comp-001', role: 'employee', created_at: '2022-03-01T10:00:00Z',
  },
  {
    id: 'emp-004', user_id: 'user-004', employee_id: 'OIEMDA20230001', login_id: 'OIEMDA20230001',
    first_name: 'Emily', last_name: 'Davis', full_name: 'Emily Davis', email: 'emily.davis@odooindustries.com',
    phone: '+91 98765 43240', dob: '1992-07-25', gender: 'female',
    address: '101, Indiranagar, Bangalore', emergency_contact: 'Tom Davis (98765 43241)',
    department_id: 'dept-004', department_name: 'Finance', designation: 'Accountant',
    manager_id: 'emp-002', manager_name: 'Jane Smith', joining_date: '2023-01-10',
    employment_type: 'full_time', employment_status: 'active', work_location: 'Bangalore, India',
    profile_picture_url: null, company_id: 'comp-001', role: 'employee', created_at: '2023-01-10T10:00:00Z',
  },
  {
    id: 'emp-005', user_id: 'user-005', employee_id: 'OIMILE20220003', login_id: 'OIMILE20220003',
    first_name: 'Michael', last_name: 'Lee', full_name: 'Michael Lee', email: 'michael.lee@odooindustries.com',
    phone: '+91 98765 43250', dob: '1993-09-12', gender: 'male',
    address: '202, HSR Layout, Bangalore', emergency_contact: 'Sarah Lee (98765 43251)',
    department_id: 'dept-001', department_name: 'Development', designation: 'UI/UX Designer',
    manager_id: 'emp-001', manager_name: 'John Doe', joining_date: '2022-05-20',
    employment_type: 'full_time', employment_status: 'active', work_location: 'Bangalore, India',
    profile_picture_url: null, company_id: 'comp-001', role: 'employee', created_at: '2022-05-20T10:00:00Z',
  },
  {
    id: 'emp-006', user_id: 'user-006', employee_id: 'OIADMI20200001', login_id: 'admin@odoo',
    first_name: 'HR', last_name: 'Admin', full_name: 'HR Admin', email: 'hradmin@odooindustries.com',
    phone: '+91 98765 00000', dob: '1985-03-01', gender: 'male',
    address: 'Bangalore, India', emergency_contact: 'N/A',
    department_id: 'dept-002', department_name: 'HR', designation: 'Administrator',
    manager_id: null, manager_name: null, joining_date: '2020-01-01',
    employment_type: 'full_time', employment_status: 'active', work_location: 'Bangalore, India',
    profile_picture_url: null, company_id: 'comp-001', role: 'admin', created_at: '2020-01-01T10:00:00Z',
  },
]

// ===========================
// Mock Departments
// ===========================
const MOCK_DEPARTMENTS: Department[] = [
  { id: 'dept-001', name: 'Development', head_id: 'emp-001', company_id: 'comp-001', employee_count: 12 },
  { id: 'dept-002', name: 'HR', head_id: 'emp-002', company_id: 'comp-001', employee_count: 5 },
  { id: 'dept-003', name: 'Sales', head_id: 'emp-003', company_id: 'comp-001', employee_count: 8 },
  { id: 'dept-004', name: 'Finance', head_id: 'emp-004', company_id: 'comp-001', employee_count: 4 },
  { id: 'dept-005', name: 'Marketing', head_id: null, company_id: 'comp-001', employee_count: 6 },
  { id: 'dept-006', name: 'Management', head_id: null, company_id: 'comp-001', employee_count: 3 },
]

// ===========================
// Mock Attendance
// ===========================
const today = new Date()
const MOCK_ATTENDANCE: AttendanceRecord[] = [
  { id: 'att-001', employee_id: 'emp-001', employee_name: 'John Doe', employee_avatar: null, date: today.toISOString().split('T')[0], check_in: '2025-05-20T09:02:00Z', check_out: '2025-05-20T18:11:00Z', work_hours: 549, extra_hours: 9, status: 'present', work_place: 'Office', company_id: 'comp-001' },
  { id: 'att-002', employee_id: 'emp-002', employee_name: 'Jane Smith', employee_avatar: null, date: today.toISOString().split('T')[0], check_in: '2025-05-20T08:55:00Z', check_out: '2025-05-20T17:45:00Z', work_hours: 530, extra_hours: 0, status: 'present', work_place: 'Office', company_id: 'comp-001' },
  { id: 'att-003', employee_id: 'emp-003', employee_name: 'Robert Brown', employee_avatar: null, date: today.toISOString().split('T')[0], check_in: null, check_out: null, work_hours: 0, extra_hours: 0, status: 'absent', work_place: null, company_id: 'comp-001' },
  { id: 'att-004', employee_id: 'emp-004', employee_name: 'Emily Davis', employee_avatar: null, date: today.toISOString().split('T')[0], check_in: null, check_out: null, work_hours: 0, extra_hours: 0, status: 'leave', work_place: null, company_id: 'comp-001' },
  { id: 'att-005', employee_id: 'emp-005', employee_name: 'Michael Lee', employee_avatar: null, date: today.toISOString().split('T')[0], check_in: '2025-05-20T09:10:00Z', check_out: '2025-05-20T18:20:00Z', work_hours: 550, extra_hours: 10, status: 'present', work_place: 'Office', company_id: 'comp-001' },
]

// ===========================
// Mock Leave Types
// ===========================
const MOCK_LEAVE_TYPES: LeaveType[] = [
  { id: 'lt-001', name: 'annual_leave', label: 'Annual Leave', paid: true, days_allowed: 12, company_id: 'comp-001' },
  { id: 'lt-002', name: 'casual_leave', label: 'Casual Leave', paid: true, days_allowed: 12, company_id: 'comp-001' },
  { id: 'lt-003', name: 'sick_leave', label: 'Medical Leave', paid: true, days_allowed: 12, company_id: 'comp-001' },
  { id: 'lt-004', name: 'unpaid_leave', label: 'Study Leave', paid: false, days_allowed: 0, company_id: 'comp-001' },
  { id: 'lt-005', name: 'maternity_leave', label: 'Maternity Leave', paid: true, days_allowed: 180, company_id: 'comp-001' },
]

// ===========================
// Mock Leave Balances
// ===========================
const MOCK_LEAVE_BALANCE: LeaveBalance[] = [
  { leave_type_id: 'lt-001', leave_type_name: 'annual_leave', leave_type_label: 'Annual leaves', days_allowed: 12, days_taken: 2, days_remaining: 10 },
  { leave_type_id: 'lt-002', leave_type_name: 'casual_leave', leave_type_label: 'Casual leaves', days_allowed: 12, days_taken: 2, days_remaining: 10 },
  { leave_type_id: 'lt-003', leave_type_name: 'sick_leave', leave_type_label: 'Medical leaves', days_allowed: 12, days_taken: 2, days_remaining: 10 },
  { leave_type_id: 'lt-004', leave_type_name: 'unpaid_leave', leave_type_label: 'Study leaves', days_allowed: 0, days_taken: 0, days_remaining: 0 },
]

// ===========================
// Mock Leave Requests
// ===========================
const MOCK_LEAVE_REQUESTS: LeaveRequest[] = [
  { id: 'lr-001', employee_id: 'emp-001', employee_name: 'Jhone Doe', employee_avatar: null, employee_department: 'Development', leave_type_id: 'lt-003', leave_type_label: 'Medical Leave', start_date: '2025-08-13', end_date: '2025-08-14', days: 2, reason: 'Personal work', status: 'pending', reviewer_id: null, reviewer_name: null, reviewer_comment: null, attachment_url: null, created_at: '2025-08-10T10:00:00Z', company_id: 'comp-001' },
  { id: 'lr-002', employee_id: 'emp-002', employee_name: 'Jane Smith', employee_avatar: null, employee_department: 'HR', leave_type_id: 'lt-001', leave_type_label: 'Annual Leave', start_date: '2025-08-20', end_date: '2025-08-21', days: 2, reason: 'Family event', status: 'pending', reviewer_id: null, reviewer_name: null, reviewer_comment: null, attachment_url: null, created_at: '2025-08-15T10:00:00Z', company_id: 'comp-001' },
  { id: 'lr-003', employee_id: 'emp-003', employee_name: 'Robert Brown', employee_avatar: null, employee_department: 'Sales', leave_type_id: 'lt-002', leave_type_label: 'Casual Leave', start_date: '2025-10-10', end_date: '2025-10-10', days: 1, reason: '---', status: 'approved', reviewer_id: 'emp-002', reviewer_name: 'Jane Smith', reviewer_comment: 'Approved', attachment_url: null, created_at: '2025-10-05T10:00:00Z', company_id: 'comp-001' },
  { id: 'lr-004', employee_id: 'emp-004', employee_name: 'Emily Davis', employee_avatar: null, employee_department: 'Finance', leave_type_id: 'lt-004', leave_type_label: 'Study Leave', start_date: '2025-12-13', end_date: '2025-12-17', days: 5, reason: 'Vacation', status: 'approved', reviewer_id: 'emp-002', reviewer_name: 'Jane Smith', reviewer_comment: null, attachment_url: null, created_at: '2025-12-01T10:00:00Z', company_id: 'comp-001' },
  { id: 'lr-005', employee_id: 'emp-005', employee_name: 'Michael Lee', employee_avatar: null, employee_department: 'Development', leave_type_id: 'lt-003', leave_type_label: 'Short Leave', start_date: '2025-12-26', end_date: '2025-12-26', days: 1, reason: '---', status: 'rejected', reviewer_id: 'emp-002', reviewer_name: 'Jane Smith', reviewer_comment: 'Insufficient balance', attachment_url: null, created_at: '2025-12-20T10:00:00Z', company_id: 'comp-001' },
  { id: 'lr-006', employee_id: 'emp-001', employee_name: 'Jhone Doe', employee_avatar: null, employee_department: 'Development', leave_type_id: 'lt-002', leave_type_label: 'Casual Leave', start_date: '2025-08-13', end_date: '2025-08-14', days: 2, reason: 'Personal commitment', status: 'approved', reviewer_id: 'emp-002', reviewer_name: 'Jane Smith', reviewer_comment: null, attachment_url: null, created_at: '2025-08-01T10:00:00Z', company_id: 'comp-001' },
  { id: 'lr-007', employee_id: 'emp-001', employee_name: 'Jhone Doe', employee_avatar: null, employee_department: 'Development', leave_type_id: 'lt-003', leave_type_label: 'Medical Leave', start_date: '2025-08-20', end_date: '2025-08-21', days: 2, reason: 'Fever', status: 'approved', reviewer_id: 'emp-002', reviewer_name: 'Jane Smith', reviewer_comment: null, attachment_url: null, created_at: '2025-08-18T10:00:00Z', company_id: 'comp-001' },
  { id: 'lr-008', employee_id: 'emp-001', employee_name: 'Jhone Doe', employee_avatar: null, employee_department: 'Development', leave_type_id: 'lt-002', leave_type_label: 'Casual Leave', start_date: '2025-10-10', end_date: '2025-10-10', days: 1, reason: '---', status: 'approved', reviewer_id: 'emp-002', reviewer_name: 'Jane Smith', reviewer_comment: null, attachment_url: null, created_at: '2025-10-07T10:00:00Z', company_id: 'comp-001' },
  { id: 'lr-009', employee_id: 'emp-001', employee_name: 'Jhone Doe', employee_avatar: null, employee_department: 'Development', leave_type_id: 'lt-004', leave_type_label: 'Study Leave', start_date: '2025-12-13', end_date: '2025-12-17', days: 5, reason: 'Vacation', status: 'approved', reviewer_id: 'emp-002', reviewer_name: 'Jane Smith', reviewer_comment: null, attachment_url: null, created_at: '2025-12-01T10:00:00Z', company_id: 'comp-001' },
  { id: 'lr-010', employee_id: 'emp-001', employee_name: 'Jhone Doe', employee_avatar: null, employee_department: 'Development', leave_type_id: 'lt-003', leave_type_label: 'Short Leave', start_date: '2025-12-24', end_date: '2025-12-24', days: 1, reason: '---', status: 'approved', reviewer_id: 'emp-002', reviewer_name: 'Jane Smith', reviewer_comment: null, attachment_url: null, created_at: '2025-12-20T10:00:00Z', company_id: 'comp-001' },
]

// ===========================
// Mock Salary
// ===========================
const MOCK_SALARY: SalaryStructure = {
  id: 'sal-001', employee_id: 'emp-001', monthly_wage: 50000,
  basic_percent: 50, hra_percent: 25, standard_allowance: 3000,
  performance_bonus_percent: 10, lta: 2000, fixed_allowance: 1500,
  pf_percent: 12, professional_tax: 200, additional_deductions: 0,
  company_id: 'comp-001',
  basic: 25000, hra: 12500, performance_bonus: 5000,
  gross_salary: 49000, pf_deduction: 3000, net_salary: 45800,
  yearly_salary: 549600,
}

// ===========================
// Mock Activities
// ===========================
const MOCK_ACTIVITIES: Activity[] = [
  { id: 'act-001', type: 'leave', message: 'You applied for Casual Leave', status: 'Pending', created_at: '2025-05-20T10:00:00Z' },
  { id: 'act-002', type: 'leave', message: 'Your leave request was approved', status: 'Approved', created_at: '2025-05-19T14:00:00Z' },
  { id: 'act-003', type: 'attendance', message: 'Checked in at 09:02 AM', status: 'Present', created_at: '2025-05-20T09:02:00Z' },
  { id: 'act-004', type: 'payroll', message: 'Salary slip for April generated', status: 'View', created_at: '2025-05-19T10:00:00Z' },
]

// ===========================
// Mock Notifications
// ===========================
const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'notif-001', user_id: 'user-001', message: 'Team meeting at 3:00 PM today', type: 'info', is_read: false, created_at: '2025-05-20T10:00:00Z', company_id: 'comp-001' },
  { id: 'notif-002', user_id: 'user-001', message: 'Please update your profile information', type: 'warning', is_read: false, created_at: '2025-05-18T10:00:00Z', company_id: 'comp-001' },
  { id: 'notif-003', user_id: 'user-001', message: 'New company policy uploaded', type: 'info', is_read: true, created_at: '2025-05-15T10:00:00Z', company_id: 'comp-001' },
]

// ===========================
// Mock Payslips
// ===========================
const MOCK_PAYSLIPS: Payslip[] = [
  { id: 'ps-001', employee_id: 'emp-001', employee_name: 'John Doe', employee_id_code: 'OIJODO20220001', department_name: 'Development', designation: 'Software Engineer', month: 4, year: 2025, payable_days: 22, working_days: 22, basic: 25000, hra: 12500, performance_bonus: 5000, lta: 2000, fixed_allowance: 1500, standard_allowance: 3000, gross_salary: 49000, pf_deduction: 3000, professional_tax: 200, additional_deductions: 0, net_salary: 45800, generated_at: '2025-05-01T10:00:00Z', company_id: 'comp-001' },
  { id: 'ps-002', employee_id: 'emp-001', employee_name: 'John Doe', employee_id_code: 'OIJODO20220001', department_name: 'Development', designation: 'Software Engineer', month: 3, year: 2025, payable_days: 21, working_days: 22, basic: 25000, hra: 12500, performance_bonus: 5000, lta: 2000, fixed_allowance: 1500, standard_allowance: 3000, gross_salary: 49000, pf_deduction: 3000, professional_tax: 200, additional_deductions: 0, net_salary: 44100, generated_at: '2025-04-01T10:00:00Z', company_id: 'comp-001' },
]

// ===========================
// Mock Documents
// ===========================
const MOCK_DOCUMENTS: Document[] = [
  { id: 'doc-001', employee_id: 'emp-001', name: 'Resume', type: 'pdf', file_url: '/uploads/resume.pdf', uploaded_at: '2022-01-15T10:00:00Z', company_id: 'comp-001' },
  { id: 'doc-002', employee_id: 'emp-001', name: 'ID Proof', type: 'pdf', file_url: '/uploads/id.pdf', uploaded_at: '2022-01-15T10:00:00Z', company_id: 'comp-001' },
]

// ===========================
// AUTH SERVICE (Mock)
// ===========================
export const mockAuthService = {
  login: async (loginId: string, password: string): Promise<LoginResponse> => {
    await sleep(800)
    // Admin login
    if (loginId === 'admin@odoo' && password === 'admin123') {
      const user: AuthUser = { id: 'user-006', login_id: 'admin@odoo', email: 'hradmin@odooindustries.com', role: 'admin', company_id: 'comp-001', is_active: true, force_password_change: false }
      return { user, tokens: { access_token: 'mock-token-admin', refresh_token: 'mock-refresh-admin', token_type: 'bearer' }, company: MOCK_COMPANY }
    }
    // HR login
    if (loginId === 'hr@odoo' && password === 'hr123') {
      const user: AuthUser = { id: 'user-002', login_id: 'OIJASM20210001', email: 'jane.smith@odooindustries.com', role: 'hr', company_id: 'comp-001', is_active: true, force_password_change: false }
      return { user, tokens: { access_token: 'mock-token-hr', refresh_token: 'mock-refresh-hr', token_type: 'bearer' }, company: MOCK_COMPANY }
    }
    // Employee login
    if (loginId === 'employee@odoo' && password === 'emp123') {
      const user: AuthUser = { id: 'user-001', login_id: 'OIJODO20220001', email: 'john.doe@odooindustries.com', role: 'employee', company_id: 'comp-001', is_active: true, force_password_change: false }
      return { user, tokens: { access_token: 'mock-token-emp', refresh_token: 'mock-refresh-emp', token_type: 'bearer' }, company: MOCK_COMPANY }
    }
    throw new Error('The email or password you entered is incorrect. Please try again.')
  },

  registerCompany: async (_data: any): Promise<LoginResponse> => {
    await sleep(1000)
    const user: AuthUser = { id: 'user-new', login_id: 'admin@newco', email: _data.email, role: 'admin', company_id: 'comp-new', is_active: true, force_password_change: false }
    return { user, tokens: { access_token: 'mock-token-new', refresh_token: 'mock-refresh-new', token_type: 'bearer' }, company: { ...MOCK_COMPANY, id: 'comp-new', name: _data.company_name } }
  },

  changePassword: async (_data: any): Promise<{ message: string }> => {
    await sleep(500)
    return { message: 'Password changed successfully' }
  },

  logout: async (): Promise<void> => { await sleep(300) },
}

// ===========================
// EMPLOYEE SERVICE (Mock)
// ===========================
export const mockEmployeeService = {
  getAll: async (): Promise<Employee[]> => { await sleep(600); return MOCK_EMPLOYEES },

  getById: async (id: string): Promise<Employee> => {
    await sleep(400)
    const emp = MOCK_EMPLOYEES.find(e => e.id === id)
    if (!emp) throw new Error('Employee not found')
    return emp
  },

  getByUserId: async (userId: string): Promise<Employee> => {
    await sleep(400)
    const emp = MOCK_EMPLOYEES.find(e => e.user_id === userId)
    if (!emp) throw new Error('Employee not found for this user')
    return emp
  },

  create: async (data: any): Promise<EmployeeCredentials> => {
    await sleep(800)
    return { employee_id: 'OINEWEM20250001', login_id: 'OINEWEM20250001', temporary_password: 'Temp@12345', email: data.email }
  },

  update: async (id: string, data: any): Promise<Employee> => {
    await sleep(500)
    const emp = MOCK_EMPLOYEES.find(e => e.id === id)
    if (!emp) throw new Error('Employee not found')
    return { ...emp, ...data }
  },

  delete: async (_id: string): Promise<void> => { await sleep(500) },

  getDocuments: async (_employeeId: string): Promise<Document[]> => { await sleep(400); return MOCK_DOCUMENTS },
}

// ===========================
// ATTENDANCE SERVICE (Mock)
// ===========================
let mockCheckedIn = false
export const mockAttendanceService = {
  checkIn: async (): Promise<CheckInResponse> => {
    await sleep(500)
    mockCheckedIn = true
    return { id: 'att-new', check_in: new Date().toISOString(), message: 'Checked in successfully' }
  },

  checkOut: async (): Promise<CheckOutResponse> => {
    await sleep(500)
    mockCheckedIn = false
    return { id: 'att-new', check_out: new Date().toISOString(), work_hours: 480, message: 'Checked out successfully' }
  },

  isCheckedIn: () => mockCheckedIn,

  getMyAttendance: async (): Promise<AttendanceRecord[]> => { await sleep(500); return MOCK_ATTENDANCE.filter(a => a.employee_id === 'emp-001') },

  getAll: async (): Promise<AttendanceRecord[]> => { await sleep(500); return MOCK_ATTENDANCE },

  getSummary: async (): Promise<AttendanceSummary> => {
    await sleep(400)
    return { total_present: 96, total_absent: 20, total_leave: 8, total_half_day: 4, total_worked_hours: 8900, total_paid_absence_hours: 4600, total_missed_hours: 600, total_unpaid_absence_hours: 1000, month: new Date().getMonth() + 1, year: new Date().getFullYear() }
  },
}

// ===========================
// LEAVE SERVICE (Mock)
// ===========================
export const mockLeaveService = {
  getMyRequests: async (): Promise<LeaveRequest[]> => {
    await sleep(500)
    return MOCK_LEAVE_REQUESTS.filter(lr => lr.employee_id === 'emp-001')
  },

  getAllRequests: async (): Promise<LeaveRequest[]> => { await sleep(500); return MOCK_LEAVE_REQUESTS },

  getBalance: async (): Promise<LeaveBalance[]> => { await sleep(400); return MOCK_LEAVE_BALANCE },

  getTypes: async (): Promise<LeaveType[]> => { await sleep(300); return MOCK_LEAVE_TYPES },

  createRequest: async (_data: any): Promise<LeaveRequest> => {
    await sleep(700)
    return { ...MOCK_LEAVE_REQUESTS[0], id: 'lr-new', status: 'pending', created_at: new Date().toISOString() }
  },

  approve: async (id: string, comment?: string): Promise<LeaveRequest> => {
    await sleep(500)
    const lr = MOCK_LEAVE_REQUESTS.find(l => l.id === id)
    if (!lr) throw new Error('Leave request not found')
    return { ...lr, status: 'approved', reviewer_comment: comment || null }
  },

  reject: async (id: string, comment: string): Promise<LeaveRequest> => {
    await sleep(500)
    const lr = MOCK_LEAVE_REQUESTS.find(l => l.id === id)
    if (!lr) throw new Error('Leave request not found')
    return { ...lr, status: 'rejected', reviewer_comment: comment }
  },
}

// ===========================
// PAYROLL SERVICE (Mock)
// ===========================
export const mockPayrollService = {
  getMyPayslips: async (): Promise<Payslip[]> => { await sleep(500); return MOCK_PAYSLIPS },
  getAllPayroll: async (): Promise<Payslip[]> => { await sleep(500); return MOCK_PAYSLIPS },
  getSalaryStructure: async (_employeeId: string): Promise<SalaryStructure> => { await sleep(400); return MOCK_SALARY },
  updateSalary: async (_employeeId: string, _data: any): Promise<SalaryStructure> => { await sleep(600); return MOCK_SALARY },
}

// ===========================
// DASHBOARD SERVICE (Mock)
// ===========================
export const mockDashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    await sleep(500)
    return { total_employees: 128, present_today: 96, absent_today: 20, on_leave_today: 8, pending_leaves: 12, this_month_payroll: 1872000, attendance_percentage: 75, new_employees_this_month: 3 }
  },

  getEmployeeDashboard: async (): Promise<EmployeeDashboardData> => {
    await sleep(600)
    return { employee: MOCK_EMPLOYEES[0], today_attendance: MOCK_ATTENDANCE[0], leave_balance: MOCK_LEAVE_BALANCE, recent_activities: MOCK_ACTIVITIES, notifications: MOCK_NOTIFICATIONS }
  },

  getAttendanceOverview: async (): Promise<AttendanceRecord[]> => { await sleep(400); return MOCK_ATTENDANCE },
  getPendingLeaves: async (): Promise<LeaveRequest[]> => { await sleep(400); return MOCK_LEAVE_REQUESTS.filter(lr => lr.status === 'pending') },
}

// ===========================
// ADMIN SERVICE (Mock)
// ===========================
export const mockAdminService = {
  getCompany: async (): Promise<Company> => { await sleep(400); return MOCK_COMPANY },
  updateCompany: async (_data: any): Promise<Company> => { await sleep(600); return { ...MOCK_COMPANY, ..._data } },
  getDepartments: async (): Promise<Department[]> => { await sleep(400); return MOCK_DEPARTMENTS },
  createDepartment: async (data: any): Promise<Department> => { await sleep(500); return { id: 'dept-new', company_id: 'comp-001', ...data } },
  getNotifications: async (): Promise<Notification[]> => { await sleep(400); return MOCK_NOTIFICATIONS },
}

// ===========================
// Exported collections for reference
// ===========================
export const mockData = {
  company: MOCK_COMPANY,
  employees: MOCK_EMPLOYEES,
  departments: MOCK_DEPARTMENTS,
  attendance: MOCK_ATTENDANCE,
  leaveTypes: MOCK_LEAVE_TYPES,
  leaveRequests: MOCK_LEAVE_REQUESTS,
  leaveBalance: MOCK_LEAVE_BALANCE,
  salary: MOCK_SALARY,
  payslips: MOCK_PAYSLIPS,
  activities: MOCK_ACTIVITIES,
  notifications: MOCK_NOTIFICATIONS,
  documents: MOCK_DOCUMENTS,
}
