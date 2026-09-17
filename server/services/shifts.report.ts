import type { IReportSummary, IShift, IShiftTotals, IZReport } from '../types'

const TITLE = 'Z-отчёт по смене'
const LABELS = {
  shift: 'Смена',
  cashier: 'Кассир',
  opened: 'Открыта',
  closed: 'Закрыта',
  openingCash: 'Наличные на начало',
  closingCash: 'Наличные на конец',
  expectedCash: 'Ожидаемые наличные',
  salesCount: 'Чеков',
  cash: 'Оплата наличными',
  card: 'Оплата картой',
  revenue: 'Выручка',
  profit: 'Прибыль',
  vat: 'НДС',
  refunds: 'Возвраты',
  fiscalNumber: 'Фискальный номер отчёта',
  fiscalDevice: 'Регистратор',
  note: 'Примечание',
}

const money = (value: number) => `${value.toFixed(2)}`
const stamp = (iso: string | null) => (iso === null ? '—' : new Date(iso).toLocaleString('ru-RU'))

const line = (label: string, value: string) => `<tr><td>${label}</td><td class="value">${value}</td></tr>`

const STYLE = `
  body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 24px; color: #0f172a; }
  h1 { font-size: 18px; margin: 0 0 4px; }
  .sub { color: #64748b; font-size: 12px; margin-bottom: 16px; }
  table { border-collapse: collapse; width: 320px; font-size: 13px; }
  td { padding: 6px 0; border-bottom: 1px dashed #cbd5f5; }
  td.value { text-align: right; font-weight: 600; }
  .total td { border-bottom: none; font-size: 15px; padding-top: 12px; }`

export const zReportHtml = (
  shift: IShift,
  totals: IShiftTotals,
  summary: IReportSummary,
  fiscal: IZReport | null,
) => `<!doctype html>
<html lang="ru"><head><meta charset="utf-8"><title>${TITLE} №${shift.number}</title><style>${STYLE}</style></head>
<body>
  <h1>${TITLE} №${shift.number}</h1>
  <div class="sub">${LABELS.cashier}: ${shift.cashierName}</div>
  <table>
    ${line(LABELS.opened, stamp(shift.openedAt))}
    ${line(LABELS.closed, stamp(shift.closedAt))}
    ${line(LABELS.salesCount, String(totals.salesCount))}
    ${line(LABELS.cash, money(totals.cashTotal))}
    ${line(LABELS.card, money(totals.cardTotal))}
    ${line(LABELS.refunds, money(totals.refundTotal))}
    ${line(LABELS.vat, money(summary.vatTotal))}
    ${line(LABELS.openingCash, money(shift.openingCash))}
    ${line(LABELS.closingCash, shift.closingCash === null ? '—' : money(shift.closingCash))}
    ${line(LABELS.expectedCash, money(totals.expectedCash))}
    ${fiscal === null ? '' : line(LABELS.fiscalNumber, fiscal.number)}
    ${fiscal === null ? '' : line(LABELS.fiscalDevice, fiscal.device)}
    ${shift.note.length === 0 ? '' : line(LABELS.note, shift.note)}
    <tr class="total">${`<td>${LABELS.revenue}</td><td class="value">${money(summary.revenue)}</td>`}</tr>
    <tr class="total">${`<td>${LABELS.profit}</td><td class="value">${money(summary.profit)}</td>`}</tr>
  </table>
</body></html>`
