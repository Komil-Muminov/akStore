import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

export const root: StyleDesc = {
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.md,
  padding: theme.spacing.lg,
  borderRadius: theme.radius.lg,
  backgroundColor: theme.colors.raised,
  borderWidth: 1,
  borderColor: theme.colors.border,
  flexGrow: 1,
  minWidth: 0,
}

export const list: StyleDesc = { display: 'flex', flexDirection: 'column', gap: theme.spacing.xs, flexGrow: 1 }

export const row: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing.md,
  paddingTop: theme.spacing.sm,
  paddingBottom: theme.spacing.sm,
  width: '100%',
}

export const rowText: StyleDesc = { display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: 0 }

export const amount: StyleDesc = {
  fontFamily: theme.font.family,
  fontSize: theme.font.size.lg,
  fontWeight: theme.font.weight.semibold,
  color: theme.colors.text,
  flexShrink: 0,
}

export const profit: StyleDesc = {
  fontFamily: theme.font.family,
  fontSize: theme.font.size.sm,
  fontWeight: theme.font.weight.medium,
  color: theme.colors.accentHover,
  flexShrink: 0,
}
