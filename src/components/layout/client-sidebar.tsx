'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const NAV = [
  { label: 'My Projects',     href: '/client/projects',     icon: '🗂️' },
  { label: 'Deliverables',    href: '/client/deliverables', icon: '✅' },
  { label: 'Invoices',        href: '/client/invoices',     icon: '🧾' },
  { label: 'Wins & Results',  href: '/client/wins',         icon: '🏆' },
]

export function ClientSidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-56 flex-col"
           style={{ background: 'var(--sidebar-bg)', borderRight: '1px solid var(--sidebar-border)' }}>
      <div className="flex items-center gap-3 px-4 py-5" style={{ borderBottom: '1px solid var(--sidebar-border)' }}>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg text-base"
             style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)' }}>
          🤖
        </div>
        <div>
          <p className="text-sm font-bold leading-none" style={{ color: 'var(--foreground)' }}>AutoMSP</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Client Portal</p>
        </div>
      </div>

      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {NAV.map(({ label, href, icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link key={href} href={href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                    active ? 'nav-item-active' : 'hover:bg-[rgba(99,102,241,0.06)]'
                  )}
                  style={active ? {} : { color: 'var(--muted-foreground)' }}>
              <span className="text-base">{icon}</span>
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-3" style={{ borderTop: '1px solid var(--sidebar-border)' }}>
        <form action="/api/auth/signout" method="POST">
          <button type="submit"
                  className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-[rgba(248,113,113,0.08)]"
                  style={{ color: 'var(--muted-foreground)' }}>
            <span>↩</span> Sign out
          </button>
        </form>
      </div>
    </aside>
  )
}
