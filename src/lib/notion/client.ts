import { Client } from '@notionhq/client'
import { NOTION_DATABASES, type NotionDatabaseKey } from '@/types'

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type NotionFilter = Record<string, any>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type NotionSort = Record<string, any>

export async function queryDatabase(
  databaseKey: NotionDatabaseKey,
  options?: {
    filter?: NotionFilter
    sorts?: NotionSort[]
    pageSize?: number
  }
) {
  const database_id = NOTION_DATABASES[databaseKey]

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await (notion.databases as any).query({
      database_id,
      filter: options?.filter,
      sorts: options?.sorts,
      page_size: options?.pageSize ?? 50,
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return response as { results: Record<string, any>[]; has_more: boolean; next_cursor: string | null }
  } catch (error) {
    console.error(`Notion query failed for ${databaseKey}:`, error)
    return { results: [] as Record<string, unknown>[], has_more: false, next_cursor: null }
  }
}

export function extractTextValue(property: Record<string, unknown> | null | undefined): string {
  if (!property) return ''

  const prop = property as Record<string, unknown>

  if (prop.type === 'title') {
    const title = prop.title as Array<{ plain_text: string }>
    return title?.map((t) => t.plain_text).join('') ?? ''
  }
  if (prop.type === 'rich_text') {
    const text = prop.rich_text as Array<{ plain_text: string }>
    return text?.map((t) => t.plain_text).join('') ?? ''
  }
  if (prop.type === 'select') {
    const select = prop.select as { name: string } | null
    return select?.name ?? ''
  }
  if (prop.type === 'status') {
    const status = prop.status as { name: string } | null
    return status?.name ?? ''
  }
  if (prop.type === 'multi_select') {
    const multi = prop.multi_select as Array<{ name: string }>
    return multi?.map((s) => s.name).join(', ') ?? ''
  }
  if (prop.type === 'number') {
    return String(prop.number ?? '')
  }
  if (prop.type === 'date') {
    const date = prop.date as { start: string } | null
    return date?.start ?? ''
  }
  if (prop.type === 'checkbox') {
    return prop.checkbox ? 'Yes' : 'No'
  }
  if (prop.type === 'email') {
    return (prop.email as string) ?? ''
  }
  if (prop.type === 'phone_number') {
    return (prop.phone_number as string) ?? ''
  }
  if (prop.type === 'url') {
    return (prop.url as string) ?? ''
  }
  if (prop.type === 'formula') {
    const formula = prop.formula as Record<string, unknown>
    return String(formula?.string ?? formula?.number ?? formula?.boolean ?? '')
  }
  if (prop.type === 'created_time') {
    return (prop.created_time as string) ?? ''
  }
  if (prop.type === 'last_edited_time') {
    return (prop.last_edited_time as string) ?? ''
  }

  return ''
}
