import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

export const root: StyleDesc = {
  flexGrow: 1,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing.sm,
}

export const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: theme.motion.normal },
}
