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

export interface ICashMoveRow {
  id: string
  kind: CashMoveKind
  amount: string
  note: string
  author_name: string | null
  created_at: Date
}

export interface IDebtor {
  id: string
  name: string
  phone: string
  note: string
  creditLimit: number
  balance: number
  lastMoveAt: string | null
}

export interface IDebtorRow {
  id: string
  name: string
  phone: string
  note: string
  credit_limit: string
  balance: string
  last_move_at: Date | null
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

export interface IDebtMoveRow {
  id: string
  debtor_id: string
  sale_id: string | null
  amount: string
  note: string
  author_name: string | null
  created_at: Date
}

export interface IDebtorInput {
  name: string
  phone: string
  note: string
  creditLimit: number
}
