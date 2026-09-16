import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

const PLOT_HEIGHT = 160
const BAR_RADIUS = 4

export const root: StyleDesc = {
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.md,
  padding: theme.spacing.lg,
  borderRadius: theme.radius.lg,
  borderWidth: 1,
  borderColor: theme.colors.border,
  backgroundColor: theme.colors.raised,
}

export const head: StyleDesc = { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }

export const plot: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-end',
  gap: theme.spacing.xxs,
  height: PLOT_HEIGHT,
  borderBottomWidth: 1,
  borderColor: theme.colors.borderStrong,
}

export const columnSlot: StyleDesc = { flexGrow: 1, minWidth: 0, height: '100%', display: 'flex' }

export const column: StyleDesc = {
  flexGrow: 1,
  minWidth: 0,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  alignItems: 'center',
  cursor: 'pointer',
  hover: { backgroundColor: theme.colors.overlay },
}

export const bar = (ratio: number): StyleDesc => ({
  width: '70%',
  height: Math.max(ratio * (PLOT_HEIGHT - theme.spacing.lg), ratio > 0 ? BAR_RADIUS : 0),
  borderRadius: BAR_RADIUS,
  backgroundColor: theme.colors.accent,
})

export const labels: StyleDesc = { display: 'flex', flexDirection: 'row', gap: theme.spacing.xxs }

export const labelCell: StyleDesc = { flexGrow: 1, minWidth: 0, display: 'flex', justifyContent: 'center' }

export const empty: StyleDesc = {
  height: PLOT_HEIGHT,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}
