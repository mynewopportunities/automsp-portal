import { NextRequest, NextResponse } from 'next/server'

const N8N_BASE = process.env.N8N_BASE ?? 'https://n8n.automsp.us'

const FLOW_WEBHOOKS: Record<string, string> = {
  lead_qualification: 'ruflo-lead-qualify',
  client_onboarding:  'send-document',
  nps_review_request: 'ruflo-review-request',
  invoice_followup:   'ruflo-invoice-followup',
  project_monitor:    'ruflo-project-monitor',
  content_publishing: 'content-multiplier',
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { flow_id: string; payload?: Record<string, unknown> }
    const { flow_id, payload = {} } = body

    const webhookPath = FLOW_WEBHOOKS[flow_id]
    if (!webhookPath) {
      return NextResponse.json({ ok: false, error: `Unknown flow: ${flow_id}` }, { status: 400 })
    }

    const res = await fetch(`${N8N_BASE}/webhook/${webhookPath}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source:       'automsp_portal_manual',
        flow:         flow_id,
        triggered_at: new Date().toISOString(),
        _bos_version: '3.0',
        data:         payload,
      }),
    })

    return NextResponse.json({
      ok:           res.ok,
      status:       res.status,
      flow_id,
      webhook_path: webhookPath,
      triggered_at: new Date().toISOString(),
    })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
