import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

export const root: StyleDesc = {
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.lg,
  padding: theme.spacing.xl,
  flexGrow: 1,
  minHeight: 0,
}

export const head: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.lg,
  flexShrink: 0,
}

export const headText: StyleDesc = { display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: 0 }

export const search: StyleDesc = { width: theme.size.sidebar }

export const totalBox: StyleDesc = {
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.xxs,
  paddingTop: theme.spacing.sm,
  paddingBottom: theme.spacing.sm,
  paddingLeft: theme.spacing.md,
  paddingRight: theme.spacing.md,
  borderRadius: theme.radius.md,
  backgroundColor: theme.colors.raised,
}

export const totalValue: StyleDesc = {
  fontFamily: theme.font.family,
  fontSize: theme.font.size.lg,
  fontWeight: theme.font.weight.semibold,
  color: theme.colors.danger,
}

export const columns: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  gap: theme.spacing.lg,
  flexGrow: 1,
  minHeight: 0,
}

export const column: StyleDesc = {
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.sm,
  flexGrow: 1,
  minWidth: 0,
  minHeight: 0,
}

export const list: StyleDesc = { flexGrow: 1, minHeight: 0 }

export const row: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.md,
  paddingTop: theme.spacing.sm,
  paddingBottom: theme.spacing.sm,
  borderBottomWidth: 1,
  borderColor: theme.colors.border,
  width: '100%',
}

export const rowText: StyleDesc = { display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: 0 }

export const debtValue = (owed: boolean): StyleDesc => ({
  fontFamily: theme.font.family,
  fontSize: theme.font.size.md,
  fontWeight: theme.font.weight.semibold,
  color: owed ? theme.colors.danger : theme.colors.secondary,
  flexShrink: 0,
})

export const empty: StyleDesc = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing.sm,
  flexGrow: 1,
}
