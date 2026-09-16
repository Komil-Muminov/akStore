import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

export const root: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingTop: theme.spacing.md,
  paddingBottom: theme.spacing.md,
  paddingLeft: theme.spacing.lg,
  paddingRight: theme.spacing.lg,
  borderTopWidth: 1,
  borderColor: theme.colors.border,
}

export const controls: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.sm,
}

export const info: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.xs,
}
