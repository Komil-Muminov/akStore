import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

export const root: StyleDesc = {
  flexGrow: 1,
  height: '100%',
  display: 'flex',
  flexDirection: 'row',
  minWidth: 0,
}

export const pane: StyleDesc = {
  flexGrow: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
}

export const errorState: StyleDesc = {
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing.md,
}
