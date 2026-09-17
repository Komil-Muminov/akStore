import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

export const daySeparator: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
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
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  paddingTop: theme.spacing.sm,
  paddingBottom: theme.spacing.md,
}

export const bubbleActions: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.xxs,
  paddingLeft: theme.spacing.xs,
}

export const deletedBody: StyleDesc = {
  fontFamily: theme.font.family,
  fontSize: theme.font.size.md,
  lineHeight: theme.font.lineHeight.md,
  color: theme.colors.ghost,
}


