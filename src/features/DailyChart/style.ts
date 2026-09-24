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
  flexShrink: 0,
}

export const header: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
}

export const headerLeft: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.md,
}

export const tabs: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  gap: theme.spacing.xs,
  backgroundColor: theme.colors.surface,
  padding: 3,
  borderRadius: theme.radius.md,
  borderWidth: 1,
  borderColor: theme.colors.border,
}

export const tabOf = (active: boolean): StyleDesc => ({
  paddingTop: theme.spacing.xs,
  paddingBottom: theme.spacing.xs,
  paddingLeft: theme.spacing.md,
  paddingRight: theme.spacing.md,
  borderRadius: theme.radius.sm,
  backgroundColor: active ? theme.colors.raised : 'transparent',
})

export const plot: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-end',
  gap: theme.spacing.sm,
  height: theme.size.chartHeight,
}

export const column: StyleDesc = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: theme.spacing.xs,
  width: theme.size.chartBar,
}

export const barOf = (ratio: number, isPeak = false): StyleDesc => ({
  width: theme.size.chartBar,
  height: Math.round(theme.size.chartHeight * ratio),
  borderRadius: theme.radius.sm,
  backgroundColor: isPeak ? theme.colors.warning : theme.colors.accent,
})

export const empty: StyleDesc = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing.sm,
  paddingTop: theme.spacing.xl,
  paddingBottom: theme.spacing.xl,
}
