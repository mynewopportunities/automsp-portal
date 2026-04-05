import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'active' | 'pending' | 'paused' | 'done' | 'error' | 'outline'
  className?: string
}

const variantClasses = {
  default: 'bg-[#1a1a2e] text-[#e2e8f0]',
  active: 'status-active',
  pending: 'status-pending',
  paused: 'status-paused',
  done: 'status-done',
  error: 'status-error',
  outline: 'border border-[var(--border)] text-[var(--muted-foreground)]',
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium',
      variantClasses[variant],
      className
    )}>
      {children}
    </span>
  )
}

export function statusVariant(status: string): BadgeProps['variant'] {
  const s = status.toLowerCase()
  if (['active', 'in progress', 'live', 'open'].includes(s)) return 'active'
  if (['pending', 'in review', 'waiting', 'new'].includes(s)) return 'pending'
  if (['paused', 'on hold', 'blocked'].includes(s)) return 'paused'
  if (['done', 'completed', 'closed', 'won'].includes(s)) return 'done'
  if (['error', 'failed', 'cancelled', 'lost'].includes(s)) return 'error'
  return 'default'
}
