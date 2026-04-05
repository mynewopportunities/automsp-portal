import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/layout/page-header'
import { NotionTable } from '@/components/notion/notion-table'
import { StatCard } from '@/components/ui/stat-card'
import { queryDatabase } from '@/lib/notion/client'
import { filterByClient, filterByStatus } from '@/lib/notion/filter-by-client'

export const metadata: Metadata = { title: 'Deliverables' }
export const revalidate = 120

export default async function ClientDeliverablesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, client_notion_name')
    .eq('id', user!.id)
    .single()

  const allActions = await queryDatabase('actions', { pageSize: 100 })
  const clientName = profile?.client_notion_name ?? profile?.full_name ?? ''
  const myActions = filterByClient(allActions.results, clientName)
  const done = filterByStatus(myActions, ['done', 'completed'])

  return (
    <div>
      <PageHeader title="Deliverables" description="Track the status of your automation deliverables" />

      <div className="grid grid-cols-2 gap-4 mb-8">
        <StatCard title="Total Deliverables" value={myActions.length} icon={<span>✅</span>} />
        <StatCard title="Completed" value={done.length} icon={<span>🎯</span>} />
      </div>

      <section className="rounded-xl overflow-hidden"
               style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <h2 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>All Deliverables</h2>
        </div>
        <NotionTable
          results={myActions as Parameters<typeof NotionTable>[0]['results']}
          columns={['Name', 'Status', 'Due Date']}
          emptyMessage="No deliverables found for your account yet."
        />
      </section>
    </div>
  )
}
