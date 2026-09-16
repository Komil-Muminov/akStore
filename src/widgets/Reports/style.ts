import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

const isMac = typeof process !== 'undefined' && process.platform === 'darwin'
const MAC_TITLEBAR_CLEARANCE = 52
const TITLEBAR_CLEARANCE = 20
const HOSTS_WIDTH = 340

export const layout: StyleDesc = { position: 'relative', display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }

export const header: StyleDesc = {
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.md,
  paddingTop: isMac ? MAC_TITLEBAR_CLEARANCE : TITLEBAR_CLEARANCE,
  paddingLeft: theme.spacing.xl,
  paddingRight: theme.spacing.xl,
  paddingBottom: theme.spacing.md,
  flexShrink: 0,
}

export const headerRow: StyleDesc = { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: theme.spacing.lg }
export const headerText: StyleDesc = { display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: 0 }

export const notice: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.sm,
  paddingLeft: theme.spacing.md,
  paddingRight: theme.spacing.sm,
  height: theme.size.input,
  borderRadius: theme.radius.md,
  borderWidth: 1,
  borderColor: theme.colors.border,
  backgroundColor: theme.colors.accentSoft,
}

export const noticeText: StyleDesc = { flexGrow: 1, minWidth: 0 }

export const body: StyleDesc = {
  flexGrow: 1,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.md,
  paddingLeft: theme.spacing.xl,
  paddingRight: theme.spacing.xl,
  paddingBottom: theme.spacing.xl,
}

export const charts: StyleDesc = { display: 'flex', flexDirection: 'row', gap: theme.spacing.md, flexShrink: 0 }
export const chartCell: StyleDesc = { flexGrow: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }
export const hostsCell: StyleDesc = { width: HOSTS_WIDTH, flexShrink: 0, display: 'flex', flexDirection: 'column' }

export const message: StyleDesc = {
  flexGrow: 1,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing.sm,
}
