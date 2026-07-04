export const APP_CONFIG = {
  APP_NAME: 'HRMS Enterprise',
  APP_VERSION: '1.0.0',
  API_BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  TOKEN_KEY: 'hrms_access_token',
  REFRESH_TOKEN_KEY: 'hrms_refresh_token',
  USER_KEY: 'hrms_user',
  COMPANY_KEY: 'hrms_company',
  THEME_KEY: 'hrms_theme',
} as const

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  FORCE_CHANGE_PASSWORD: '/change-password',
  DASHBOARD: '/dashboard',
  EMPLOYEES: '/employees',
  EMPLOYEE_DETAIL: '/employees/:id',
  EMPLOYEE_CREATE: '/employees/create',
  ATTENDANCE: '/attendance',
  LEAVE: '/leave',
  PAYROLL: '/payroll',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  NOTIFICATIONS: '/notifications',
  UNAUTHORIZED: '/unauthorized',
} as const

export const QUERY_KEYS = {
  AUTH_USER: ['auth', 'user'],
  COMPANY: ['company'],
  EMPLOYEES: ['employees'],
  EMPLOYEE: (id: string) => ['employees', id],
  ATTENDANCE: ['attendance'],
  MY_ATTENDANCE: ['attendance', 'my'],
  ATTENDANCE_SUMMARY: ['attendance', 'summary'],
  LEAVE_REQUESTS: ['leave', 'requests'],
  MY_LEAVE: ['leave', 'my'],
  LEAVE_BALANCE: ['leave', 'balance'],
  LEAVE_TYPES: ['leave', 'types'],
  PAYROLL: ['payroll'],
  MY_PAYROLL: ['payroll', 'my'],
  SALARY_STRUCTURE: (id: string) => ['payroll', 'salary', id],
  DASHBOARD_STATS: ['dashboard', 'stats'],
  EMPLOYEE_DASHBOARD: ['dashboard', 'employee'],
  NOTIFICATIONS: ['notifications'],
  DEPARTMENTS: ['departments'],
} as const

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  PER_PAGE: 10,
} as const

export const LEAVE_TYPE_LABELS: Record<string, string> = {
  paid_leave: 'Paid Leave',
  sick_leave: 'Sick Leave',
  unpaid_leave: 'Unpaid Leave',
  casual_leave: 'Casual Leave',
  annual_leave: 'Annual Leave',
  maternity_leave: 'Maternity Leave',
}

export const EMPLOYMENT_TYPE_LABELS: Record<string, string> = {
  full_time: 'Full Time',
  part_time: 'Part Time',
  contract: 'Contract',
  internship: 'Internship',
}

export const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrator',
  hr: 'HR Officer',
  employee: 'Employee',
}
