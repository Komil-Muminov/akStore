export interface ISupplier {
  id: string
  name: string
  phone: string
  note: string
  debt: number
  invoiceCount: number
}

export interface ISupplierInput {
  name: string
  phone: string
  note: string
}

export interface IInvoiceItem {
  id: string
  productId: string
  name: string
  quantity: number
  costPrice: number
  total: number
}

export interface IInvoice {
  id: string
  number: number
  supplierId: string
  supplierName: string
  outletName: string
  authorName: string
  total: number
  paid: number
  note: string
  createdAt: string
  items: IInvoiceItem[]
}

export interface IInvoiceLine {
  productId: string
  name: string
  quantity: number
  costPrice: number
}

export const EMPTY_SUPPLIER: ISupplierInput = { name: '', phone: '', note: '' }

export const invoiceTotalOf = (lines: IInvoiceLine[]) =>
  Math.round(lines.reduce((sum, line) => sum + line.quantity * line.costPrice, 0) * 100) / 100
