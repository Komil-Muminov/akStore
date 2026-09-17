export interface IPagedResult<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export { UserRole, ROLE_RANK } from './auth'
export type { IAuthUser, IUser, IUserRow, IUserInput, ITokenPayload, IUserSearchParams } from './auth'
export { ConversationKind } from './chat'
export type { IConversation, IConversationRow, IMessage, IMessageRow, IMember, IMemberRow, IGroupInput, IAttachment, IColleague, IColleagueRow } from './chat'
export { ProductUnit, StockMoveKind } from './retail'
export type {
  IProduct,
  IProductInput,
  IProductRow,
  ICategory,
  ICategoryRow,
  IStockMove,
  IStockMoveRow,
  IStockInput,
  IProductSearchParams,
} from './retail'
export { PaymentKind } from './sales'
export type {
  IShift,
  IShiftRow,
  IShiftTotals,
  IShiftTotalsRow,
  ISale,
  ISaleRow,
  ISaleItem,
  ISaleItemRow,
  ISaleInput,
  ISaleItemInput,
  ISalesParams,
} from './sales'
export { UnitType } from './org'
export type { IPosition, IPositionRow, IPositionInput, IUnit, IUnitRow, IUnitInput } from './org'

declare module 'express-serve-static-core' {
  interface Request {
    user?: import('./auth').IAuthUser
  }
}
