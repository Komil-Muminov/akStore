import ExcelJS from 'exceljs'
import { PassStatus, type IPass, type IReportSummary } from '../types'

const STATUS_LABELS: Record<PassStatus, string> = {
  [PassStatus.ACTIVE]: 'Активен',
  [PassStatus.REVOKED]: 'Отозван',
}
const DATE_FORMAT = 'dd.mm.yyyy hh:mm'
const HEADER_FILL = 'FFE2E8F0'

const styleHeader = (sheet: ExcelJS.Worksheet) => {
  const header = sheet.getRow(1)
  header.font = { bold: true }
  header.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: HEADER_FILL } }
}

const addSummarySheet = (workbook: ExcelJS.Workbook, summary: IReportSummary) => {
  const sheet = workbook.addWorksheet('Сводка')
  sheet.columns = [
    { header: 'Показатель', key: 'label', width: 36 },
    { header: 'Значение', key: 'value', width: 18 },
  ]
  sheet.addRows([
    { label: 'Период', value: `${summary.from} — ${summary.to}` },
    { label: 'Выдано пропусков', value: summary.issued },
    { label: 'Активных', value: summary.active },
    { label: 'Отозвано', value: summary.revoked },
    { label: 'Уникальных посетителей', value: summary.uniqueHolders },
  ])
  sheet.addRow({})
  sheet.addRow({ label: 'По дням', value: 'Выдано / Отозвано' })
  summary.byDay.forEach((day) => sheet.addRow({ label: day.date, value: `${day.issued} / ${day.revoked}` }))
  sheet.addRow({})
  sheet.addRow({ label: 'К кому чаще всего', value: 'Пропусков' })
  summary.topHosts.forEach((host) => sheet.addRow({ label: host.hostName, value: host.count }))
  styleHeader(sheet)
}

const addPassesSheet = (workbook: ExcelJS.Workbook, passes: IPass[]) => {
  const sheet = workbook.addWorksheet('Пропуска')
  sheet.columns = [
    { header: 'Выдан', key: 'createdAt', width: 18, style: { numFmt: DATE_FORMAT } },
    { header: 'Посетитель', key: 'holderName', width: 30 },
    { header: 'К кому', key: 'hostName', width: 44 },
    { header: 'Организация', key: 'organization', width: 24 },
    { header: 'Цель визита', key: 'purpose', width: 24 },
    { header: 'Телефон', key: 'phone', width: 16 },
    { header: 'Госномер', key: 'carPlate', width: 12 },
    { header: 'Статус', key: 'status', width: 12 },
  ]
  passes.forEach((pass) =>
    sheet.addRow({
      createdAt: new Date(pass.createdAt),
      holderName: pass.holderName,
      hostName: pass.hostName,
      organization: pass.organization,
      purpose: pass.purpose,
      phone: pass.phone,
      carPlate: pass.carPlate,
      status: STATUS_LABELS[pass.status],
    }),
  )
  sheet.autoFilter = { from: 'A1', to: 'H1' }
  sheet.views = [{ state: 'frozen', ySplit: 1 }]
  styleHeader(sheet)
}

export const buildReportWorkbook = async (summary: IReportSummary, passes: IPass[]) => {
  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'gatePass'
  addSummarySheet(workbook, summary)
  addPassesSheet(workbook, passes)
  const buffer = await workbook.xlsx.writeBuffer()
  return Buffer.from(buffer as ArrayBuffer)
}
