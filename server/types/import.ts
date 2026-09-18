import type { ProductUnit } from './retail'

export enum ImportAction {
  CREATE = 'create',
  UPDATE = 'update',
  FAILED = 'failed',
}

export interface IImportValues {
  barcode: string
  name: string
  category: string
  unit: ProductUnit
  costPrice: number
  salePrice: number
  vatRate: number
  markCode: string
  stock: number
}

export interface IImportRow {
  line: number
  action: ImportAction
  error: string
  values: IImportValues
}

export interface IImportPreview {
  fileName: string
  rows: IImportRow[]
  total: number
  toCreate: number
  toUpdate: number
  failed: number
}

export interface IImportResult {
  created: number
  updated: number
  failed: number
  stocked: number
}
