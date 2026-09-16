export enum PassStatus {
  ACTIVE = 'active',
  REVOKED = 'revoked',
}

export enum PassFilter {
  ALL = 'all',
  ACTIVE = 'active',
  REVOKED = 'revoked',
}

export interface IPass {
  id: string
  holderName: string
  status: PassStatus
  createdAt: string
}

export interface ICreatePassDto {
  holderName: string
}

export const PASS_HOLDER_MIN_LENGTH = 2
export const PASS_HOLDER_MAX_LENGTH = 120

export const PASS_STATUS_LABELS: Record<PassStatus, string> = {
  [PassStatus.ACTIVE]: 'Активен',
  [PassStatus.REVOKED]: 'Отозван',
}
