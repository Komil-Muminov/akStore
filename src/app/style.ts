import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

export const fallback: StyleDesc = {
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing.md,
  backgroundColor: theme.colors.canvas,
}
