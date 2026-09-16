import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

const LIST_MAX_HEIGHT = 320

export const formRow: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.sm,
  marginBottom: theme.spacing.md,
}

export const inputWrap: StyleDesc = {
  flexGrow: 1,
  minWidth: 0,
}

export const list: StyleDesc = {
  height: LIST_MAX_HEIGHT,
  borderRadius: theme.radius.md,
  borderWidth: 1,
  borderColor: theme.colors.border,
  padding: theme.spacing.sm,
}

export const itemWrapper: StyleDesc = {
  paddingBottom: theme.spacing.sm,
}

export const emptyWrap: StyleDesc = {
  height: LIST_MAX_HEIGHT,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: theme.radius.md,
  borderWidth: 1,
  borderColor: theme.colors.border,
  padding: theme.spacing.lg,
}

export const itemCard: StyleDesc = {
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.xs,
  paddingTop: theme.spacing.xs,
  paddingBottom: theme.spacing.xs,
  paddingLeft: theme.spacing.md,
  paddingRight: theme.spacing.md,
  borderRadius: theme.radius.sm,
  backgroundColor: theme.colors.raised,
  borderWidth: 1,
  borderColor: theme.colors.border,
  hover: { backgroundColor: theme.colors.raisedHover, borderColor: theme.colors.borderStrong },
}

export const itemLeft: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.sm,
  minWidth: 0,
}

export const selectRow: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.sm,
  paddingLeft: theme.spacing.xl + theme.spacing.sm,
  paddingBottom: theme.spacing.xs,
}

export const footer: StyleDesc = { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }
export const spacer: StyleDesc = { flexGrow: 1, minWidth: 0 }
