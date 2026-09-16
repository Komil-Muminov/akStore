import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

export const body: StyleDesc = {
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.md,
  paddingTop: theme.spacing.md,
}

export const renameRow: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-end',
  gap: theme.spacing.sm,
}

export const renameField: StyleDesc = { flexGrow: 1, minWidth: 0 }

export const memberRow: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.md,
  paddingLeft: theme.spacing.md,
  paddingRight: theme.spacing.sm,
  paddingTop: theme.spacing.xs,
  paddingBottom: theme.spacing.xs,
  borderRadius: theme.radius.sm,
  hover: { backgroundColor: theme.colors.overlay },
}

export const memberName: StyleDesc = {
  fontFamily: theme.font.family,
  fontSize: theme.font.size.md,
  color: theme.colors.text,
  flexGrow: 1,
  minWidth: 0,
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
}

export const list: StyleDesc = {
  height: theme.size.contentMaxWidth / 4,
  borderWidth: 1,
  borderColor: theme.colors.border,
  borderRadius: theme.radius.md,
  backgroundColor: theme.colors.canvas,
  paddingTop: theme.spacing.xs,
  paddingBottom: theme.spacing.xs,
}

export const item: StyleDesc = { paddingLeft: theme.spacing.md, paddingRight: theme.spacing.md }

export const empty: StyleDesc = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  paddingTop: theme.spacing.lg,
  paddingBottom: theme.spacing.lg,
}

export const actions: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  paddingTop: theme.spacing.sm,
}
