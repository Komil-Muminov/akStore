import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

export const root: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.md,
  minHeight: theme.size.composerMinHeight,
  flexShrink: 0,
  paddingTop: theme.spacing.md,
  paddingBottom: theme.spacing.md,
  paddingLeft: theme.spacing.xl,
  paddingRight: theme.spacing.xl,
  borderTopWidth: 1,
  borderColor: theme.colors.border,
  backgroundColor: theme.colors.sidebar,
}

export const field: StyleDesc = { flexGrow: 1, minWidth: 0 }

export const sendButton = (enabled: boolean): StyleDesc => ({
  width: theme.size.button,
  height: theme.size.button,
  flexShrink: 0,
  borderRadius: theme.radius.full,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: enabled ? 'pointer' : 'default',
  backgroundColor: enabled ? theme.colors.accent : theme.colors.mutedSoft,
  hover: enabled ? { backgroundColor: theme.colors.accentHover } : undefined,
})

export const error: StyleDesc = {
  paddingLeft: theme.spacing.xl,
  paddingRight: theme.spacing.xl,
  paddingBottom: theme.spacing.sm,
  backgroundColor: theme.colors.sidebar,
}

export const editBanner: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.sm,
  paddingLeft: theme.spacing.xl,
  paddingRight: theme.spacing.xl,
  paddingTop: theme.spacing.sm,
  paddingBottom: theme.spacing.sm,
  borderTopWidth: 1,
  borderColor: theme.colors.border,
  backgroundColor: theme.colors.infoSoft,
}

export const editText: StyleDesc = { flexGrow: 1, minWidth: 0 }
