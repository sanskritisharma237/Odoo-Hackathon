import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, parseISO, differenceInHours, differenceInMinutes } from 'date-fns'

// ===========================
// CSS Utilities
// ===========================
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ===========================
// Date Utilities
// ===========================
export function formatDate(date: string | Date, fmt = 'dd MMM yyyy'): string {
  try {
    const d = typeof date === 'string' ? parseISO(date) : date
    return format(d, fmt)
  } catch {
    return '-'
  }
}

export function formatTime(date: string | Date): string {
  try {
    const d = typeof date === 'string' ? parseISO(date) : date
    return format(d, 'hh:mm a')
  } catch {
    return '--:--'
  }
}

export function formatDateTime(date: string | Date): string {
  try {
    const d = typeof date === 'string' ? parseISO(date) : date
    return format(d, 'dd MMM yyyy, hh:mm a')
  } catch {
    return '-'
  }
}

export function formatWorkHours(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

export function calculateWorkHours(checkIn: string, checkOut: string): number {
  try {
    const inTime = parseISO(checkIn)
    const outTime = parseISO(checkOut)
    return differenceInMinutes(outTime, inTime)
  } catch {
    return 0
  }
}

export function getMonthName(month: number): string {
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']
  return months[month - 1] || ''
}

export function getCurrentMonthYear(): { month: number; year: number } {
  const now = new Date()
  return { month: now.getMonth() + 1, year: now.getFullYear() }
}

// ===========================
// String Utilities
// ===========================
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function formatCurrency(amount: number, currency = '₹'): string {
  return `${currency}${amount.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

export function truncate(str: string, length = 30): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

// ===========================
// Color Utilities
// ===========================
export function getAvatarColor(name: string): string {
  const colors = [
    'bg-indigo-500', 'bg-violet-500', 'bg-emerald-500', 'bg-amber-500',
    'bg-rose-500', 'bg-cyan-500', 'bg-pink-500', 'bg-teal-500',
    'bg-orange-500', 'bg-blue-500',
  ]
  const index = name.charCodeAt(0) % colors.length
  return colors[index]
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    present: 'status-present',
    absent: 'status-absent',
    leave: 'status-leave',
    half_day: 'status-halfday',
    late: 'status-late',
    pending: 'status-pending',
    approved: 'status-approved',
    rejected: 'status-rejected',
    holiday: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    active: 'status-approved',
    inactive: 'status-rejected',
    terminated: 'status-rejected',
    on_leave: 'status-leave',
  }
  return map[status] || 'bg-slate-100 text-slate-700'
}

// ===========================
// Storage Utilities
// ===========================
export const storage = {
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch {
      return null
    }
  },
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Storage might be full
    }
  },
  remove: (key: string): void => {
    localStorage.removeItem(key)
  },
  clear: (): void => {
    localStorage.clear()
  },
}

// ===========================
// File Utilities
// ===========================
export function getFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function isImageFile(filename: string): boolean {
  return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(filename)
}

// ===========================
// Validation Utilities
// ===========================
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function getPasswordStrength(password: string): {
  score: number
  label: string
  color: string
} {
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[a-z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  const levels = [
    { score: 0, label: 'Very Weak', color: 'bg-rose-500' },
    { score: 1, label: 'Weak', color: 'bg-orange-500' },
    { score: 2, label: 'Fair', color: 'bg-amber-500' },
    { score: 3, label: 'Good', color: 'bg-blue-500' },
    { score: 4, label: 'Strong', color: 'bg-emerald-500' },
    { score: 5, label: 'Very Strong', color: 'bg-emerald-600' },
  ]

  return levels[score] || levels[0]
}

// ===========================
// Array Utilities
// ===========================
export function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
  return arr.reduce((groups, item) => {
    const groupKey = String(item[key])
    return { ...groups, [groupKey]: [...(groups[groupKey] || []), item] }
  }, {} as Record<string, T[]>)
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
