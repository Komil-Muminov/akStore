export enum CashMoveKind {
  IN = 'in',
  OUT = 'out',
}

export interface ICashMove {
  id: string
  kind: CashMoveKind
  amount: number
  note: string
  authorName: string
  createdAt: string
}

export interface IDebtor {
  id: string
  name: string
  phone: string
  note: string
  balance: number
  lastMoveAt: string | null
}

export interface IDebtMove {
  id: string
  debtorId: string
  saleId: string | null
  amount: number
  note: string
  authorName: string
  createdAt: string
}

export interface IDebtorCard {
  debtor: IDebtor
  moves: IDebtMove[]
}

export interface IDebtorInput {
  name: string
  phone: string
  note: string
}

export const CASH_MOVE_LABELS: Record<CashMoveKind, string> = {
  [CashMoveKind.IN]: 'Внесение',
  [CashMoveKind.OUT]: 'Изъятие',
}

export const EMPTY_DEBTOR: IDebtorInput = { name: '', phone: '', note: '' }
