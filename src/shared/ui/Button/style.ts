import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

const DISABLED_OPACITY = 0.35

export const root = (disabled: boolean): StyleDesc => ({
  height: theme.size.control + theme.spacing.xxs,
  paddingLeft: theme.spacing.md + theme.spacing.xxs,
  paddingRight: theme.spacing.md + theme.spacing.xxs,
  borderRadius: theme.radius.sm + 1,
  display: 'flex',
  alignItems: 'center',
  opacity: disabled ? DISABLED_OPACITY : 1,
  backgroundColor: theme.colors.accent,
  cursor: 'pointer',
  hover: { backgroundColor: theme.colors.accentHover },
})
