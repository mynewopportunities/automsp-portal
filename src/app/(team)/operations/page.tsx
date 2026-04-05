import type { Metadata } from 'next'
import { PageHeader } from '@/components/layout/page-header'
import { NotionTable } from '@/components/notion/notion-table'
import { StatCard } from '@/components/ui/stat-card'
import { queryDatabase } from '@/lib/notion/client'

export const metadata: Metadata = { title: 'Operations' }
export const revalidate = 300

export default async function OperationsPage() {
  const [automations, eodForms] = await Promise.all([
    queryDatabase('automations', { pageSize: 25 }),
    queryDatabase('eodForms', { pageSize: 25 }),
  ])

  return (
    <div>
      <PageHeader title="Operations" description="Automations, SOPs, and EOD forms" />

      <div className="grid grid-cols-2 gap-4 mb-8">
        <StatCard title="Automations" value={automations.results.length} icon={<span>🤖</span>} />
        <StatCard title="EOD Forms" value={eodForms.results.length} icon={<span>📝</span>} />
      </div>

      <div className="space-y-6">
        <section className="rounded-xl overflow-hidden"
                 style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <h2 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Automations</h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
              Connected to n8n at n8n.automsp.us
            </p>
          </div>
          <NotionTable results={automations.results as Parameters<typeof NotionTable>[0]['results']}
                       columns={['Name', 'Status', 'Type', 'Last Run']} />
        </section>

        <section className="rounded-xl overflow-hidden"
                 style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <h2 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>EOD Forms</h2>
          </div>
          <NotionTable results={eodForms.results as Parameters<typeof NotionTable>[0]['results']}
                       columns={['Name', 'Status', 'Team Member', 'Date']} />
        </section>
      </div>
    </div>
  )
}
