import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

export const wrapper: StyleDesc = {
  flexShrink: 0,
  paddingLeft: theme.spacing.md + theme.spacing.xxs,
  paddingRight: theme.spacing.md + theme.spacing.xxs,
  paddingTop: theme.spacing.sm,
  paddingBottom: theme.spacing.md + theme.spacing.xxs,
  maxWidth: theme.size.contentMaxWidth + theme.spacing.xl + theme.spacing.xs,
}

export const root: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.sm + theme.spacing.xxs,
  height: theme.size.input,
  paddingLeft: theme.spacing.md,
  paddingRight: theme.spacing.sm,
  borderRadius: theme.radius.lg,
  borderWidth: 1,
  borderColor: theme.colors.border,
  backgroundColor: theme.colors.raised,
}
