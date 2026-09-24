import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

export const root: StyleDesc = {
  width: theme.size.contentMaxWidth / 1.7,
  height: '100%',
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.colors.sidebar,
  borderLeftWidth: 1,
  borderColor: theme.colors.border,
}

export const head: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing.lg,
  borderBottomWidth: 1,
  borderColor: theme.colors.border,
}

export const list: StyleDesc = { flexGrow: 1 }

export const line: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  width: '100%',
  gap: theme.spacing.sm,
  paddingLeft: theme.spacing.lg,
  paddingRight: theme.spacing.lg,
  paddingTop: theme.spacing.sm,
  paddingBottom: theme.spacing.sm,
  borderBottomWidth: 1,
  borderColor: theme.colors.border,
}

export const lineText: StyleDesc = { display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: 0 }

export const lineName: StyleDesc = {
  fontFamily: theme.font.family,
  fontSize: theme.font.size.md,
  fontWeight: theme.font.weight.medium,
  color: theme.colors.text,
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
}

export const quantityBox: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.xs,
  flexShrink: 0,
}

export const quantityText: StyleDesc = {
  fontFamily: theme.font.family,
  fontSize: theme.font.size.md,
  fontWeight: theme.font.weight.semibold,
  color: theme.colors.text,
  width: theme.size.button + theme.spacing.md,
  textAlign: 'center',
}

export const lineTotal: StyleDesc = {
  fontFamily: theme.font.family,
  fontSize: theme.font.size.md,
  fontWeight: theme.font.weight.semibold,
  color: theme.colors.text,
  width: theme.size.sidebar / 2.6,
  textAlign: 'right',
  flexShrink: 0,
}

export const totals: StyleDesc = {
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.sm,
  padding: theme.spacing.lg,
  borderTopWidth: 1,
  borderColor: theme.colors.border,
  flexShrink: 0,
}

export const totalRow: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing.md,
}

export const grandTotal: StyleDesc = {
  fontFamily: theme.font.family,
  fontSize: theme.font.size.xl,
  fontWeight: theme.font.weight.semibold,
  color: theme.colors.accent,
}

export const discountField: StyleDesc = { width: theme.size.cartDiscount + theme.spacing.xxl }

export const discountBox: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.sm,
}

export const chipsRow: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.xs,
  marginTop: theme.spacing.xs,
}

export const discountChipOf = (active: boolean): StyleDesc => ({
  paddingLeft: theme.spacing.sm,
  paddingRight: theme.spacing.sm,
  paddingTop: theme.spacing.xxs,
  paddingBottom: theme.spacing.xxs,
  borderRadius: theme.radius.sm,
  backgroundColor: active ? theme.colors.accent : theme.colors.surface,
  borderWidth: 1,
  borderColor: active ? theme.colors.accent : theme.colors.border,
})

export const discountKindBox: StyleDesc = { width: theme.size.cartQuantity + theme.spacing.xl }

export const empty: StyleDesc = {
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing.sm,
}

export const quantityField: StyleDesc = { width: theme.size.cartQuantity, height: theme.size.control }

export const lineDiscountField: StyleDesc = { width: theme.size.cartDiscount, height: theme.size.control }
