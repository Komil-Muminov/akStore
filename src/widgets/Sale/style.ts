import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

export const root: StyleDesc = {
  flexGrow: 1,
  height: '100%',
  display: 'flex',
  flexDirection: 'row',
  minWidth: 0,
}

export const main: StyleDesc = {
  flexGrow: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
}

export const badgeRow: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  paddingLeft: theme.spacing.lg,
  paddingRight: theme.spacing.lg,
  paddingBottom: theme.spacing.xs,
  flexShrink: 0,
}
