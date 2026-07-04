import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, Check, X } from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'
import { mockDashboardService, mockAttendanceService } from '@/services/mock-data'
import { DashboardSkeleton } from '@/components/feedback'
import { formatDate, formatTime } from '@/utils'
import type { EmployeeDashboardData } from '@/types'

function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const colors = ['#714b67', '#4f46e5', '#059669', '#d97706']
  const i = name.charCodeAt(0) % colors.length
  const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', background: colors[i],
      color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.33, fontWeight: 600, flexShrink: 0,
    }}>
      {initials}
    </div>
  )
}

export function EmployeeDashboard() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [data, setData] = useState<EmployeeDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [checkedIn, setCheckedIn] = useState(false)

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      const result = await mockDashboardService.getEmployeeDashboard()
      setData(result)
      if (result.today_attendance?.check_in) setCheckedIn(true)
    } finally {
      setLoading(false)
    }
  }

  const handleCheckIn = async () => {
    await mockAttendanceService.checkIn()
    setCheckedIn(true)
  }

  const handleCheckOut = async () => {
    await mockAttendanceService.checkOut()
    setCheckedIn(false)
  }

  if (loading) return <DashboardSkeleton />

  const quickActions = [
    { label: 'My Profile', icon: '👤', path: '/profile', desc: 'View and update your information' },
    { label: 'My Attendance', icon: '📅', path: '/attendance', desc: 'Check attendance records' },
    { label: 'My Leaves', icon: '🏖️', path: '/leave', desc: 'Apply and manage leaves' },
    { label: 'Payslips', icon: '💰', path: '/payroll', desc: 'View salary details' },
  ]

  return (
    <div className="animate-fade-in-up">
      {/* Welcome banner */}
      <div style={{
        background: 'var(--primary)', borderRadius: 10, padding: '20px 24px',
        marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: 'white' }}>
            Welcome back, {data?.employee.first_name || 'User'}! 👋
          </h1>
          <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>
            {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <button
          onClick={checkedIn ? handleCheckOut : handleCheckIn}
          style={{
            background: checkedIn ? '#ef4444' : '#22c55e',
            color: 'white', border: 'none', borderRadius: 8,
            padding: '10px 20px', fontSize: 13.5, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 8,
          }}
        >
          <Clock size={16} />
          {checkedIn ? 'Check Out' : 'Check In'}
        </button>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {quickActions.map(action => (
          <button
            key={action.label}
            onClick={() => navigate(action.path)}
            className="card card-hover"
            style={{
              padding: '20px 16px', textAlign: 'center', cursor: 'pointer',
              border: '1px solid #e5e7eb', background: 'white',
              borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center',
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 8 }}>{action.icon}</div>
            <div style={{ fontWeight: 600, fontSize: 13.5, color: '#111827', marginBottom: 4 }}>{action.label}</div>
            <div style={{ fontSize: 12, color: '#9ca3af' }}>{action.desc}</div>
          </button>
        ))}
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Recent Activities */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #f3f4f6', fontWeight: 600, fontSize: 14, color: '#111827' }}>
            Recent Activities
          </div>
          <div>
            {data?.recent_activities.map(activity => (
              <div key={activity.id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 16px', borderBottom: '1px solid #f9fafb',
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                  background: activity.status === 'Approved' ? '#22c55e' :
                              activity.status === 'Pending' ? '#f59e0b' : '#714b67',
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: '#374151' }}>{activity.message}</div>
                  <div style={{ fontSize: 11.5, color: '#9ca3af', marginTop: 2 }}>
                    {formatDate(activity.created_at)}
                  </div>
                </div>
                <span style={{
                  fontSize: 11.5, fontWeight: 500, padding: '2px 8px', borderRadius: 12,
                  background: activity.status === 'Approved' ? '#dcfce7' :
                              activity.status === 'Pending' ? '#fef9c3' : '#f3f4f6',
                  color: activity.status === 'Approved' ? '#16a34a' :
                         activity.status === 'Pending' ? '#ca8a04' : '#374151',
                }}>
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #f3f4f6', fontWeight: 600, fontSize: 14, color: '#111827', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Alerts & Notifications</span>
          </div>
          <div>
            {data?.notifications.map(notif => (
              <div key={notif.id} style={{
                padding: '12px 16px', borderBottom: '1px solid #f9fafb',
                display: 'flex', gap: 10,
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                  background: notif.type === 'warning' ? '#fef3c7' : '#dbeafe',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14,
                }}>
                  {notif.type === 'warning' ? '⚠️' : 'ℹ️'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: '#374151' }}>{notif.message}</div>
                  <div style={{ fontSize: 11.5, color: '#9ca3af', marginTop: 2 }}>
                    {formatDate(notif.created_at)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
