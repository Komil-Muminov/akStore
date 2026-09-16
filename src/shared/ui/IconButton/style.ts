import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

export const root: StyleDesc = {
  width: theme.size.control,
  height: theme.size.control,
  flexShrink: 0,
  borderRadius: theme.radius.sm,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  hover: { backgroundColor: theme.colors.overlay },
  active: { backgroundColor: theme.colors.overlayStrong },
}
