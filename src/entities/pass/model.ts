export enum PassStatus {
  ACTIVE = 'active',
  REVOKED = 'revoked',
}

export enum PassFilter {
  ALL = 'all',
  ACTIVE = 'active',
  REVOKED = 'revoked',
}

export interface IPassInput {
  holderName: string
  hostName: string
  organization: string
  purpose: string
  phone: string
  carPlate: string
}

export interface IPass extends IPassInput {
  id: string
  status: PassStatus
  createdAt: string
  updatedAt: string
}

export type TPassField = keyof IPassInput
export type TPassErrors = Partial<Record<TPassField, string>>

export const PASS_NAME_MIN_LENGTH = 2
export const PASS_NAME_MAX_LENGTH = 120

export const PASS_STATUS_LABELS: Record<PassStatus, string> = {
  [PassStatus.ACTIVE]: 'Активен',
  [PassStatus.REVOKED]: 'Отозван',
}

export const PASS_FIELD_LABELS: Record<TPassField, string> = {
  holderName: 'Посетитель',
  hostName: 'К кому',
  organization: 'Организация',
  purpose: 'Цель визита',
  phone: 'Телефон',
  carPlate: 'Госномер авто',
}

export const EMPTY_PASS_INPUT: IPassInput = {
  holderName: '',
  hostName: '',
  organization: '',
  purpose: '',
  phone: '',
  carPlate: '',
}
