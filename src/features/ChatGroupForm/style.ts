import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

export const body: StyleDesc = {
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.md,
  paddingTop: theme.spacing.md,
}

export const membersHead: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing.sm,
}

export const list: StyleDesc = {
  height: theme.size.contentMaxWidth / 3,
  borderWidth: 1,
  borderColor: theme.colors.border,
  borderRadius: theme.radius.md,
  backgroundColor: theme.colors.canvas,
  paddingTop: theme.spacing.xs,
  paddingBottom: theme.spacing.xs,
}

export const item: StyleDesc = {
  paddingLeft: theme.spacing.md,
  paddingRight: theme.spacing.md,
}

export const empty: StyleDesc = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  paddingTop: theme.spacing.xl,
  paddingBottom: theme.spacing.xl,
}

export const actions: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  gap: theme.spacing.sm,
  paddingTop: theme.spacing.md,
}

export const errorRow: StyleDesc = { paddingTop: theme.spacing.xs }
