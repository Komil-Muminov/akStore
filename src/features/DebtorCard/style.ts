import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

export const body: StyleDesc = {
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.md,
  paddingTop: theme.spacing.md,
  minHeight: theme.size.importBody,
}

export const balanceBox: StyleDesc = {
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.xxs,
  padding: theme.spacing.md,
  borderRadius: theme.radius.md,
  backgroundColor: theme.colors.raised,
}

export const balanceValue = (owed: boolean): StyleDesc => ({
  fontFamily: theme.font.family,
  fontSize: theme.font.size.xl,
  fontWeight: theme.font.weight.semibold,
  color: owed ? theme.colors.danger : theme.colors.accentHover,
})

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

export const amount = (positive: boolean): StyleDesc => ({
  fontFamily: theme.font.family,
  fontSize: theme.font.size.md,
  fontWeight: theme.font.weight.semibold,
  color: positive ? theme.colors.danger : theme.colors.accentHover,
  flexShrink: 0,
})

export const actions: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  paddingTop: theme.spacing.sm,
}
