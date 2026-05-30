'use client'

import { useEffect, useState } from 'react'

interface FlowStatus {
  id: string
  last_checked: string | null
  seen_count: number
}

interface BosStatus {
  ok: boolean
  last_cycle: string | null
  flows_monitored: number
  flows: FlowStatus[]
  agents: string[]
  log_tail?: string[]
}

const FLOW_LABELS: Record<string, string> = {
  lead_qualification: 'Sales',
  client_onboarding:  'Onboarding',
  nps_review_request: 'Client Success',
  invoice_followup:   'Finance',
  project_monitor:    'Fulfillment',
  content_publishing: 'Marketing',
}

function timeSince(iso: string | null): string {
  if (!iso) return 'never'
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (diff < 60)   return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  return `${Math.floor(diff / 3600)}h ago`
}

export function SwarmStatus() {
  const [status, setStatus] = useState<BosStatus | null>(null)
  const [error, setError]   = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    try {
      const res = await fetch('/api/bos/status')
      const data = await res.json() as BosStatus
      setStatus(data)
      setError(null)
    } catch {
      setError('BOS status unavailable')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
    const t = setInterval(load, 60_000)
    return () => clearInterval(t)
  }, [])

  if (loading) {
    return (
      <div className="rounded-xl p-5 animate-pulse" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="h-4 w-32 rounded" style={{ background: 'var(--muted)' }} />
      </div>
    )
  }

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${error ? 'bg-red-400' : 'bg-emerald-400'}`} />
            <span className={`relative inline-flex rounded-full h-2 w-2 ${error ? 'bg-red-500' : 'bg-emerald-500'}`} />
          </span>
          <h2 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
            BOS Swarm
          </h2>
        </div>
        <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
          {error ? 'offline' : `last cycle ${timeSince(status?.last_cycle ?? null)}`}
        </span>
      </div>

      {error ? (
        <div className="px-5 py-4 text-xs" style={{ color: 'var(--muted-foreground)' }}>{error}</div>
      ) : (
        <div className="p-5 space-y-4">
          {/* Swarm stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Agents', value: status?.agents.length ?? 0 },
              { label: 'Flows', value: status?.flows_monitored ?? 0 },
              { label: 'Records Seen', value: status?.flows.reduce((a, f) => a + f.seen_count, 0) ?? 0 },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-lg p-3 text-center" style={{ background: 'var(--muted)', opacity: 0.6 }}>
                <p className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>{value}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Per-flow status */}
          <div className="space-y-1.5">
            {status?.flows.map((flow) => (
              <div key={flow.id} className="flex items-center justify-between text-xs py-1.5 px-3 rounded-lg"
                   style={{ background: 'var(--muted)', opacity: 0.6 }}>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span style={{ color: 'var(--foreground)' }}>{FLOW_LABELS[flow.id] ?? flow.id}</span>
                </div>
                <div className="flex items-center gap-3" style={{ color: 'var(--muted-foreground)' }}>
                  <span>{flow.seen_count} seen</span>
                  <span>{timeSince(flow.last_checked)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Agent list */}
          <div>
            <p className="text-xs font-medium mb-2" style={{ color: 'var(--muted-foreground)' }}>ACTIVE AGENTS</p>
            <div className="flex flex-wrap gap-1.5">
              {status?.agents.map((a) => (
                <span key={a} className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(99,102,241,0.12)', color: 'rgba(99,102,241,0.9)', border: '1px solid rgba(99,102,241,0.25)' }}>
                  {a}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
