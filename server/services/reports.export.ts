import type { ISale } from '../types'
import { PaymentKind } from '../types'

const HEADER = ['Чек', 'Дата', 'Кассир', 'Оплата', 'Позиций', 'Сумма', 'Скидка', 'НДС', 'Фискальный номер', 'Статус']
const SEPARATOR = ';'
const LINE_BREAK = '\r\n'
const BOM = '﻿'
const REFUNDED = 'Возврат'
const ACTIVE = 'Продажа'
const FILE_PREFIX = 'otchet-prodazh'

const PAYMENT_TITLES: Record<PaymentKind, string> = {
  [PaymentKind.CASH]: 'Наличные',
  [PaymentKind.CARD]: 'Карта',
  [PaymentKind.MIXED]: 'Смешанная',
}

const cell = (value: string | number) => {
  const text = String(value)
  return text.includes(SEPARATOR) || text.includes('"') ? `"${text.replace(/"/g, '""')}"` : text
}

const rowOf = (sale: ISale) =>
  [
    sale.number,
    new Date(sale.createdAt).toLocaleString('ru-RU'),
    sale.cashierName,
    PAYMENT_TITLES[sale.payment],
    sale.items.length,
    sale.total.toFixed(2),
    sale.discount.toFixed(2),
    sale.vatTotal.toFixed(2),
    sale.fiscal?.number ?? '',
    sale.refundedAt === null ? ACTIVE : REFUNDED,
  ]
    .map(cell)
    .join(SEPARATOR)

export const csvOf = (sales: ISale[]) => {
  const lines = [HEADER.join(SEPARATOR), ...sales.map(rowOf)]
  return {
    fileName: `${FILE_PREFIX}-${new Date().toISOString().slice(0, 10)}.csv`,
    content: `${BOM}${lines.join(LINE_BREAK)}`,
  }
}
