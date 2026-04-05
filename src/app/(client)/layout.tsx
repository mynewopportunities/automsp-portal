import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ClientSidebar } from '@/components/layout/client-sidebar'

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .single()

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--background)' }}>
      <ClientSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center justify-between px-6 py-4 flex-shrink-0"
                style={{ borderBottom: '1px solid var(--border)', background: 'var(--card)' }}>
          <p className="text-xs font-medium px-2 py-1 rounded-md"
             style={{ background: 'rgba(99,102,241,0.12)', color: '#818cf8' }}>
            Client Portal
          </p>
          <div className="flex items-center gap-3">
            <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              {profile?.full_name ?? user.email}
            </span>
            <div className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold"
                 style={{ background: 'rgba(99,102,241,0.2)', color: '#818cf8' }}>
              {(profile?.full_name ?? user.email ?? 'C').slice(0, 2).toUpperCase()}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
