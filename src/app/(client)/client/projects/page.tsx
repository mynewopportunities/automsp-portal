import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/layout/page-header'
import { NotionTable } from '@/components/notion/notion-table'
import { StatCard } from '@/components/ui/stat-card'
import { queryDatabase } from '@/lib/notion/client'
import { filterByClient, filterByStatus } from '@/lib/notion/filter-by-client'

export const metadata: Metadata = { title: 'My Projects' }
export const revalidate = 120

export default async function ClientProjectsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, client_notion_name')
    .eq('id', user!.id)
    .single()

  const allProjects = await queryDatabase('projects', { pageSize: 100 })
  const clientName = profile?.client_notion_name ?? profile?.full_name ?? ''
  const myProjects = filterByClient(allProjects.results, clientName)
  const active = filterByStatus(myProjects, ['active', 'in progress', 'live'])

  return (
    <div>
      <PageHeader
        title="My Projects"
        description={`Welcome back${profile?.full_name ? `, ${profile.full_name}` : ''}. Here are your active projects.`}
      />

      <div className="grid grid-cols-2 gap-4 mb-8">
        <StatCard title="Total Projects" value={myProjects.length} icon={<span>📁</span>} />
        <StatCard title="Active" value={active.length} icon={<span>🚀</span>} />
      </div>

      <section className="rounded-xl overflow-hidden"
               style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <h2 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>All Projects</h2>
        </div>
        <NotionTable
          results={myProjects as Parameters<typeof NotionTable>[0]['results']}
          columns={['Name', 'Status', 'Due Date']}
          emptyMessage="No projects found for your account yet."
        />
      </section>
    </div>
  )
}
