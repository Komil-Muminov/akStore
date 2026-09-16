export interface IPosition {
  id: string
  name: string
  rank?: number
}

export interface IPositionInput {
  name: string
  rank?: number
}

export const POSITION_DEFAULT_RANK = 100
export const POSITION_NAME_MIN_LENGTH = 2
