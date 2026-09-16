export enum PassStatus {
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
