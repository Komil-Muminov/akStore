import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

export const root: StyleDesc = {
  width: theme.size.chatPanel,
  height: '100%',
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.colors.sidebar,
  borderRightWidth: 1,
  borderColor: theme.colors.border,
}

export const head: StyleDesc = {
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.md,
  padding: theme.spacing.lg,
  borderBottomWidth: 1,
  borderColor: theme.colors.border,
}

export const list: StyleDesc = { flexGrow: 1, overflowY: 'scroll' }

export const row = (active: boolean): StyleDesc => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.md,
  height: theme.size.chatRow,
  paddingLeft: theme.spacing.lg,
  paddingRight: theme.spacing.lg,
  cursor: 'pointer',
  borderLeftWidth: theme.spacing.xxs,
  borderColor: active ? theme.colors.accent : theme.colors.sidebar,
  backgroundColor: active ? theme.colors.overlayStrong : undefined,
  hover: active ? undefined : { backgroundColor: theme.colors.overlay },
})

export const avatar = (active: boolean): StyleDesc => ({
  width: theme.size.chatAvatar,
  height: theme.size.chatAvatar,
  flexShrink: 0,
  borderRadius: theme.radius.full,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: active ? theme.colors.accentSoft : theme.colors.raised,
  borderWidth: 1,
  borderColor: active ? theme.colors.accent : theme.colors.border,
})

export const avatarText = (active: boolean): StyleDesc => ({
  fontFamily: theme.font.family,
  fontSize: theme.font.size.sm,
  fontWeight: theme.font.weight.semibold,
  color: active ? theme.colors.accent : theme.colors.secondary,
})

export const rowBody: StyleDesc = {
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  minWidth: 0,
  gap: theme.spacing.xxs,
}

export const rowTop: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing.sm,
  minWidth: 0,
  overflow: 'hidden',
}

export const preview: StyleDesc = {
  fontFamily: theme.font.family,
  fontSize: theme.font.size.sm,
  lineHeight: theme.font.lineHeight.sm,
  color: theme.colors.tertiary,
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  flexGrow: 1,
  flexShrink: 1,
  minWidth: 0,
}

export const name: StyleDesc = {
  fontFamily: theme.font.family,
  fontSize: theme.font.size.md,
  fontWeight: theme.font.weight.medium,
  color: theme.colors.text,
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  flexGrow: 1,
  minWidth: 0,
}

export const badge: StyleDesc = {
  minWidth: theme.size.iconLg,
  height: theme.size.iconLg,
  flexShrink: 0,
  paddingLeft: theme.spacing.xs,
  paddingRight: theme.spacing.xs,
  borderRadius: theme.radius.full,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.colors.accent,
}

export const badgeText: StyleDesc = {
  fontFamily: theme.font.family,
  fontSize: theme.font.size.xs,
  fontWeight: theme.font.weight.semibold,
  color: theme.colors.onAccent,
}

export const empty: StyleDesc = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing.sm,
  paddingTop: theme.spacing.xxl,
  paddingLeft: theme.spacing.xl,
  paddingRight: theme.spacing.xl,
}

export const sectionLabel: StyleDesc = {
  paddingLeft: theme.spacing.lg,
  paddingTop: theme.spacing.md,
  paddingBottom: theme.spacing.xs,
}

export const emptyHint: StyleDesc = { textAlign: 'center' }

export const headTop: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing.sm,
}

export const avatarWrap: StyleDesc = { position: 'relative', flexShrink: 0 }

export const onlineDot: StyleDesc = {
  position: 'absolute',
  right: 0,
  bottom: 0,
  width: theme.spacing.md,
  height: theme.spacing.md,
  borderRadius: theme.radius.full,
  borderWidth: 2,
  borderColor: theme.colors.sidebar,
  backgroundColor: theme.colors.accent,
}
