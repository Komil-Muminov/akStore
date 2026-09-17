import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

export const root: StyleDesc = {
  flexGrow: 1,
  minWidth: 0,
  height: '100%',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.colors.canvas,
}

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

export const headText: StyleDesc = { display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: 0 }

export const list: StyleDesc = {
  flexGrow: 1,
  paddingTop: theme.spacing.lg,
  paddingBottom: theme.spacing.lg,
  paddingLeft: theme.spacing.xl,
  paddingRight: theme.spacing.xl,
}

export const rowOf = (own: boolean): StyleDesc => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: own ? 'flex-end' : 'flex-start',
  paddingTop: theme.spacing.xxs,
  paddingBottom: theme.spacing.xxs,
})

export const bubbleOf = (own: boolean, wide: boolean, maxWidth: number): StyleDesc => ({
  maxWidth,
  minWidth: wide ? theme.size.fileCardMinWidth : theme.size.bubbleMinWidth,
  flexShrink: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.xxs,
  paddingTop: theme.spacing.sm,
  paddingBottom: theme.spacing.sm,
  paddingLeft: theme.spacing.md,
  paddingRight: theme.spacing.md,
  borderRadius: theme.radius.lg,
  borderBottomRightRadius: own ? theme.radius.sm : theme.radius.lg,
  borderBottomLeftRadius: own ? theme.radius.lg : theme.radius.sm,
  borderWidth: own ? 0 : 1,
  borderColor: theme.colors.border,
  backgroundColor: own ? undefined : theme.colors.raised,
  background: own
    ? {
        type: 'linear-gradient',
        angle: 135,
        stops: [
          { color: theme.colors.accent, position: 0 },
          { color: theme.colors.accentHover, position: 1 },
        ],
      }
    : undefined,
})

export const bodyOf = (own: boolean): StyleDesc => ({
  fontFamily: theme.font.family,
  fontSize: theme.font.size.md,
  lineHeight: theme.font.lineHeight.md,
  color: own ? theme.colors.onAccent : theme.colors.text,
})

export const metaRow: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: theme.spacing.xs,
  flexShrink: 0,
  alignSelf: 'stretch',
  marginTop: theme.spacing.xxs,
}

export const metaOf = (own: boolean): StyleDesc => ({
  fontFamily: theme.font.family,
  fontSize: theme.font.size.xs,
  fontWeight: theme.font.weight.medium,
  color: own ? theme.colors.onAccent : theme.colors.tertiary,
  textAlign: 'right',
  whiteSpace: 'nowrap',
  flexShrink: 0,
})
