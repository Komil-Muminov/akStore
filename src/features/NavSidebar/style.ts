import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

const isMac = typeof process !== 'undefined' && process.platform === 'darwin'
const MAC_TITLEBAR_CLEARANCE = 64
const TITLEBAR_CLEARANCE = 20

export const root: StyleDesc = {
  width: theme.size.sidebar,
  height: '100%',
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.xs,
  paddingTop: isMac ? MAC_TITLEBAR_CLEARANCE : TITLEBAR_CLEARANCE,
  paddingLeft: theme.spacing.md,
  paddingRight: theme.spacing.md,
  paddingBottom: theme.spacing.lg,
  backgroundColor: theme.colors.sidebar,
  borderRightWidth: 1,
  borderColor: theme.colors.border,
}

export const brand: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.md,
  paddingLeft: theme.spacing.sm,
  paddingBottom: theme.spacing.xl,
}

export const brandMark: StyleDesc = {
  width: theme.size.avatar,
  height: theme.size.avatar,
  borderRadius: theme.radius.md,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.colors.accentSoft,
}

export const brandText: StyleDesc = { display: 'flex', flexDirection: 'column' }

export const section: StyleDesc = { paddingLeft: theme.spacing.sm, paddingBottom: theme.spacing.xs }

export const item = (active: boolean): StyleDesc => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.md,
  height: theme.size.input + theme.spacing.xs,
  paddingLeft: theme.spacing.sm + theme.spacing.xxs,
  paddingRight: theme.spacing.sm + theme.spacing.xxs,
  borderRadius: theme.radius.md,
  cursor: 'pointer',
  backgroundColor: active ? theme.colors.overlayStrong : undefined,
  hover: active ? undefined : { backgroundColor: theme.colors.overlay },
})

export const itemText: StyleDesc = { display: 'flex', flexDirection: 'column', flexGrow: 1 }

export const spacer: StyleDesc = { flexGrow: 1 }

export const account: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.sm,
  padding: theme.spacing.sm,
  borderRadius: theme.radius.md,
  borderWidth: 1,
  borderColor: theme.colors.border,
  backgroundColor: theme.colors.raised,
}

export const avatar: StyleDesc = {
  width: theme.size.control,
  height: theme.size.control,
  flexShrink: 0,
  borderRadius: theme.radius.full,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.colors.accentSoft,
}

export const avatarText: StyleDesc = {
  fontFamily: theme.font.family,
  fontSize: theme.font.size.xs,
  fontWeight: theme.font.weight.semibold,
  color: theme.colors.accent,
}

export const accountText: StyleDesc = { display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: 0 }
