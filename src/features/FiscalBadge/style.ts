import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

export const root: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.sm,
  paddingTop: theme.spacing.xs,
  paddingBottom: theme.spacing.xs,
  paddingLeft: theme.spacing.md,
  paddingRight: theme.spacing.md,
  borderRadius: theme.radius.full,
  backgroundColor: theme.colors.raised,
  borderWidth: 1,
  borderColor: theme.colors.border,
}

export const dotOnline: StyleDesc = {
  width: theme.size.dot,
  height: theme.size.dot,
  borderRadius: theme.radius.full,
  backgroundColor: theme.colors.success,
}

export const dotOffline: StyleDesc = { ...dotOnline, backgroundColor: theme.colors.danger }

export const dotIdle: StyleDesc = { ...dotOnline, backgroundColor: theme.colors.ghost }
