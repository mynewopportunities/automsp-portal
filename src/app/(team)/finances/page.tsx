import type { Metadata } from 'next'
import { PageHeader } from '@/components/layout/page-header'
import { NotionTable } from '@/components/notion/notion-table'
import { StatCard } from '@/components/ui/stat-card'
import { queryDatabase } from '@/lib/notion/client'

export const metadata: Metadata = { title: 'Finances' }
export const revalidate = 300

export default async function FinancesPage() {
  const [payments, invoices, subscriptions] = await Promise.all([
    queryDatabase('payments', { pageSize: 25 }),
    queryDatabase('invoices', { pageSize: 25 }),
    queryDatabase('subscriptions', { pageSize: 25 }),
  ])

  return (
    <div>
      <PageHeader title="Finances" description="Payments, invoices, and subscription tracker" />

      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard title="Payments" value={payments.results.length} icon={<span>💳</span>} />
        <StatCard title="Invoices" value={invoices.results.length} icon={<span>🧾</span>} />
        <StatCard title="Subscriptions" value={subscriptions.results.length} icon={<span>🔄</span>} />
      </div>

      <div className="space-y-6">
        {[
          { title: 'Payments', results: payments.results, columns: ['Name', 'Status', 'Amount', 'Date'] },
          { title: 'Invoices', results: invoices.results, columns: ['Name', 'Status', 'Amount', 'Due Date'] },
          { title: 'Subscription Tracker', results: subscriptions.results, columns: ['Name', 'Status', 'Amount', 'Renewal'] },
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
