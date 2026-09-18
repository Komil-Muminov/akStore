export interface ISupplier {
  id: string
  name: string
  phone: string
  note: string
  debt: number
  invoiceCount: number
}

export interface ISupplierRow {
  id: string
  name: string
  phone: string
  note: string
  debt: string
  invoice_count: string
}

export interface ISupplierInput {
  name: string
  phone: string
  note: string
}

export interface IInvoiceItemInput {
  productId: string
  quantity: number
  costPrice: number
}

export interface IInvoiceInput {
  supplierId: string
  paid: number
  note: string
  items: IInvoiceItemInput[]
}

export interface IInvoiceItem {
  id: string
  productId: string
  name: string
  quantity: number
  costPrice: number
  total: number
}

export interface IInvoiceItemRow {
  id: string
  invoice_id: string
  product_id: string
  name: string
  quantity: string
  cost_price: string
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

export interface IInvoiceRow {
  id: string
  number: number
  supplier_id: string
  supplier_name: string
  outlet_name: string | null
  author_name: string | null
  total: string
  paid: string
  note: string
  created_at: Date
}
