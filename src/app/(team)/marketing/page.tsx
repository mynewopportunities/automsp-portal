import type { Metadata } from 'next'
import { PageHeader } from '@/components/layout/page-header'
import { NotionTable } from '@/components/notion/notion-table'
import { StatCard } from '@/components/ui/stat-card'
import { queryDatabase } from '@/lib/notion/client'

export const metadata: Metadata = { title: 'Marketing' }
export const revalidate = 300

export default async function MarketingPage() {
  const [social, funnel] = await Promise.all([
    queryDatabase('socialMedia', { pageSize: 25 }),
    queryDatabase('authorityFunnel', { pageSize: 25 }),
  ])

  return (
    <div>
      <PageHeader title="Marketing" description="Social media, authority funnel, and ad creatives" />

      <div className="grid grid-cols-2 gap-4 mb-8">
        <StatCard title="Social Posts" value={social.results.length} icon={<span>📱</span>} />
        <StatCard title="Funnel Entries" value={funnel.results.length} icon={<span>📊</span>} />
      </div>

      <div className="space-y-6">
        <section className="rounded-xl overflow-hidden"
                 style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <h2 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Social Media Database</h2>
          </div>
          <NotionTable results={social.results as Parameters<typeof NotionTable>[0]['results']}
                       columns={['Name', 'Status', 'Platform', 'Date']} />
        </section>

        <section className="rounded-xl overflow-hidden"
                 style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <h2 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Authority Funnel</h2>
          </div>
          <NotionTable results={funnel.results as Parameters<typeof NotionTable>[0]['results']}
                       columns={['Name', 'Status', 'Stage', 'Date']} />
        </section>
      </div>
    </div>
  )
}
