import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, MoreVertical, Download } from 'lucide-react'
import { mockEmployeeService } from '@/services/mock-data'
import { Avatar } from '@/components/common/Avatar'
import { StatusBadge } from '@/components/common/StatusBadge'
import { DashboardSkeleton, EmptyState } from '@/components/feedback'
import { cn } from '@/utils'
import type { Employee } from '@/types'
import { CreateEmployeeModal } from '../components/CreateEmployeeModal'

export function EmployeesPage() {
  const navigate = useNavigate()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createdCreds, setCreatedCreds] = useState<any>(null)

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      const data = await mockEmployeeService.getAll()
      setEmployees(data)
    } finally {
      setLoading(false)
    }
  }

  const filtered = employees.filter(e =>
    e.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (e.department_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <DashboardSkeleton />

  return (
    <div className="animate-fade-in-up">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Employees</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary"
        >
          <Plus size={14} />
          Add Employee
        </button>
      </div>

      <div className="card" style={{ padding: '16px', marginBottom: '24px', display: 'flex', gap: 8 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          border: '1px solid #d1d5db', borderRadius: 6, padding: '6px 12px', background: 'white',
          width: '100%', maxWidth: 300,
        }}>
          <Search size={14} color="#9ca3af" />
          <input
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search employees..."
            style={{ border: 'none', outline: 'none', fontSize: 13.5, width: '100%', color: '#374151' }}
          />
        </div>
      </div>

      {/* Employee Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-children">
        {filtered.map((emp) => (
          <button
            key={emp.id}
            onClick={() => navigate(`/employees/${emp.id}`)}
            className="card p-5 text-left card-hover group"
          >
            <div className="flex items-start justify-between mb-4">
              <Avatar name={emp.full_name} src={emp.profile_picture_url} size="lg" />
              <StatusBadge status={emp.employment_status} />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
              {emp.full_name}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{emp.designation}</p>
            <p className="text-xs text-slate-400 mt-1">{emp.department_name}</p>
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
              <p className="text-xs text-slate-400 font-mono">{emp.employee_id}</p>
            </div>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <EmptyState title="No employees found" description="Try adjusting your search criteria." />
      )}

      {/* Created Credentials Display */}
      {createdCreds && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setCreatedCreds(null)} />
          <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 w-full max-w-md animate-scale-in">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Employee Created Successfully</h3>
            <div className="space-y-3 bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl">
              <p className="text-sm"><span className="font-medium">Employee ID:</span> {createdCreds.employee_id}</p>
              <p className="text-sm"><span className="font-medium">Login ID:</span> {createdCreds.login_id}</p>
              <p className="text-sm"><span className="font-medium">Temp Password:</span> {createdCreds.temporary_password}</p>
              <p className="text-sm"><span className="font-medium">Email:</span> {createdCreds.email}</p>
            </div>
            <p className="text-xs text-slate-400 mt-3">Please share these credentials with the employee securely.</p>
            <button
              onClick={() => setCreatedCreds(null)}
              className="mt-4 w-full py-2.5 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary-dark"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Create Employee Modal */}
      {showCreateModal && (
        <CreateEmployeeModal
          onClose={() => setShowCreateModal(false)}
          onCreated={(creds) => {
            setShowCreateModal(false)
            setCreatedCreds(creds)
            loadData()
          }}
        />
      )}
    </div>
  )
}
