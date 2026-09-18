import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

export const body: StyleDesc = {
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.sm,
  paddingTop: theme.spacing.md,
  minHeight: theme.size.importBody,
}

export const list: StyleDesc = { height: theme.size.importList }

export const row: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.sm,
  paddingTop: theme.spacing.xs,
  paddingBottom: theme.spacing.xs,
  width: '100%',
}

export const rowText: StyleDesc = { display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: 0 }

export const field: StyleDesc = { width: theme.size.cartQuantity, height: theme.size.control }

export const totalRow: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingTop: theme.spacing.sm,
  borderTopWidth: 1,
  borderColor: theme.colors.border,
}

export const totalValue: StyleDesc = {
  fontFamily: theme.font.family,
  fontSize: theme.font.size.xl,
  fontWeight: theme.font.weight.semibold,
  color: theme.colors.danger,
}

export const actions: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  gap: theme.spacing.sm,
  paddingTop: theme.spacing.md,
}
