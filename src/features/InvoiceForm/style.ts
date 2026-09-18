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
  paddingTop: theme.spacing.xxs,
  paddingBottom: theme.spacing.xxs,
  width: '100%',
}

export const rowName: StyleDesc = { flexGrow: 1, minWidth: 0 }

export const smallField: StyleDesc = { width: theme.size.cartQuantity, height: theme.size.control }

export const pair: StyleDesc = { display: 'flex', flexDirection: 'row', gap: theme.spacing.md }

export const half: StyleDesc = { flexGrow: 1, minWidth: 0 }

export const totalRow: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingTop: theme.spacing.sm,
}

export const totalValue: StyleDesc = {
  fontFamily: theme.font.family,
  fontSize: theme.font.size.xl,
  fontWeight: theme.font.weight.semibold,
  color: theme.colors.accentHover,
}

export const actions: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  gap: theme.spacing.sm,
  paddingTop: theme.spacing.md,
}
