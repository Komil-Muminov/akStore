import ExcelJS from 'exceljs'
import path from 'node:path'
import { mapHeaders } from './import.columns'

const CSV_EXTENSIONS = ['.csv', '.txt']
const SEPARATORS = [';', ',', '\t']
const BOM = '﻿'
const QUOTE = '"'

const splitLine = (line: string, separator: string) => {
  const cells: string[] = []
  let current = ''
  let quoted = false
  for (const symbol of line) {
    if (symbol === QUOTE) {
      quoted = !quoted
      continue
    }
    if (symbol === separator && !quoted) {
      cells.push(current)
      current = ''
      continue
    }
    current += symbol
  }
  cells.push(current)
  return cells.map((cell) => cell.trim())
}

const separatorOf = (line: string) =>
  SEPARATORS.reduce((best, candidate) => (line.split(candidate).length > line.split(best).length ? candidate : best), SEPARATORS[0] as string)

const csvRowsOf = async (filePath: string) => {
  const text = (await Bun.file(filePath).text()).replace(BOM, '')
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0)
  if (lines.length === 0) return []
  const separator = separatorOf(lines[0] ?? '')
  return lines.map((line) => splitLine(line, separator))
}

const sheetRowsOf = async (filePath: string) => {
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.readFile(filePath)
  const sheet = workbook.worksheets[0]
  if (!sheet) return []
  const rows: string[][] = []
  sheet.eachRow((row) => {
    const cells: string[] = []
    row.eachCell({ includeEmpty: true }, (cell) => cells.push(String(cell.value ?? '').trim()))
    rows.push(cells)
  })
  return rows
}

export const tableOf = async (filePath: string) => {
  const extension = path.extname(filePath).toLowerCase()
  const rows = CSV_EXTENSIONS.includes(extension) ? await csvRowsOf(filePath) : await sheetRowsOf(filePath)
  if (rows.length === 0) return { headers: new Map<number, string>(), body: [] }
  const [header, ...body] = rows
  return { headers: mapHeaders(header ?? []), body }
}
