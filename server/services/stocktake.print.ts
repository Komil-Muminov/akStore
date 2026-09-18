import { config } from '../config'

const TITLE = 'Ведомость пересчёта'
const HEADERS = ['№', 'Штрихкод', 'Товар', 'Ед', 'Учёт', 'Факт']

interface ISheetLine {
  name: string
  barcode: string
  unit: string
  stock: number
}

const UNIT_TITLES: Record<string, string> = { piece: 'шт', kilogram: 'кг' }

const STYLE = `
  @page { margin: 10mm; }
  body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; color: #000; font-size: 12px; }
  h1 { font-size: 16px; margin: 0 0 2px; }
  .sub { color: #555; font-size: 11px; margin-bottom: 12px; }
  table { border-collapse: collapse; width: 100%; }
  th, td { border: 1px solid #999; padding: 4px 6px; text-align: left; }
  th { background: #eee; font-size: 11px; }
  td.num { text-align: right; width: 64px; }
  td.fact { width: 84px; }
  tr { page-break-inside: avoid; }`

const rowHtml = (line: ISheetLine, index: number) => `
  <tr>
    <td>${index + 1}</td>
    <td>${line.barcode}</td>
    <td>${line.name}</td>
    <td>${UNIT_TITLES[line.unit] ?? ''}</td>
    <td class="num">${line.stock}</td>
    <td class="fact"></td>
  </tr>`

export const stocktakeHtml = (lines: ISheetLine[], outletName: string) => `<!doctype html>
<html lang="ru"><head><meta charset="utf-8"><title>${TITLE}</title><style>${STYLE}</style></head>
<body onload="window.print()">
  <h1>${TITLE}</h1>
  <div class="sub">${config.shop.name}${outletName ? ` · ${outletName}` : ''} · ${new Date().toLocaleDateString('ru-RU')}</div>
  <table>
    <thead><tr>${HEADERS.map((header) => `<th>${header}</th>`).join('')}</tr></thead>
    <tbody>${lines.map(rowHtml).join('')}</tbody>
  </table>
</body></html>`
