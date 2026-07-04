import { useAuthStore } from '@/store/auth-store'
import { EmployeeDetailPage } from '@/features/employees/pages/EmployeeDetailPage'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function ProfilePage() {
  // Reuses EmployeeDetailPage but for the current user
  const { user } = useAuthStore()
  const navigate = useNavigate()

  // Map user to employee ID for mock
  const employeeIdMap: Record<string, string> = {
    'user-001': 'emp-001',
    'user-002': 'emp-002',
    'user-006': 'emp-006',
  }

  const empId = user ? employeeIdMap[user.id] || 'emp-001' : 'emp-001'

  return (
    <div>
      <EmployeeDetailPage />
    </div>
  )
}
