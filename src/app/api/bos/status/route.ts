import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const BOS_STATE_PATH = process.env.BOS_STATE_PATH ?? '/var/bos/bos_state.json'
const BOS_LOG_PATH   = process.env.BOS_LOG_PATH   ?? '/var/bos/bos_coordinator.log'

export async function GET() {
  try {
    // Read BOS state file (mounted as Docker volume from /root/automsp-bos/)
    let state: Record<string, unknown> = {}
    let lastCycle: string | null = null
    let logTail: string[] = []

    if (fs.existsSync(BOS_STATE_PATH)) {
      const raw = fs.readFileSync(BOS_STATE_PATH, 'utf-8')
      state = JSON.parse(raw)

      // Find latest last_checked across all flows
      const timestamps = Object.values(state)
        .map((v) => (v as Record<string, string>).last_checked)
        .filter(Boolean)
      lastCycle = timestamps.sort().at(-1) ?? null
    }

    // Read last 20 lines of log
    if (fs.existsSync(BOS_LOG_PATH)) {
      const log = fs.readFileSync(BOS_LOG_PATH, 'utf-8')
      logTail = log.split('\n').filter(Boolean).slice(-20)
    }

    // Compute per-flow stats
    const flows = Object.entries(state).map(([id, val]) => {
      const v = val as Record<string, unknown>
      return {
        id,
        last_checked: v.last_checked ?? null,
        seen_count: Array.isArray(v.seen_ids) ? (v.seen_ids as unknown[]).length : 0,
      }
    })

    return NextResponse.json({
      ok: true,
      last_cycle: lastCycle,
      flows_monitored: flows.length,
      flows,
      log_tail: logTail,
      agents: [
        'bos-queen', 'sales-agent', 'marketing-agent', 'client-success-agent',
        'finance-agent', 'fulfillment-agent', 'operations-agent',
        'hiring-agent', 'leadership-agent', 'internal-agent', 'intelligence-agent',
      ],
    })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
