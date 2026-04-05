import type { Metadata } from 'next'
import { PageHeader } from '@/components/layout/page-header'
import { NotionTable } from '@/components/notion/notion-table'
import { StatCard } from '@/components/ui/stat-card'
import { queryDatabase } from '@/lib/notion/client'

export const metadata: Metadata = { title: 'Sales' }
export const revalidate = 120

export default async function SalesPage() {
  const [leads, salesCalls, commissionCloser] = await Promise.all([
    queryDatabase('leads', { pageSize: 25 }),
    queryDatabase('salesCalls', { pageSize: 25 }),
    queryDatabase('commissionCloser', { pageSize: 25 }),
  ])

  const databases = [
    { title: 'Leads Database', results: leads.results, columns: ['Name', 'Status', 'Source', 'Created time'] },
    { title: 'Sales Calls', results: salesCalls.results, columns: ['Name', 'Status', 'Date', 'Notes'] },
    { title: 'Commission Tracker (Closer)', results: commissionCloser.results, columns: ['Name', 'Status', 'Amount', 'Date'] },
  ]

  return (
    <div>
      <PageHeader title="Sales" description="Leads, calls, commissions, and proposals" />

      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard title="Total Leads" value={leads.results.length} icon={<span>👤</span>} />
        <StatCard title="Sales Calls" value={salesCalls.results.length} icon={<span>📞</span>} />
        <StatCard title="Commission Records" value={commissionCloser.results.length} icon={<span>💰</span>} />
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
