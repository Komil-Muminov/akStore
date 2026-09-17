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

export const list: StyleDesc = {
  flexGrow: 1,
  minHeight: 0,
  paddingTop: theme.spacing.lg,
  paddingBottom: theme.spacing.lg,
}

export const rowOf = (own: boolean): StyleDesc => ({
  width: '100%',
  alignSelf: 'stretch',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-end',
  justifyContent: own ? 'flex-end' : 'flex-start',
  paddingLeft: theme.spacing.xl,
  paddingRight: theme.spacing.xl,
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
  justifyContent: 'space-between',
  gap: theme.spacing.xs,
  flexShrink: 0,
  alignSelf: 'stretch',
  marginTop: theme.spacing.xxs,
}

export const metaInfo: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: theme.spacing.xs,
  flexShrink: 0,
  marginLeft: 'auto',
}

export const bubbleActions: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.xxs,
  flexShrink: 0,
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

export const daySeparator: StyleDesc = {
  width: '100%',
  alignSelf: 'stretch',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  paddingLeft: theme.spacing.xl,
  paddingRight: theme.spacing.xl,
  paddingTop: theme.spacing.lg,
  paddingBottom: theme.spacing.sm,
}

export const dayChip: StyleDesc = {
  paddingTop: theme.spacing.xxs,
  paddingBottom: theme.spacing.xxs,
  paddingLeft: theme.spacing.md,
  paddingRight: theme.spacing.md,
  borderRadius: theme.radius.full,
  borderWidth: 1,
  borderColor: theme.colors.border,
  backgroundColor: theme.colors.raised,
}

export const placeholder: StyleDesc = {
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing.md,
}

export const placeholderMark: StyleDesc = {
  width: theme.size.iconXl + theme.spacing.xxl,
  height: theme.size.iconXl + theme.spacing.xxl,
  borderRadius: theme.radius.full,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.colors.accentSoft,
}

export const authorLabel: StyleDesc = {
  fontFamily: theme.font.family,
  fontSize: theme.font.size.xs,
  fontWeight: theme.font.weight.semibold,
  color: theme.colors.info,
}

export const typingRow: StyleDesc = {
  height: theme.size.control,
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  paddingLeft: theme.spacing.xl,
  paddingRight: theme.spacing.xl,
  backgroundColor: theme.colors.canvas,
}

export const typingText: StyleDesc = {
  fontFamily: theme.font.family,
  fontSize: theme.font.size.sm,
  fontWeight: theme.font.weight.medium,
  color: theme.colors.info,
}

export const loadOlderRow: StyleDesc = {
  width: '100%',
  alignSelf: 'stretch',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  paddingLeft: theme.spacing.xl,
  paddingRight: theme.spacing.xl,
  paddingTop: theme.spacing.sm,
  paddingBottom: theme.spacing.md,
}

export const deletedBody: StyleDesc = {
  fontFamily: theme.font.family,
  fontSize: theme.font.size.md,
  lineHeight: theme.font.lineHeight.md,
  color: theme.colors.ghost,
}
