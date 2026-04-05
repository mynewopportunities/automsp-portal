import { extractTextValue } from './client'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type NotionResult = Record<string, any>

function getProperties(r: NotionResult): Record<string, Record<string, unknown>> {
  return (r.properties ?? {}) as Record<string, Record<string, unknown>>
}

export function filterByClient(results: NotionResult[], clientName: string): NotionResult[] {
  if (!clientName) return results
  return results.filter((r) => {
    const props = getProperties(r)
    const clientProp = props['Client'] ?? props['client']
    return extractTextValue(clientProp).toLowerCase().includes(clientName.toLowerCase())
  })
}

export function filterByStatus(results: NotionResult[], statuses: string[]): NotionResult[] {
  return results.filter((r) => {
    const props = getProperties(r)
    const s = extractTextValue(props['Status'] ?? props['status']).toLowerCase()
    return statuses.includes(s)
  })
}
