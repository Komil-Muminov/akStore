import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

export const head: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.md,
  height: theme.size.header,
  flexShrink: 0,
  paddingLeft: theme.spacing.xl,
  paddingRight: theme.spacing.xl,
  borderBottomWidth: 1,
  borderColor: theme.colors.border,
  backgroundColor: theme.colors.sidebar,
}

export const headAvatar: StyleDesc = {
  width: theme.size.avatar,
  height: theme.size.avatar,
  flexShrink: 0,
  borderRadius: theme.radius.full,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.colors.accentSoft,
}

export const headAvatarText: StyleDesc = {
  fontFamily: theme.font.family,
  fontSize: theme.font.size.sm,
  fontWeight: theme.font.weight.semibold,
  color: theme.colors.accent,
}

export const headText: StyleDesc = {
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  minWidth: 0,
}
