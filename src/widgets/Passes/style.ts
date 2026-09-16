import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

const isMac = typeof process !== 'undefined' && process.platform === 'darwin'
const MAC_TITLEBAR_CLEARANCE = 86
const TITLEBAR_CLEARANCE = 20

export const layout: StyleDesc = {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  backgroundColor: theme.colors.canvas,
}

export const header: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.sm + theme.spacing.xxs,
  height: theme.size.header,
  paddingTop: isMac ? MAC_TITLEBAR_CLEARANCE - theme.size.header : TITLEBAR_CLEARANCE - theme.spacing.md,
  paddingLeft: theme.spacing.md + theme.spacing.xxs,
  paddingRight: theme.spacing.md + theme.spacing.xxs,
  flexShrink: 0,
}

export const spacer: StyleDesc = { flexGrow: 1 }

export const message: StyleDesc = {
  flexGrow: 1,
  minHeight: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}
