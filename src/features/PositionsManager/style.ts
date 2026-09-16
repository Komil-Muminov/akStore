import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

const LIST_MAX_HEIGHT = 280
const RANK_WIDTH = 96

export const form: StyleDesc = { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }
export const rank: StyleDesc = { width: RANK_WIDTH, flexShrink: 0, display: 'flex' }

export const list: StyleDesc = {
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.xxs,
  maxHeight: LIST_MAX_HEIGHT,
  overflowY: 'scroll',
  borderRadius: theme.radius.md,
  borderWidth: 1,
  borderColor: theme.colors.border,
  padding: theme.spacing.xs,
}

export const row: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.md,
  height: theme.size.row - theme.spacing.lg,
  paddingLeft: theme.spacing.md,
  paddingRight: theme.spacing.xs,
  borderRadius: theme.radius.sm,
  hover: { backgroundColor: theme.colors.overlay },
}

export const rowText: StyleDesc = { flexGrow: 1, minWidth: 0 }
export const footer: StyleDesc = { display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: theme.spacing.sm }
export const spacer: StyleDesc = { flexGrow: 1, minWidth: 0 }
