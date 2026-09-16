import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

export const root: StyleDesc = {
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.sm,
  padding: theme.spacing.lg,
  borderRadius: theme.radius.lg,
  borderWidth: 1,
  borderColor: theme.colors.border,
  backgroundColor: theme.colors.raised,
}

export const head: StyleDesc = { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }

export const row: StyleDesc = { display: 'flex', flexDirection: 'column', gap: theme.spacing.xxs }

export const rowHead: StyleDesc = { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }

export const rowText: StyleDesc = { flexGrow: 1, minWidth: 0 }

export const track: StyleDesc = {
  height: theme.spacing.xs + theme.spacing.xxs,
  borderRadius: theme.radius.full,
  backgroundColor: theme.colors.overlay,
  display: 'flex',
}

export const fill = (ratio: number): StyleDesc => ({
  width: `${Math.round(ratio * 100)}%`,
  borderRadius: theme.radius.full,
  backgroundColor: theme.colors.info,
})
