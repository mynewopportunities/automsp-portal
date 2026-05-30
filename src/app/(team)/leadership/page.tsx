import type { Metadata } from 'next'
import { PageHeader } from '@/components/layout/page-header'
import { NotionTable } from '@/components/notion/notion-table'
import { StatCard } from '@/components/ui/stat-card'
import { queryDatabase } from '@/lib/notion/client'

export const metadata: Metadata = { title: 'Leadership' }
export const revalidate = 300

export default async function LeadershipPage() {
  const [meetings, contracts, financeLegal] = await Promise.all([
    queryDatabase('leadershipMeetings', { pageSize: 25 }),
    queryDatabase('contracts', { pageSize: 25 }),
    queryDatabase('financeLegal', { pageSize: 25 }),
  ])

  const databases = [
    {
      title: 'Leadership Meetings',
      results: meetings.results,
      columns: ['Name', 'Status', 'Date', 'Attendees'],
    },
    {
      title: 'Contracts & Documents',
      results: contracts.results,
      columns: ['Name', 'Status', 'Client', 'Signed Date'],
    },
    {
      title: 'Finance & Legal',
      results: financeLegal.results,
      columns: ['Name', 'Status', 'Type', 'Date'],
    },
  ]

  return (
    <div>
      <PageHeader title="Leadership" description="Meetings, contracts, and legal oversight" />

      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard title="Meetings" value={meetings.results.length} icon={<span>🗓️</span>} />
        <StatCard title="Contracts" value={contracts.results.length} icon={<span>📄</span>} />
        <StatCard title="Finance & Legal" value={financeLegal.results.length} icon={<span>⚖️</span>} />
      </div>

      <div className="space-y-6">
        {databases.map(({ title, results, columns }) => (
          <section key={title} className="rounded-xl overflow-hidden"
                   style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
              <h2 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{title}</h2>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                {results.length} records
              </p>
            </div>
            <NotionTable results={results as Parameters<typeof NotionTable>[0]['results']} columns={columns} />
          </section>
        ))}
      </div>
    </div>
  )
}
