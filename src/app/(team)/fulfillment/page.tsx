import type { Metadata } from 'next'
import { PageHeader } from '@/components/layout/page-header'
import { NotionTable } from '@/components/notion/notion-table'
import { StatCard } from '@/components/ui/stat-card'
import { queryDatabase } from '@/lib/notion/client'

export const metadata: Metadata = { title: 'Fulfillment' }
export const revalidate = 120

export default async function FulfillmentPage() {
  const [projects, actions] = await Promise.all([
    queryDatabase('projects', { pageSize: 25 }),
    queryDatabase('actions', { pageSize: 25 }),
  ])

  return (
    <div>
      <PageHeader title="Fulfillment" description="Projects, actions, and delivery tracking" />

      <div className="grid grid-cols-2 gap-4 mb-8">
        <StatCard title="Projects" value={projects.results.length} icon={<span>📁</span>} />
        <StatCard title="Open Actions" value={actions.results.length} icon={<span>⚡</span>} />
      </div>

      <div className="space-y-6">
        <section className="rounded-xl overflow-hidden"
                 style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <h2 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Projects</h2>
          </div>
          <NotionTable results={projects.results as Parameters<typeof NotionTable>[0]['results']}
                       columns={['Name', 'Status', 'Client', 'Due Date']} />
        </section>

        <section className="rounded-xl overflow-hidden"
                 style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <h2 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Actions</h2>
          </div>
          <NotionTable results={actions.results as Parameters<typeof NotionTable>[0]['results']}
                       columns={['Name', 'Status', 'Assignee', 'Due Date']} />
        </section>
      </div>
    </div>
  )
}
