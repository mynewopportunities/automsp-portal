import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/layout/page-header'
import { NotionTable } from '@/components/notion/notion-table'
import { StatCard } from '@/components/ui/stat-card'
import { queryDatabase } from '@/lib/notion/client'
import { filterByClient } from '@/lib/notion/filter-by-client'

export const metadata: Metadata = { title: 'Wins & Results' }
export const revalidate = 300

export default async function ClientWinsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, client_notion_name')
    .eq('id', user!.id)
    .single()

  const [allWins, allCaseStudies] = await Promise.all([
    queryDatabase('wins', { pageSize: 100 }),
    queryDatabase('caseStudies', { pageSize: 100 }),
  ])

  const clientName = profile?.client_notion_name ?? profile?.full_name ?? ''
  const myWins = filterByClient(allWins.results, clientName)
  const myCaseStudies = filterByClient(allCaseStudies.results, clientName)

  return (
    <div>
      <PageHeader title="Wins & Results" description="Celebrating your automation wins and results" />

      <div className="grid grid-cols-2 gap-4 mb-8">
        <StatCard title="Wins" value={myWins.length} icon={<span>🏆</span>} />
        <StatCard title="Case Studies" value={myCaseStudies.length} icon={<span>📖</span>} />
      </div>

      <div className="space-y-6">
        <section className="rounded-xl overflow-hidden"
                 style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <h2 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Wins</h2>
          </div>
          <NotionTable
            results={myWins as Parameters<typeof NotionTable>[0]['results']}
            columns={['Name', 'Status', 'Date']}
            emptyMessage="No wins recorded yet — they're coming!"
          />
        </section>

        <section className="rounded-xl overflow-hidden"
                 style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <h2 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Case Studies</h2>
          </div>
          <NotionTable
            results={myCaseStudies as Parameters<typeof NotionTable>[0]['results']}
            columns={['Name', 'Status', 'Date']}
            emptyMessage="No case studies published yet."
          />
        </section>
      </div>
    </div>
  )
}
