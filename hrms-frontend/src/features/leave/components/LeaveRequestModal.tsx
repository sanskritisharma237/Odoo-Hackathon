import { useState, useEffect } from 'react'
import { X, Upload } from 'lucide-react'
import { mockLeaveService } from '@/services/mock-data'
import { cn } from '@/utils'
import type { LeaveType } from '@/types'

interface LeaveRequestModalProps {
  onClose: () => void
  onSubmit: (data: any) => Promise<void>
}

export function LeaveRequestModal({ onClose, onSubmit }: LeaveRequestModalProps) {
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    leave_type_id: '',
    start_date: '',
    end_date: '',
    reason: '',
  })

  useEffect(() => {
    mockLeaveService.getTypes().then(setLeaveTypes)
  }, [])

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const selectedType = leaveTypes.find(t => t.id === form.leave_type_id)

  const calculateDays = () => {
    if (!form.start_date || !form.end_date) return 0
    const start = new Date(form.start_date)
    const end = new Date(form.end_date)
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
    return Math.max(0, diff)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit(form)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Time off request</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <p className="text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            Please make sure to get your supervisor's approval before applying for the leave.
          </p>

          {/* Leave Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Time off type <span className="text-rose-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {leaveTypes.slice(0, 4).map(type => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => updateField('leave_type_id', type.id)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm font-medium border transition-all',
                    form.leave_type_id === type.id
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-primary/50'
                  )}
                >
                  {type.label}
                </button>
              ))}
            </div>
            {selectedType && (
              <p className="text-xs text-blue-500 mt-1.5">
                Taking {calculateDays()} days. You'll have {Math.max(0, selectedType.days_allowed - 2 - calculateDays())} days left.
              </p>
            )}
          </div>

          {/* Validity Period */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Validity Period
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  type="date"
                  value={form.start_date}
                  onChange={(e) => updateField('start_date', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <input
                  type="date"
                  value={form.end_date}
                  onChange={(e) => updateField('end_date', e.target.value)}
                  min={form.start_date}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white"
                  required
                />
              </div>
            </div>
          </div>

          {/* Allocation */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Allocation
              </label>
              <div className="px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-sm text-slate-700 dark:text-slate-300">
                {calculateDays()} {calculateDays() === 1 ? 'Day' : 'Days'}
              </div>
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Reason <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={form.reason}
              onChange={(e) => updateField('reason', e.target.value)}
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white resize-none placeholder:text-slate-400"
              placeholder="Enter reason for leave..."
              required
            />
          </div>

          {/* Attachment */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Attachment
            </label>
            <p className="text-xs text-slate-400 mb-2">(For sick leave certificates)</p>
            <label className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              <Upload className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-500">Choose file</span>
              <span className="text-xs text-slate-400 ml-1">No file chosen</span>
              <input type="file" className="hidden" accept=".pdf,.jpg,.png" />
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className={cn(
                'px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all',
                loading ? 'bg-primary/60 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark'
              )}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Discard
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
