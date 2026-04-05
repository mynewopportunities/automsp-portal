import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/layout/page-header'
import { NotionTable } from '@/components/notion/notion-table'
import { StatCard } from '@/components/ui/stat-card'
import { queryDatabase } from '@/lib/notion/client'
import { filterByClient, filterByStatus } from '@/lib/notion/filter-by-client'

export const metadata: Metadata = { title: 'Invoices' }
export const revalidate = 300

export default async function ClientInvoicesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, client_notion_name')
    .eq('id', user!.id)
    .single()

  const allInvoices = await queryDatabase('invoices', { pageSize: 100 })
  const clientName = profile?.client_notion_name ?? profile?.full_name ?? ''
  const myInvoices = filterByClient(allInvoices.results, clientName)
  const paid = filterByStatus(myInvoices, ['paid', 'done', 'completed'])

  return (
    <div>
      <PageHeader title="Invoices" description="Your billing history and outstanding invoices" />

      <div className="grid grid-cols-2 gap-4 mb-8">
        <StatCard title="Total Invoices" value={myInvoices.length} icon={<span>🧾</span>} />
        <StatCard title="Paid" value={paid.length} icon={<span>✅</span>} />
      </div>

      <section className="rounded-xl overflow-hidden"
               style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <h2 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Invoice History</h2>
        </div>
        <NotionTable
          results={myInvoices as Parameters<typeof NotionTable>[0]['results']}
          columns={['Name', 'Status', 'Amount', 'Due Date']}
          emptyMessage="No invoices found for your account yet."
        />
      </section>
    </div>
  )
}
