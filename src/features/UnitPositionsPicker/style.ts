import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

const LIST_MAX_HEIGHT = 320

export const formRow: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.sm,
  marginBottom: theme.spacing.md,
}

export const inputWrap: StyleDesc = {
  flexGrow: 1,
  minWidth: 0,
}

export const list: StyleDesc = {
  height: LIST_MAX_HEIGHT,
  borderRadius: theme.radius.md,
  borderWidth: 1,
  borderColor: theme.colors.border,
  padding: theme.spacing.sm,
}

export const itemWrapper: StyleDesc = {
  paddingBottom: theme.spacing.sm,
}

export const emptyWrap: StyleDesc = {
  height: LIST_MAX_HEIGHT,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: theme.radius.md,
  borderWidth: 1,
  borderColor: theme.colors.border,
  padding: theme.spacing.lg,
}

export const itemCard: StyleDesc = {
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.xs,
  paddingTop: theme.spacing.xs,
  paddingBottom: theme.spacing.xs,
  paddingLeft: theme.spacing.md,
  paddingRight: theme.spacing.md,
  borderRadius: theme.radius.sm,
  backgroundColor: theme.colors.raised,
  borderWidth: 1,
  borderColor: theme.colors.border,
  hover: { backgroundColor: theme.colors.raisedHover, borderColor: theme.colors.borderStrong },
}

export const itemLeft: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.sm,
  minWidth: 0,
}

export const assignRow: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  paddingLeft: theme.spacing.xl + theme.spacing.md,
  paddingRight: theme.spacing.sm,
  paddingBottom: theme.spacing.sm,
}

export const person: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.sm + theme.spacing.xxs,
  flexGrow: 1,
  minWidth: 0,
  height: theme.size.button + theme.spacing.xs,
  paddingLeft: theme.spacing.xs + theme.spacing.xxs,
  paddingRight: theme.spacing.xs,
  borderRadius: theme.radius.md,
  backgroundColor: theme.colors.accentSoft,
}

export const personAvatar: StyleDesc = {
  width: theme.size.control,
  height: theme.size.control,
  flexShrink: 0,
  borderRadius: theme.radius.full,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.colors.accent,
}

export const personAvatarText: StyleDesc = {
  fontFamily: theme.font.family,
  fontSize: theme.font.size.xs,
  fontWeight: theme.font.weight.semibold,
  color: theme.colors.onAccent,
}

export const personText: StyleDesc = { display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: 0 }
export const personActions: StyleDesc = { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xxs }

export const vacancy: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.sm,
  height: theme.size.button,
  paddingLeft: theme.spacing.md,
  paddingRight: theme.spacing.lg,
  borderRadius: theme.radius.md,
  borderWidth: 1,
  borderColor: theme.colors.ghost,
  cursor: 'pointer',
  hover: { backgroundColor: theme.colors.overlay, borderColor: theme.colors.secondary },
}

export const picker: StyleDesc = { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, flexGrow: 1, minWidth: 0 }

export const footer: StyleDesc = { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }
export const spacer: StyleDesc = { flexGrow: 1, minWidth: 0 }
