export enum EntryDirection {
  IN = 'in',
  OUT = 'out',
}

export interface IPassEntry {
  id: string
  passId: string
  passCode: string
  holderName: string
  direction: EntryDirection
  guardName: string
  happenedAt: string
}

export interface IPassEntryRow {
  id: string
  pass_id: string
  pass_code: string
  holder_name: string
  direction: EntryDirection
  guard_name: string | null
  happened_at: Date
}

export interface IOnSite {
  passId: string
  passCode: string
  holderName: string
  organization: string
  hostName: string
  enteredAt: string
}

export interface IOnSiteRow {
  pass_id: string
  pass_code: string
  holder_name: string
  organization: string
  host_name: string
  entered_at: Date
}

export interface IEntriesParams {
  from?: string
  to?: string
  limit?: number
}
