import { StockMoveKind } from '@/entities/product'
import { theme } from '@/shared/config'
import type { TIconName } from '@/shared/ui'

export const COUNT_LABEL = 'Инвентаризация'
export const COUNT_TOOLTIP = 'Пересчёт остатков ведомостью'
export const TRANSFER_LABEL = 'Перемещение'
export const TRANSFER_TOOLTIP = 'Перемещение товара между точками'
export const TITLE = 'Склад'
export const DESCRIPTION = 'Приход, списания, перемещения и продажи'
export const EMPTY_TITLE = 'Движений пока нет'
export const EMPTY_HINT = 'Оформите приход товара в разделе «Товары»'
export const ESTIMATED_ROW_HEIGHT = 64

const ICONS: Record<StockMoveKind, TIconName> = {
  [StockMoveKind.INCOME]: 'download',
  [StockMoveKind.WRITE_OFF]: 'trash',
  [StockMoveKind.SALE]: 'listChecks',
  [StockMoveKind.REFUND]: 'rotate',
  [StockMoveKind.INVENTORY]: 'check',
}

const TONES: Record<StockMoveKind, string> = {
  [StockMoveKind.INCOME]: theme.colors.accent,
  [StockMoveKind.WRITE_OFF]: theme.colors.danger,
  [StockMoveKind.SALE]: theme.colors.info,
  [StockMoveKind.REFUND]: theme.colors.secondary,
  [StockMoveKind.INVENTORY]: theme.colors.secondary,
}

export const iconOf = (kind: StockMoveKind) => ICONS[kind]
export const toneOf = (kind: StockMoveKind) => TONES[kind]
