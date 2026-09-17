import type { IPass } from '@/entities/pass'

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

export interface IOnSite {
  passId: string
  passCode: string
  holderName: string
  organization: string
  hostName: string
  enteredAt: string
}

export interface IFoundPass {
  pass: IPass
  inside: boolean
}

export const DIRECTION_LABELS: Record<EntryDirection, string> = {
  [EntryDirection.IN]: 'Вход',
  [EntryDirection.OUT]: 'Выход',
}

export const ON_SITE_EMPTY = 'На территории никого нет'
