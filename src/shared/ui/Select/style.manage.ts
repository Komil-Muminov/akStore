import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

export const actionRow: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.sm,
  paddingLeft: theme.spacing.sm,
  paddingRight: theme.spacing.xs,
  paddingTop: theme.spacing.xs,
  paddingBottom: theme.spacing.xs,
  borderRadius: theme.radius.sm,
  cursor: 'pointer',
  hover: { backgroundColor: theme.colors.overlayStrong },
}

export const createRow: StyleDesc = { ...actionRow, borderTopWidth: 1, borderColor: theme.colors.border }

export const manageRow: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.xs,
  paddingLeft: theme.spacing.xs,
  paddingRight: theme.spacing.xs,
  paddingTop: theme.spacing.xxs,
  paddingBottom: theme.spacing.xxs,
  width: '100%',
}

export const manageField: StyleDesc = { flexGrow: 1, minWidth: 0 }

export const manageList: StyleDesc = {
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.xxs,
  paddingTop: theme.spacing.xs,
}

export const footer: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing.sm,
  paddingTop: theme.spacing.xs,
  borderTopWidth: 1,
  borderColor: theme.colors.border,
}
