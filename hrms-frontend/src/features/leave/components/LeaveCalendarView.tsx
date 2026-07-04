import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/utils'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

// Mock calendar events for demo
const MOCK_EVENTS: Record<string, string[]> = {
  '2025-5-5': ['present'],
  '2025-5-6': ['present'],
  '2025-5-7': ['leave', 'sick'],
  '2025-5-8': ['present'],
  '2025-5-9': ['present'],
  '2025-5-12': ['present'],
  '2025-5-13': ['present'],
  '2025-5-14': ['annual'],
  '2025-5-15': ['present'],
  '2025-5-16': ['present'],
  '2025-5-19': ['present', 'leave'],
  '2025-5-20': ['present'],
  '2025-5-21': ['present'],
  '2025-5-22': ['present'],
  '2025-5-23': ['present'],
  '2025-5-26': ['holiday'],
  '2025-5-27': ['present'],
  '2025-5-28': ['present'],
  '2025-5-29': ['present'],
  '2025-5-30': ['present'],
}

export function LeaveCalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 4, 1))
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month')

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  // Start from Monday
  let startOffset = firstDay.getDay() - 1
  if (startOffset < 0) startOffset = 6

  const daysInMonth = lastDay.getDate()
  const prevMonthDays = new Date(year, month, 0).getDate()

  const cells: { day: number; month: number; year: number; isCurrentMonth: boolean }[] = []

  // Previous month days
  for (let i = startOffset - 1; i >= 0; i--) {
    cells.push({ day: prevMonthDays - i, month: month - 1, year, isCurrentMonth: false })
  }
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    cells.push({ day: i, month, year, isCurrentMonth: true })
  }
  // Next month days
  const remaining = 42 - cells.length
  for (let i = 1; i <= remaining; i++) {
    cells.push({ day: i, month: month + 1, year, isCurrentMonth: false })
  }

  const goToPrev = () => setCurrentDate(new Date(year, month - 1, 1))
  const goToNext = () => setCurrentDate(new Date(year, month + 1, 1))
  const goToToday = () => setCurrentDate(new Date())

  const today = new Date()
  const isToday = (cell: typeof cells[0]) =>
    cell.day === today.getDate() && cell.month === today.getMonth() && cell.year === today.getFullYear()

  return (
    <div className="card overflow-hidden">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <button onClick={goToPrev} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white min-w-[160px] text-center">
            {MONTHS[month]} {year}
          </h2>
          <button onClick={goToNext} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
            <ChevronRight className="w-5 h-5" />
          </button>
          <button onClick={goToToday} className="ml-2 px-3 py-1 text-sm font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary/5">
            Today
          </button>
        </div>
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
          {(['month', 'week'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={cn(
                'px-3 py-1.5 rounded-md text-sm font-medium capitalize transition-colors',
                viewMode === mode
                  ? 'bg-primary text-white'
                  : 'text-slate-500 hover:text-slate-700'
              )}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-700">
        {DAYS.map(day => (
          <div key={day} className="px-2 py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {cells.map((cell, i) => {
          const key = `${cell.year}-${cell.month + 1}-${cell.day}`
          const events = MOCK_EVENTS[key] || []
          const isTodayCell = isToday(cell)

          return (
            <div
              key={i}
              className={cn(
                'min-h-[80px] sm:min-h-[100px] p-2 border-b border-r border-slate-100 dark:border-slate-800 relative transition-colors',
                !cell.isCurrentMonth && 'bg-slate-50/50 dark:bg-slate-900/30',
                cell.isCurrentMonth && 'hover:bg-slate-50 dark:hover:bg-slate-800/30 cursor-pointer',
              )}
            >
              <span className={cn(
                'text-sm font-medium',
                !cell.isCurrentMonth && 'text-slate-300 dark:text-slate-600',
                cell.isCurrentMonth && 'text-slate-700 dark:text-slate-300',
                isTodayCell && 'w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center'
              )}>
                {cell.day}
              </span>
              {/* Event Dots */}
              {events.length > 0 && (
                <div className="flex gap-1 mt-1.5 flex-wrap">
                  {events.map((evt, j) => (
                    <span
                      key={j}
                      className={cn(
                        'calendar-dot',
                        evt === 'present' && 'dot-present',
                        evt === 'leave' && 'dot-leave',
                        evt === 'sick' && 'dot-sick',
                        evt === 'annual' && 'dot-annual',
                        evt === 'holiday' && 'dot-holiday',
                        evt === 'absent' && 'dot-absent',
                      )}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 px-5 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
        {[
          { label: 'Present', cls: 'dot-present' },
          { label: 'Leave', cls: 'dot-leave' },
          { label: 'Sick Leave', cls: 'dot-sick' },
          { label: 'Annual Leave', cls: 'dot-annual' },
          { label: 'Holiday', cls: 'dot-holiday' },
          { label: 'Absent', cls: 'dot-absent' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-1.5">
            <span className={cn('calendar-dot', item.cls)} />
            <span className="text-xs text-slate-500 dark:text-slate-400">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
