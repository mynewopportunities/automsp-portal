import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
  trend?: { value: number; label: string }
  className?: string
}

export function StatCard({ title, value, subtitle, icon, trend, className }: StatCardProps) {
  return (
    <div className={cn(
      'rounded-xl p-5 transition-all hover:border-[rgba(99,102,241,0.3)]',
      className
    )} style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>
            {title}
          </p>
          <p className="mt-2 text-2xl font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>
            {value}
          </p>
          {subtitle && (
            <p className="mt-1 text-xs" style={{ color: 'var(--muted-foreground)' }}>{subtitle}</p>
          )}
          {trend && (
            <p className={cn('mt-2 text-xs font-medium', trend.value >= 0 ? 'text-[#4ade80]' : 'text-[#f87171]')}>
              {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
            </p>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 rounded-lg p-2.5"
               style={{ background: 'rgba(99,102,241,0.12)', color: '#818cf8' }}>
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
