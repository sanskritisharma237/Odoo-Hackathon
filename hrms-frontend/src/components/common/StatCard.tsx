import { cn } from '@/utils'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  iconBg?: string
  trend?: { value: string; positive: boolean }
  className?: string
}

export function StatCard({ title, value, subtitle, icon: Icon, iconBg = 'bg-primary-100', trend, className }: StatCardProps) {
  return (
    <div className={cn('card p-5 flex items-start gap-4 card-hover', className)}>
      <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0', iconBg)}>
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{title}</p>
        {subtitle && (
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{subtitle}</p>
        )}
        {trend && (
          <p className={cn(
            'text-xs font-medium mt-1',
            trend.positive ? 'text-emerald-600' : 'text-rose-600'
          )}>
            {trend.positive ? '+' : ''}{trend.value}
          </p>
        )}
      </div>
    </div>
  )
}
