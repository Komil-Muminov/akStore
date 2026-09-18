import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

export const body: StyleDesc = {
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.md,
  paddingTop: theme.spacing.md,
  minHeight: theme.size.importBody,
}

export const controls: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.sm,
}

export const amountField: StyleDesc = { width: theme.size.filterField }

export const list: StyleDesc = { height: theme.size.importList }

export const row: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.md,
  paddingTop: theme.spacing.xs,
  paddingBottom: theme.spacing.xs,
  width: '100%',
}

export const rowText: StyleDesc = { display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: 0 }

export const amount = (income: boolean): StyleDesc => ({
  fontFamily: theme.font.family,
  fontSize: theme.font.size.md,
  fontWeight: theme.font.weight.semibold,
  color: income ? theme.colors.accentHover : theme.colors.danger,
  flexShrink: 0,
})

export const actions: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  paddingTop: theme.spacing.sm,
}
