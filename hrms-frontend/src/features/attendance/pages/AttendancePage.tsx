import { useState, useEffect } from 'react'
import { Clock, MapPin, Calendar, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'
import { mockAttendanceService } from '@/services/mock-data'
import { Avatar } from '@/components/common/Avatar'
import { StatusBadge } from '@/components/common/StatusBadge'
import { StatCard } from '@/components/common/StatCard'
import { DashboardSkeleton, EmptyState } from '@/components/feedback'
import { formatDate, formatTime, cn } from '@/utils'
import type { AttendanceRecord, AttendanceSummary } from '@/types'

export function AttendancePage() {
  const { user } = useAuthStore()
  const isHrOrAdmin = user?.role === 'admin' || user?.role === 'hr'

  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [summary, setSummary] = useState<AttendanceSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [checkedIn, setCheckedIn] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      const [att, sum] = await Promise.all([
        isHrOrAdmin ? mockAttendanceService.getAll() : mockAttendanceService.getMyAttendance(),
        mockAttendanceService.getSummary(),
      ])
      setRecords(att)
      setSummary(sum)
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

  const filtered = records.filter(r =>
    r.employee_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <DashboardSkeleton />

  return (
    <div className="animate-fade-in-up">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">{isHrOrAdmin ? 'Time and Attendance' : 'My Attendance'}</h1>
        {!isHrOrAdmin && (
          <button
            onClick={checkedIn ? handleCheckOut : handleCheckIn}
            className="btn-primary"
            style={{ background: checkedIn ? '#ef4444' : '#22c55e', color: 'white' }}
          >
            <Clock size={14} />
            {checkedIn ? 'Check Out' : 'Check In'}
          </button>
        )}
      </div>

      {/* Stats Row */}
      {summary && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          <div className="card" style={{ padding: '16px' }}>
            <div style={{ color: '#6b7280', fontSize: 13, marginBottom: 4 }}>Worked Hours</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#111827' }}>
              {`${Math.floor(summary.total_worked_hours / 60)}:${String(summary.total_worked_hours % 60).padStart(2, '0')}`}
            </div>
          </div>
          <div className="card" style={{ padding: '16px' }}>
            <div style={{ color: '#6b7280', fontSize: 13, marginBottom: 4 }}>Present Days</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#111827' }}>{summary.total_present}</div>
          </div>
          <div className="card" style={{ padding: '16px' }}>
            <div style={{ color: '#6b7280', fontSize: 13, marginBottom: 4 }}>Absent Days</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#111827' }}>{summary.total_absent}</div>
          </div>
          <div className="card" style={{ padding: '16px' }}>
            <div style={{ color: '#6b7280', fontSize: 13, marginBottom: 4 }}>Leave Days</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#111827' }}>{summary.total_leave}</div>
          </div>
        </div>
      )}

      {/* Search */}
      {isHrOrAdmin && (
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
              placeholder="Search employee..."
              style={{ border: 'none', outline: 'none', fontSize: 13.5, width: '100%', color: '#374151' }}
            />
          </div>
        </div>
      )}

      {/* Attendance Table */}
      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState title="No attendance records" description="There are no attendance records for this period." />
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  {isHrOrAdmin && <th>ID</th>}
                  <th>Name</th>
                  <th>Clock-In Time</th>
                  <th>Clock-Out Time</th>
                  <th>Hours Worked</th>
                  <th>Status</th>
                  {isHrOrAdmin && <th>Work Place</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.map((record, index) => (
                  <tr key={record.id}>
                    {isHrOrAdmin && (
                      <td className="text-slate-500 font-mono text-xs">{String(index + 1).padStart(3, '0')}</td>
                    )}
                    <td>
                      <div className="flex items-center gap-2.5">
                        <Avatar name={record.employee_name} src={record.employee_avatar} size="sm" />
                        <span className="font-medium text-slate-900 dark:text-white">{record.employee_name}</span>
                      </div>
                    </td>
                    <td className="text-slate-600 dark:text-slate-400">
                      {record.check_in ? formatTime(record.check_in) : '---'}
                    </td>
                    <td className="text-slate-600 dark:text-slate-400">
                      {record.check_out ? formatTime(record.check_out) : '---'}
                    </td>
                    <td className="text-slate-600 dark:text-slate-400">
                      {record.work_hours > 0 ? `${Math.floor(record.work_hours / 60)} Hours` : '---'}
                    </td>
                    <td><StatusBadge status={record.status} /></td>
                    {isHrOrAdmin && (
                      <td className="text-slate-500">{record.work_place || '---'}</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
