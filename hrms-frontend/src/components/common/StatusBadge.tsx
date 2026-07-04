import { cn, getStatusColor, capitalize } from '@/utils'

interface StatusBadgeProps {
  status: string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const label = status.replace(/_/g, ' ')
  return (
    <span className={cn(`badge-${status}`, className)}>
      {capitalize(label)}
    </span>
  )
}
