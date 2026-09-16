import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

const isMac = typeof process !== 'undefined' && process.platform === 'darwin'
const MAC_TITLEBAR_CLEARANCE = 52
const TITLEBAR_CLEARANCE = 20

export const layout: StyleDesc = {
  position: 'relative',
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  height: '100%',
  backgroundColor: theme.colors.canvas,
}

export const main: StyleDesc = {
  flexGrow: 1,
  minWidth: 0,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}

export const header: StyleDesc = {
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.lg,
  paddingTop: isMac ? MAC_TITLEBAR_CLEARANCE : TITLEBAR_CLEARANCE,
  paddingLeft: theme.spacing.xl,
  paddingRight: theme.spacing.xl,
  paddingBottom: theme.spacing.lg,
  flexShrink: 0,
}

export const headerRow: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.lg,
}

export const headerText: StyleDesc = { display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: 0 }

export const search: StyleDesc = { display: 'flex', flexDirection: 'row' }

export const sectionHead: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.sm,
  paddingLeft: theme.spacing.xl,
  paddingRight: theme.spacing.xl,
  paddingBottom: theme.spacing.sm,
  flexShrink: 0,
}

export const message: StyleDesc = {
  flexGrow: 1,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing.sm,
}
