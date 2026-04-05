import type { Metadata } from 'next'
import { PageHeader } from '@/components/layout/page-header'
import { NotionTable } from '@/components/notion/notion-table'
import { StatCard } from '@/components/ui/stat-card'
import { queryDatabase } from '@/lib/notion/client'

export const metadata: Metadata = { title: 'Client Success' }
export const revalidate = 300

export default async function ClientSuccessPage() {
  const [caseStudies, wins, surveys] = await Promise.all([
    queryDatabase('caseStudies', { pageSize: 25 }),
    queryDatabase('wins', { pageSize: 25 }),
    queryDatabase('surveys', { pageSize: 25 }),
  ])

  return (
    <div>
      <PageHeader title="Client Success" description="Case studies, wins, and NPS surveys" />

      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard title="Case Studies" value={caseStudies.results.length} icon={<span>📖</span>} />
        <StatCard title="Client Wins" value={wins.results.length} icon={<span>🏆</span>} />
        <StatCard title="Surveys" value={surveys.results.length} icon={<span>📋</span>} />
      </div>

      <div className="space-y-6">
        {[
          { title: 'Case Studies', results: caseStudies.results, columns: ['Name', 'Status', 'Client', 'Date'] },
          { title: 'Wins', results: wins.results, columns: ['Name', 'Status', 'Client', 'Date'] },
          { title: 'Surveys', results: surveys.results, columns: ['Name', 'Status', 'Score', 'Date'] },
        ].map(({ title, results, columns }) => (
          <section key={title} className="rounded-xl overflow-hidden"
                   style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
              <h2 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{title}</h2>
            </div>
            <NotionTable results={results as Parameters<typeof NotionTable>[0]['results']} columns={columns} />
          </section>
        ))}
      </div>
    </div>
  )
}
