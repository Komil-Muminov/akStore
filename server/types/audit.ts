export enum AuditAction {
  PRODUCT_ARCHIVE = 'product-archive',
  PRODUCT_PRICE = 'product-price',
  SALE_REFUND = 'sale-refund',
  CASH_OUT = 'cash-out',
  CATEGORY_DELETE = 'category-delete',
  SUPPLIER_ARCHIVE = 'supplier-archive',
  OUTLET_ARCHIVE = 'outlet-archive',
  DEBTOR_ARCHIVE = 'debtor-archive',
  IMPORT_APPLY = 'import-apply',
  SHIFT_CLOSE = 'shift-close',
}

export interface IAuditEntry {
  id: string
  actorName: string
  action: AuditAction
  entity: string
  entityId: string
  details: string
  createdAt: string
}

export interface IAuditRow {
  id: string
  actor_name: string | null
  action: AuditAction
  entity: string
  entity_id: string
  details: string
  created_at: Date
}

export interface IAuditParams {
  action: string
  actorId: string | null
  from: string | null
  to: string | null
}
