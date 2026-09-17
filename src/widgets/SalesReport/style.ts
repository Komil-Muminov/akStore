import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

export const root: StyleDesc = {
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.lg,
  padding: theme.spacing.xl,
  flexGrow: 1,
  minHeight: 0,
}

export const head: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.lg,
  flexShrink: 0,
}

export const headText: StyleDesc = { display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: 0 }

export const columns: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  gap: theme.spacing.lg,
  flexShrink: 0,
}
