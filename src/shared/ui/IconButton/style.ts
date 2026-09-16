import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

export const root = (hoverColor: string): StyleDesc => ({
  width: theme.size.control,
  height: theme.size.control,
  flexShrink: 0,
  borderRadius: theme.radius.sm,
  borderWidth: 1,
  borderColor: theme.colors.border,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  backgroundColor: theme.colors.overlay,
  hover: { backgroundColor: hoverColor, borderColor: theme.colors.borderStrong },
  active: { backgroundColor: theme.colors.overlayStrong },
})
