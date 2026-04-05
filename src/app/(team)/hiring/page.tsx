import type { Metadata } from 'next'
import { PageHeader } from '@/components/layout/page-header'
import { NotionTable } from '@/components/notion/notion-table'
import { StatCard } from '@/components/ui/stat-card'
import { queryDatabase } from '@/lib/notion/client'

export const metadata: Metadata = { title: 'Hiring' }
export const revalidate = 300

export default async function HiringPage() {
  const [jobPostings, interviews, roleBlueprints] = await Promise.all([
    queryDatabase('jobPostings', { pageSize: 25 }),
    queryDatabase('jobInterviews', { pageSize: 25 }),
    queryDatabase('roleBlueprints', { pageSize: 25 }),
  ])

  return (
    <div>
      <PageHeader title="Hiring" description="Job postings, interviews, and role blueprints" />

      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard title="Open Roles" value={jobPostings.results.length} icon={<span>📢</span>} />
        <StatCard title="Interviews" value={interviews.results.length} icon={<span>🤝</span>} />
        <StatCard title="Role Blueprints" value={roleBlueprints.results.length} icon={<span>📄</span>} />
      </div>

      <div className="space-y-6">
        {[
          { title: 'Job Postings', results: jobPostings.results, columns: ['Name', 'Status', 'Department', 'Date'] },
          { title: 'Job Interviews', results: interviews.results, columns: ['Name', 'Status', 'Role', 'Date'] },
          { title: 'Role Blueprints', results: roleBlueprints.results, columns: ['Name', 'Status', 'Department'] },
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
