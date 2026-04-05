import { Badge, statusVariant } from '@/components/ui/badge'
import { formatDate, truncate } from '@/lib/utils'
import { extractTextValue } from '@/lib/notion/client'

interface NotionTableProps {
  results: Array<{ id: string; url: string; properties: Record<string, unknown> }>
  columns: string[]
  emptyMessage?: string
}

export function NotionTable({ results, columns, emptyMessage = 'No records found.' }: NotionTableProps) {
  if (!results.length) {
    return (
      <div className="flex items-center justify-center py-12 text-sm" style={{ color: 'var(--muted-foreground)' }}>
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)' }}>
            {columns.map((col) => (
              <th key={col} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: 'var(--muted-foreground)' }}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {results.map((row) => {
            const props = row.properties as Record<string, Record<string, unknown>>
            return (
              <tr key={row.id}
                  className="transition-colors hover:bg-[rgba(99,102,241,0.04)]"
                  style={{ borderBottom: '1px solid var(--border)' }}>
                {columns.map((col) => {
                  const prop = props[col]
                  const val = prop ? extractTextValue(prop) : ''
                  const isStatus = prop?.type === 'status' || prop?.type === 'select'

                  return (
                    <td key={col} className="px-4 py-3" style={{ color: 'var(--foreground)' }}>
                      {isStatus && val ? (
                        <Badge variant={statusVariant(val)}>{val}</Badge>
                      ) : prop?.type === 'date' ? (
                        <span style={{ color: 'var(--muted-foreground)' }}>{formatDate(val)}</span>
                      ) : (
                        <span>{truncate(val, 60)}</span>
                      )}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
