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
  ISaleRecord,
  ISaleItemRecord,
  IFiscalReceipt,
  IFiscalStamp,
  IFiscalTaskRow,
} from './sales'
export type { IParkedLine, IParkedSale, IParkedSaleRow } from './parked'
export { CashMoveKind } from './cash'
export type {
  ICashMove,
  ICashMoveRow,
  IDebtor,
  IDebtorRow,
  IDebtMove,
  IDebtMoveRow,
  IDebtorInput,
} from './cash'
export type {
  IReportParams,
  IPageParams,
  IReportSummary,
  IReportSummaryRow,
  ITopProduct,
  ITopProductRow,
  ICashierStat,
  ICashierStatRow,
  IDailyPoint,
  IDailyPointRow,
  IExportFile,
  IZReport,
} from './reports'
export { ImportAction } from './import'
export type { IImportRow, IImportValues, IImportPreview, IImportResult } from './import'
export type {
  IOutlet,
  IOutletRow,
  IOutletInput,
  ITransferInput,
  IOutletStock,
  IOutletStockRow,
} from './outlets'
export type {
  ISupplier,
  ISupplierRow,
  ISupplierInput,
  IInvoice,
  IInvoiceRow,
  IInvoiceItem,
  IInvoiceItemRow,
  IInvoiceInput,
  IInvoiceItemInput,
} from './suppliers'
export { UnitType } from './org'
export type { IPosition, IPositionRow, IPositionInput, IUnit, IUnitRow, IUnitInput } from './org'

declare module 'express-serve-static-core' {
  interface Request {
    user?: import('./auth').IAuthUser
  }
}
