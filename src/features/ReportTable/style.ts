import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

const DATE_WIDTH = 140
const STATUS_WIDTH = 110

export const root: StyleDesc = {
  flexGrow: 1,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.sm,
}

export const head: StyleDesc = { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }

export const list: StyleDesc = {
  flexGrow: 1,
  minHeight: 0,
  borderRadius: theme.radius.lg,
  borderWidth: 1,
  borderColor: theme.colors.border,
  backgroundColor: theme.colors.raised,
}

export const rowWrapper: StyleDesc = { paddingLeft: theme.spacing.xs, paddingRight: theme.spacing.xs }

export const row: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.md,
  height: 52,
  paddingLeft: theme.spacing.md,
  paddingRight: theme.spacing.md,
  borderBottomWidth: 1,
  borderColor: theme.colors.border,
  hover: { backgroundColor: theme.colors.overlay },
}

export const date: StyleDesc = { width: DATE_WIDTH, flexShrink: 0 }
export const main: StyleDesc = { flexGrow: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }
export const status: StyleDesc = { width: STATUS_WIDTH, flexShrink: 0, display: 'flex', justifyContent: 'flex-end' }

export const empty: StyleDesc = {
  flexGrow: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing.xl,
}
