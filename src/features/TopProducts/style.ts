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

export const rowHead: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.sm,
}

export const abcBadgeOf = (group = 'C'): StyleDesc => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 20,
  height: 20,
  borderRadius: theme.radius.sm,
  backgroundColor:
    group === 'A' ? theme.colors.accent : group === 'B' ? theme.colors.warning : theme.colors.surface,
  borderWidth: group === 'C' ? 1 : 0,
  borderColor: theme.colors.border,
})

export const abcTextOf = (group = 'C'): StyleDesc => ({
  fontFamily: theme.font.family,
  fontSize: theme.font.size.xs,
  fontWeight: theme.font.weight.bold,
  color: group === 'C' ? theme.colors.textMuted : theme.colors.canvas,
})

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
