import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

export const root: StyleDesc = {
  position: 'relative',
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  height: '100%',
  backgroundColor: theme.colors.canvas,
  userSelect: 'none',
}

export const content: StyleDesc = {
  flexGrow: 1,
  minWidth: 0,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}
