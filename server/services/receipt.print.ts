import { config } from '../config'
import type { ISale } from '../types'
import { PaymentKind } from '../types'

const PAYMENT_TITLES: Record<PaymentKind, string> = {
  [PaymentKind.CASH]: 'Наличные',
  [PaymentKind.CARD]: 'Карта',
  [PaymentKind.MIXED]: 'Смешанная',
}

const LABELS = {
  receipt: 'Кассовый чек',
  cashier: 'Кассир',
  total: 'ИТОГО',
  discount: 'Скидка',
  vat: 'в т. ч. НДС',
  paid: 'Получено',
  change: 'Сдача',
  refund: 'ВОЗВРАТ',
  fiscalNumber: 'ФД',
  fiscalSign: 'ФП',
  device: 'ККМ',
  thanks: 'Спасибо за покупку!',
  tin: 'ИНН',
}

const money = (value: number) => value.toFixed(2)
const stamp = (iso: string) => new Date(iso).toLocaleString('ru-RU')

const STYLE = `
  @page { margin: 4mm; }
  body { font-family: 'Segoe UI', Arial, sans-serif; width: 72mm; margin: 0 auto; color: #000; font-size: 12px; }
  .center { text-align: center; }
  .shop { font-size: 14px; font-weight: 700; }
  .muted { color: #444; font-size: 11px; }
  .rule { border-top: 1px dashed #000; margin: 6px 0; }
  .line { display: flex; justify-content: space-between; gap: 8px; }
  .item-name { margin-top: 4px; }
  .total { font-size: 15px; font-weight: 700; }
  .refund { text-align: center; font-weight: 700; letter-spacing: 2px; }`

const itemsHtml = (sale: ISale) =>
  sale.items
    .map(
      (item) => `<div class="item-name">${item.name}</div>
      <div class="line muted"><span>${item.quantity} x ${money(item.price)}</span><span>${money(item.total)}</span></div>`,
    )
    .join('')

const fiscalHtml = (sale: ISale, qr: string) =>
  sale.fiscal === null
    ? ''
    : `<div class="rule"></div>
       <div class="line muted"><span>${LABELS.device}</span><span>${sale.fiscal.device}</span></div>
       <div class="line muted"><span>${LABELS.fiscalNumber}</span><span>${sale.fiscal.number}</span></div>
       <div class="line muted"><span>${LABELS.fiscalSign}</span><span>${sale.fiscal.sign}</span></div>
       <div class="center">${qr}</div>`

export const receiptHtml = (sale: ISale, qr: string) => `<!doctype html>
<html lang="ru"><head><meta charset="utf-8"><title>${LABELS.receipt} №${sale.number}</title><style>${STYLE}</style></head>
<body onload="window.print()">
  <div class="center shop">${config.shop.name}</div>
  <div class="center muted">${config.shop.address}</div>
  ${config.shop.tin.length > 0 ? `<div class="center muted">${LABELS.tin}: ${config.shop.tin}</div>` : ''}
  <div class="rule"></div>
  <div class="line muted"><span>${LABELS.receipt} №${sale.number}</span><span>${stamp(sale.createdAt)}</span></div>
  <div class="line muted"><span>${LABELS.cashier}</span><span>${sale.cashierName}</span></div>
  <div class="rule"></div>
  ${itemsHtml(sale)}
  <div class="rule"></div>
  ${sale.discount > 0 ? `<div class="line"><span>${LABELS.discount}</span><span>${money(sale.discount)}</span></div>` : ''}
  <div class="line total"><span>${LABELS.total}</span><span>${money(sale.total)}</span></div>
  ${sale.vatTotal > 0 ? `<div class="line muted"><span>${LABELS.vat}</span><span>${money(sale.vatTotal)}</span></div>` : ''}
  <div class="line"><span>${PAYMENT_TITLES[sale.payment]}</span><span>${money(sale.paid)}</span></div>
  ${sale.change > 0 ? `<div class="line"><span>${LABELS.change}</span><span>${money(sale.change)}</span></div>` : ''}
  ${sale.refundedAt === null ? '' : `<div class="rule"></div><div class="refund">${LABELS.refund}</div>`}
  ${fiscalHtml(sale, qr)}
  <div class="rule"></div>
  <div class="center muted">${LABELS.thanks}</div>
</body></html>`
