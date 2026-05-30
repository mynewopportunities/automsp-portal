import type { Metadata } from 'next'
import { PageHeader } from '@/components/layout/page-header'
import { StatCard } from '@/components/ui/stat-card'
import { SwarmStatus } from '@/components/bos/swarm-status'
import { queryDatabase } from '@/lib/notion/client'

export const metadata: Metadata = { title: 'Dashboard' }
export const revalidate = 300

export default async function DashboardPage() {
  const [leads, projects, actions, payments] = await Promise.all([
    queryDatabase('leads', { pageSize: 100 }),
    queryDatabase('projects', { pageSize: 100 }),
    queryDatabase('actions', { pageSize: 100 }),
    queryDatabase('payments', { pageSize: 100 }),
  ])

  const sections = [
    { title: 'Sales', href: '/sales', icon: '💰', desc: 'Leads, calls, proposals' },
    { title: 'Fulfillment', href: '/fulfillment', icon: '🚀', desc: 'Projects, actions, templates' },
    { title: 'Marketing', href: '/marketing', icon: '📣', desc: 'Social media, funnels, ads' },
    { title: 'Client Success', href: '/client-success', icon: '🏆', desc: 'Surveys, case studies, wins' },
    { title: 'Finances', href: '/finances', icon: '💳', desc: 'Payments, invoices, subscriptions' },
    { title: 'Hiring', href: '/hiring', icon: '👥', desc: 'Job postings, interviews, onboarding' },
    { title: 'Operations', href: '/operations', icon: '⚙️', desc: 'Automations, SOPs, forms' },
    { title: 'Leadership', href: '/leadership', icon: '🎯', desc: 'Meetings, contracts, legal' },
  ]

  return (
    <div>
      <PageHeader
        title="Command Center"
        description="AutoMSP AI Automation Services — Operations Overview"
      />

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Leads" value={leads.results.length} subtitle="in Leads Database" icon={<span>👤</span>} />
        <StatCard title="Active Projects" value={projects.results.length} subtitle="in Fulfillment" icon={<span>📁</span>} />
        <StatCard title="Open Actions" value={actions.results.length} subtitle="pending completion" icon={<span>⚡</span>} />
        <StatCard title="Payments" value={payments.results.length} subtitle="records tracked" icon={<span>💳</span>} />
      </div>

      {/* BOS Swarm Status */}
      <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--muted-foreground)' }}>
        BOS Intelligence
      </h2>
      <div className="mb-8">
        <SwarmStatus />
      </div>

      {/* Section grid */}
      <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--muted-foreground)' }}>
        Navigate
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {sections.map(({ title, href, icon, desc }) => (
          <a key={href} href={href}
             className="rounded-xl p-4 transition-all hover:border-[rgba(99,102,241,0.35)] hover:bg-[rgba(99,102,241,0.04)]"
             style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="text-2xl mb-2">{icon}</div>
            <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{title}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{desc}</p>
          </a>
        ))}
      </div>
    </div>
  )
}
