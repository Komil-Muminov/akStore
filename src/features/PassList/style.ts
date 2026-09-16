import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

export const list: StyleDesc = {
  flexGrow: 1,
  minHeight: 0,
  paddingLeft: theme.spacing.md + theme.spacing.xxs,
  paddingRight: theme.spacing.md + theme.spacing.xxs,
}

export const empty: StyleDesc = {
  flexGrow: 1,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing.sm,
}

export const row: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.md,
  minHeight: theme.size.row,
  maxWidth: theme.size.contentMaxWidth,
  paddingLeft: theme.spacing.sm + theme.spacing.xxs,
  paddingRight: theme.spacing.xs + theme.spacing.xxs,
  borderRadius: theme.radius.md,
  hover: { backgroundColor: theme.colors.overlay },
}

export const status = (active: boolean): StyleDesc => ({
  width: theme.spacing.sm,
  height: theme.spacing.sm,
  flexShrink: 0,
  borderRadius: theme.radius.full,
  backgroundColor: active ? theme.colors.success : theme.colors.ghost,
})

export const actions: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.xxs,
}
