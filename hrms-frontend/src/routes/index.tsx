import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from '@/components/layouts/AppShell'
import { ProtectedRoute, PublicRoute } from './guards'
import { UnauthorizedPage } from './UnauthorizedPage'

// Auth Pages
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { RegisterPage } from '@/features/auth/pages/RegisterPage'

// Feature Pages
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage'
import { EmployeesPage } from '@/features/employees/pages/EmployeesPage'
import { EmployeeDetailPage } from '@/features/employees/pages/EmployeeDetailPage'
import { AttendancePage } from '@/features/attendance/pages/AttendancePage'
import { UnifiedTimeOffPage } from '@/features/leave/pages/UnifiedTimeOffPage'
import { PayrollPage } from '@/features/payroll/pages/PayrollPage'
import { SettingsPage } from '@/features/settings/pages/SettingsPage'
import { ReportsPage } from '@/features/reports/pages/ReportsPage'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* Profile = Employee Detail for current user */}
          <Route path="/profile" element={<EmployeeDetailPage />} />

          {/* Employees (HR/Admin only) */}
          <Route path="/employees" element={
            <ProtectedRoute roles={['admin', 'hr']}><EmployeesPage /></ProtectedRoute>
          } />
          <Route path="/employees/:id" element={<EmployeeDetailPage />} />

          {/* Attendance */}
          <Route path="/attendance" element={<AttendancePage />} />

          {/* Unified Time Off */}
          <Route path="/leave" element={<UnifiedTimeOffPage />} />

          {/* Payroll */}
          <Route path="/payroll" element={
            <ProtectedRoute roles={['admin', 'hr']}><PayrollPage /></ProtectedRoute>
          } />

          {/* Reports */}
          <Route path="/reports" element={
            <ProtectedRoute roles={['admin', 'hr']}><ReportsPage /></ProtectedRoute>
          } />

          {/* Settings */}
          <Route path="/settings" element={
            <ProtectedRoute roles={['admin']}><SettingsPage /></ProtectedRoute>
          } />
          <Route path="/settings/company" element={
            <ProtectedRoute roles={['admin']}><SettingsPage /></ProtectedRoute>
          } />
        </Route>

        {/* Redirects */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
