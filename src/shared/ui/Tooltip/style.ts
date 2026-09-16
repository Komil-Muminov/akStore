import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

export const content: StyleDesc = {
  paddingLeft: theme.spacing.sm,
  paddingRight: theme.spacing.sm,
  paddingTop: theme.spacing.xs,
  paddingBottom: theme.spacing.xs,
  borderRadius: theme.radius.sm,
  borderWidth: 1,
  borderColor: theme.colors.border,
  backgroundColor: theme.colors.raised,
}
