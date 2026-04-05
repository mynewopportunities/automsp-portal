export type UserRole = 'admin' | 'team' | 'client'

export interface UserProfile {
  id: string
  email: string
  full_name: string
  role: UserRole
  team_section?: TeamSection
  client_id?: string
  avatar_url?: string
  created_at: string
}

export type TeamSection =
  | 'sales'
  | 'fulfillment'
  | 'marketing'
  | 'client-success'
  | 'finances'
  | 'hiring'
  | 'operations'
  | 'leadership'

export interface NavItem {
  title: string
  href: string
  icon: string
  section?: TeamSection
  badge?: string
}

// Notion database row (generic)
export interface NotionRow {
  id: string
  url: string
  properties: Record<string, NotionProperty>
}

export type NotionPropertyType =
  | 'title'
  | 'rich_text'
  | 'number'
  | 'select'
  | 'multi_select'
  | 'date'
  | 'checkbox'
  | 'url'
  | 'email'
  | 'phone_number'
  | 'status'
  | 'people'
  | 'files'
  | 'relation'
  | 'formula'
  | 'rollup'
  | 'created_time'
  | 'last_edited_time'

export interface NotionProperty {
  id: string
  type: NotionPropertyType
  value: string | number | boolean | string[] | null
}

// Notion database IDs mapped from the Map page
export const NOTION_DATABASES = {
  // INTERNAL
  clients: 'f0c9a6b3967f83769af881ca4a4c0d42',
  agencyTeam: '2f69a6b3967f8308b52f017bc5f0c0c8',
  calendarLinks: '7449a6b3967f82e293b0814ac8a11832',
  sopLibrary: '70c9a6b3967f8327bc6e8161b32b9997',
  offerings: '8159a6b3967f82cb833901d4ac521323',

  // SALES
  leads: '7929a6b3967f8352ae4d01e82385551f',
  salesCalls: 'ed19a6b3967f8228a6f881a2e8f85b9a',
  paymentLinks: 'e589a6b3967f8395b4ac810c6259154b',
  salesAssets: 'b199a6b3967f83238d9001ce9ce976b4',
  reactivationList: 'bce9a6b3967f8233924901941a912147',
  momentumActivity: 'bc49a6b3967f83389329814716853f7b',
  salesIntakeForm: 'a709a6b3967f82b387c10133064d91fc',
  commissionCloser: '9ff9a6b3967f82eb9ca981a252de67b8',
  commissionSetter: '0bc9a6b3967f82ed9935818159d037b6',

  // LEADERSHIP
  leadershipMeetings: '5a89a6b3967f838ea1af81ac11e00c19',
  contracts: '1a79a6b3967f8287a0a681e7b8d5a595',
  financeLegal: '6239a6b3967f8205b47c01f585b495b6',

  // MARKETING
  socialMedia: '92b9a6b3967f8285b93a815412e8ae8e',
  authorityFunnel: 'a539a6b3967f832083a9016ac970c8b7',
  adCreatives: 'bc99a6b3967f82cb862a814b8bc90be7',

  // CLIENT SUCCESS
  surveys: '6f89a6b3967f829ead58815a08831d81',
  caseStudies: '63e9a6b3967f833188ad0115fcedc71e',
  wins: 'd679a6b3967f82d7b6e101bee7d38afb',
  npsForm: '91d9a6b3967f825ebacb8155656216fb',

  // FINANCES
  payments: '8489a6b3967f821381ab011b558033da',
  invoices: 'b719a6b3967f829986480115406a9466',
  subscriptions: 'fad9a6b3967f839eb44281a172c474c3',

  // FULFILLMENT
  projects: '4a99a6b3967f838399f581da20801ba8',
  actions: '3e59a6b3967f82eba0ae81c6e7a73897',
  fulfillmentTemplates: '2c29a6b3967f8252925201eefae7ac9e',
  videoEditorGuide: '8ac9a6b3967f83aba9358110c69fd031',

  // OBJECTIVES
  objectives: '1f59a6b3967f82f0879e813c55ae1915',
  objectiveActions: 'f1b9a6b3967f827eae040159377cd6ae',

  // OPERATIONS
  onboardingForm: 'b6e9a6b3967f8396b1a90101cdbaf164',
  automations: 'fe39a6b3967f82ff933801042e1de37f',

  // HIRING
  roleBlueprints: '33f9a6b3967f8293827081dfff698a5c',
  dailyWinningFormula: '62c9a6b3967f82cda8cc81e7ddd89d20',
  jobInterviews: 'b669a6b3967f83dbb5dd01c15e103b48',
  onboardingPresentations: '2239a6b3967f8223a81b010396545f6b',
  teamOnboarding: '20f9a6b3967f83e09c6101e49d84fd27',
  jobPostings: 'cd39a6b3967f82018712013659393969',
  clientSuccessIntake: '4ab9a6b3967f83ca953d81b87a5b46e1',

  // EOD FORMS
  eodForms: '76d9a6b3967f821bb6cb014825ee9d92',
} as const

export type NotionDatabaseKey = keyof typeof NOTION_DATABASES
