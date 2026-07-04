import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Search, Filter, Plus, Check, X } from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'
import { mockLeaveService } from '@/services/mock-data'
import { DashboardSkeleton, EmptyState } from '@/components/feedback'
import { formatDate } from '@/utils'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { LeaveRequestModal } from '../components/LeaveRequestModal'
import { toast } from 'sonner'
import type { LeaveRequest } from '@/types'

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

  if (s === 'approved') { bg = '#dcfce7'; color = '#16a34a' }
  else if (s === 'pending') { bg = '#fef9c3'; color = '#ca8a04' }
  else if (s === 'rejected') { bg = '#fee2e2'; color = '#dc2626' }

  return (
    <span style={{
      background: bg, color: color,
      padding: '3px 10px', borderRadius: 20,
      fontSize: 12, fontWeight: 500,
    }}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

export function UnifiedTimeOffPage() {
  const { user } = useAuthStore()
  const isAdminOrHr = user?.role === 'admin' || user?.role === 'hr'

  const [requests, setRequests] = useState<LeaveRequest[]>([])
  const [loading, setLoading] = useState(true)
  
  // Pagination & Search
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [perPage, setPerPage] = useState(10)

  // Modals & Dialogs
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: 'approve' | 'reject';
    requestId: string | null;
    loading: boolean;
  }>({ isOpen: false, type: 'approve', requestId: null, loading: false })

  useEffect(() => { loadData() }, [isAdminOrHr])

  const loadData = async () => {
    setLoading(true)
    try {
      const data = isAdminOrHr 
        ? await mockLeaveService.getAllRequests()
        : await mockLeaveService.getMyRequests()
      setRequests(data)
    } finally {
      setLoading(false)
    }
  }

  const filtered = requests.filter(r =>
    r.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.leave_type_label.toLowerCase().includes(searchTerm.toLowerCase())
  )
  const totalPages = Math.ceil(filtered.length / perPage) || 1
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage)

  const handleActionClick = (type: 'approve' | 'reject', id: string) => {
    setConfirmDialog({ isOpen: true, type, requestId: id, loading: false })
  }

  const handleConfirmAction = async () => {
    if (!confirmDialog.requestId) return

    setConfirmDialog(prev => ({ ...prev, loading: true }))
    try {
      if (confirmDialog.type === 'approve') {
        await mockLeaveService.approve(confirmDialog.requestId, 'Approved by admin')
        toast.success('Leave request approved successfully')
      } else {
        await mockLeaveService.reject(confirmDialog.requestId, 'Rejected by admin')
        toast.success('Leave request rejected successfully')
      }
      // Refresh data
      await loadData()
    } catch (err: any) {
      toast.error(err.message || 'Action failed')
    } finally {
      setConfirmDialog({ isOpen: false, type: 'approve', requestId: null, loading: false })
    }
  }

  if (loading) return <DashboardSkeleton />

  return (
    <div className="animate-fade-in-up">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Time off</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-outline">
            <Filter size={14} />
            Filter
          </button>
          {!isAdminOrHr && (
            <button className="btn-primary" onClick={() => setShowRequestModal(true)}>
              <Plus size={14} />
              New Time Off
            </button>
          )}
        </div>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        {/* Search */}
        <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb', display: 'flex', gap: 8 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            border: '1px solid #d1d5db', borderRadius: 6, padding: '6px 12px', background: 'white',
            width: '100%', maxWidth: 300,
          }}>
            <Search size={14} color="#9ca3af" />
            <input
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search time off requests..."
              style={{ border: 'none', outline: 'none', fontSize: 13.5, width: '100%', color: '#374151' }}
            />
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          {filtered.length === 0 ? (
            <EmptyState title="No time off requests found" description="Try adjusting your search criteria." />
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  {isAdminOrHr && <th>Employee</th>}
                  <th>Leave Type</th>
                  <th>Period</th>
                  <th>Days</th>
                  <th>Reason</th>
                  <th>Status</th>
                  {isAdminOrHr && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {paginated.map(row => (
                  <tr key={row.id}>
                    {isAdminOrHr && (
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <Avatar name={row.employee_name} />
                          <span style={{ fontSize: 13.5, fontWeight: 500, color: '#111827' }}>{row.employee_name}</span>
                        </div>
                      </td>
                    )}
                    <td style={{ color: '#4b5563', fontWeight: 500 }}>{row.leave_type_label}</td>
                    <td style={{ color: '#6b7280', whiteSpace: 'nowrap' }}>
                      {formatDate(row.start_date, 'dd MMM yyyy')} 
                      {row.start_date !== row.end_date && ` - ${formatDate(row.end_date, 'dd MMM yyyy')}`}
                    </td>
                    <td style={{ color: '#6b7280' }}>{row.days}</td>
                    <td style={{ color: '#6b7280', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {row.reason || '--'}
                    </td>
                    <td><StatusBadge status={row.status} /></td>
                    
                    {isAdminOrHr && (
                      <td>
                        {row.status === 'pending' ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <button
                              onClick={() => handleActionClick('approve', row.id)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#22c55e', padding: 4 }}
                              title="Approve"
                            >
                              <Check size={18} strokeWidth={2.5} />
                            </button>
                            <button
                              onClick={() => handleActionClick('reject', row.id)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: 4 }}
                              title="Reject"
                            >
                              <X size={18} strokeWidth={2.5} />
                            </button>
                          </div>
                        ) : (
                          <span style={{ color: '#9ca3af', fontSize: 13 }}>--</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer: per page + pagination */}
        {filtered.length > 0 && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 16px', borderTop: '1px solid #f3f4f6',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <select
                value={perPage}
                onChange={e => { setPerPage(Number(e.target.value)); setCurrentPage(1); }}
                style={{
                  border: '1px solid #e5e7eb', borderRadius: 6, padding: '4px 8px',
                  fontSize: 13, color: '#374151', cursor: 'pointer', background: 'white'
                }}
              >
                {[10, 25, 50].map(n => <option key={n} value={n}>{n} records</option>)}
              </select>
            </div>
            
            {totalPages > 1 && (
              <div className="pagination" style={{ padding: 0 }}>
                <button className="pg-btn" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                  <ChevronLeft size={14} />
                </button>
                {Array.from({ length: Math.min(3, totalPages) }).map((_, i) => (
                  <button key={i} className={`pg-btn${currentPage === i + 1 ? ' active' : ''}`} onClick={() => setCurrentPage(i + 1)}>
                    {i + 1}
                  </button>
                ))}
                {totalPages > 3 && (
                  <>
                    <span style={{ color: '#9ca3af', fontSize: 13 }}>...</span>
                    <button className="pg-btn" onClick={() => setCurrentPage(totalPages)}>{totalPages}</button>
                  </>
                )}
                <button className="pg-btn" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {showRequestModal && (
        <LeaveRequestModal
          onClose={() => setShowRequestModal(false)}
          onSubmit={async (data) => {
            await mockLeaveService.createRequest(data)
            setShowRequestModal(false)
            toast.success('Leave request submitted')
            loadData()
          }}
        />
      )}

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.type === 'approve' ? 'Approve Leave Request' : 'Reject Leave Request'}
        description={`Are you sure you want to ${confirmDialog.type} this leave request? This action cannot be undone.`}
        confirmText={confirmDialog.type === 'approve' ? 'Approve' : 'Reject'}
        confirmVariant={confirmDialog.type === 'approve' ? 'success' : 'danger'}
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmDialog({ isOpen: false, type: 'approve', requestId: null, loading: false })}
        loading={confirmDialog.loading}
      />
    </div>
  )
}
