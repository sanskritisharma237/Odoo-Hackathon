import { useAuthStore } from '@/store/auth-store'
import { EmployeeDashboard } from './EmployeeDashboard'
import { AdminDashboard } from './AdminDashboard'

export function DashboardPage() {
  const { user } = useAuthStore()

  if (user?.role === 'admin' || user?.role === 'hr') {
    return <AdminDashboard />
  }

  return <EmployeeDashboard />
}
