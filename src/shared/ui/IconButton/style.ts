import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

export const root = (hoverColor: string, variant: 'ghost' | 'outline' = 'ghost'): StyleDesc => ({
  width: theme.size.control,
  height: theme.size.control,
  flexShrink: 0,
  borderRadius: theme.radius.sm,
  borderWidth: variant === 'outline' ? 1 : 0,
  borderColor: variant === 'outline' ? theme.colors.border : undefined,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  backgroundColor: variant === 'outline' ? theme.colors.overlay : 'transparent',
  hover: { backgroundColor: hoverColor, borderColor: variant === 'outline' ? theme.colors.borderStrong : undefined },
  active: { backgroundColor: theme.colors.overlayStrong },
})
