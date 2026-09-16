import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

export const actions: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  gap: theme.spacing.sm,
}
