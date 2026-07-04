import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, CalendarCheck, CalendarOff, Check, X } from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'
import { mockDashboardService, mockEmployeeService } from '@/services/mock-data'
import { DashboardSkeleton, EmptyState } from '@/components/feedback'
import { formatCurrency, formatTime } from '@/utils'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import type { DashboardStats, Employee, LeaveRequest, AttendanceRecord } from '@/types'

const CHART_COLORS = ['#22c55e', '#f59e0b', '#3b82f6', '#ef4444']

function Avatar({ name }: { name: string }) {
  const colors = ['#714b67', '#4f46e5', '#059669', '#d97706', '#dc2626', '#2563eb', '#0891b2']
  const i = name.charCodeAt(0) % colors.length
  const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
  return (
    <div style={{
      width: 32, height: 32, borderRadius: '50%', background: colors[i],
      color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 11, fontWeight: 600, flexShrink: 0,
    }}>
      {initials}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase()
  let bg = '#f3f4f6'
  let color = '#374151'

  if (['approved', 'active', 'present'].includes(s)) {
    bg = '#dcfce7'; color = '#16a34a'
  } else if (['pending'].includes(s)) {
    bg = '#fef9c3'; color = '#ca8a04'
  } else if (['rejected', 'absent', 'inactive', 'terminated'].includes(s)) {
    bg = '#fee2e2'; color = '#dc2626'
  } else if (['leave', 'on_leave'].includes(s)) {
    bg = '#dbeafe'; color = '#2563eb'
  }

  return (
    <span style={{
      background: bg, color: color,
      padding: '3px 10px', borderRadius: 20,
      fontSize: 12, fontWeight: 500,
    }}>
      {status.replace('_', ' ')}
    </span>
  )
}

export function AdminDashboard() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [pendingLeaves, setPendingLeaves] = useState<LeaveRequest[]>([])
  const [attendanceOverview, setAttendanceOverview] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [statsData, emps, leaves, attendance] = await Promise.all([
        mockDashboardService.getStats(),
        mockEmployeeService.getAll(),
        mockDashboardService.getPendingLeaves(),
        mockDashboardService.getAttendanceOverview(),
      ])
      setStats(statsData)
      setEmployees(emps)
      setPendingLeaves(leaves)
      setAttendanceOverview(attendance)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !stats) return <DashboardSkeleton />

  const chartData = [
    { name: `Present (${stats.present_today})`, value: stats.present_today },
    { name: `Absent (${stats.absent_today})`, value: stats.absent_today },
    { name: `On Leave (${stats.on_leave_today})`, value: stats.on_leave_today },
    { name: `Half Day (4)`, value: 4 },
  ]

  const statCards = [
    { value: stats.total_employees, change: '+8.5%', up: true, label: 'Total Employees' },
    { value: stats.present_today, change: `${stats.attendance_percentage}%`, up: true, label: 'Present Today' },
    { value: stats.pending_leaves, change: '12', up: false, label: 'Pending Leaves' },
    { value: formatCurrency(stats.this_month_payroll), change: 'Cost', up: true, label: 'Monthly Payroll' },
  ]

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 600, color: '#111827' }}>Dashboard</h1>
      </div>

      {/* Stat Cards matching wireframe 5 */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', padding: '16px 16px' }}>
          {statCards.map((s, i) => (
            <div key={i} style={{ padding: '12px 16px', borderRight: i < 3 ? '1px solid #f3f4f6' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: 28, fontWeight: 700, color: '#111827' }}>{s.value}</span>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: s.up ? '#16a34a' : '#dc2626' }}>
                  {s.change}
                </span>
              </div>
              <div style={{ fontSize: 12.5, color: '#6b7280', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* Employees */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid #e5e7eb' }}>
            <h2 style={{ fontWeight: 600, color: '#111827', fontSize: 15 }}>Employees</h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            {employees.length === 0 ? (
              <EmptyState title="No employees" description="No employees found." />
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.slice(0, 5).map((emp) => (
                    <tr key={emp.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/employees/${emp.id}`)}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <Avatar name={emp.full_name} />
                          <span style={{ fontWeight: 500, color: '#111827', fontSize: 13.5 }}>{emp.full_name}</span>
                        </div>
                      </td>
                      <td style={{ color: '#6b7280' }}>{emp.department_name}</td>
                      <td><StatusBadge status={emp.employment_status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Leave Approvals */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid #e5e7eb' }}>
            <h2 style={{ fontWeight: 600, color: '#111827', fontSize: 15 }}>Leaves Approval</h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            {pendingLeaves.length === 0 ? (
              <EmptyState title="No pending leaves" description="All caught up!" />
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Leave Type</th>
                    <th>From</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingLeaves.slice(0, 5).map((leave) => (
                    <tr key={leave.id}>
                      <td style={{ fontWeight: 500, color: '#111827' }}>{leave.employee_name}</td>
                      <td style={{ color: '#6b7280' }}>{leave.leave_type_label}</td>
                      <td style={{ color: '#6b7280' }}>{leave.start_date.split('-').reverse().join('/')}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <button style={{ background: 'none', border: 'none', color: '#22c55e', cursor: 'pointer', padding: 2 }}>
                            <Check size={16} strokeWidth={2.5} />
                          </button>
                          <button style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 2 }}>
                            <X size={16} strokeWidth={2.5} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Attendance Overview */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid #e5e7eb' }}>
          <h2 style={{ fontWeight: 600, color: '#111827', fontSize: 15 }}>Attendance Overview</h2>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Hours</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceOverview.map((att) => (
                <tr key={att.id}>
                  <td style={{ fontWeight: 500, color: '#111827' }}>{att.employee_name}</td>
                  <td style={{ color: '#6b7280' }}>{att.check_in ? formatTime(att.check_in) : '-'}</td>
                  <td style={{ color: '#6b7280' }}>{att.check_out ? formatTime(att.check_out) : '-'}</td>
                  <td style={{ color: '#6b7280' }}>{att.work_hours > 0 ? `${Math.floor(att.work_hours / 60)}h ${att.work_hours % 60}m` : '00h 00m'}</td>
                  <td><StatusBadge status={att.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
