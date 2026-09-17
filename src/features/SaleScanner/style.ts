import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

export const root: StyleDesc = {
  flexGrow: 1,
  minWidth: 0,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}

export const head: StyleDesc = {
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.md,
  padding: theme.spacing.lg,
  borderBottomWidth: 1,
  borderColor: theme.colors.border,
  flexShrink: 0,
}

export const chips: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: theme.spacing.sm,
}

export const chip = (active: boolean): StyleDesc => ({
  paddingTop: theme.spacing.xs,
  paddingBottom: theme.spacing.xs,
  paddingLeft: theme.spacing.md,
  paddingRight: theme.spacing.md,
  borderRadius: theme.radius.full,
  borderWidth: 1,
  borderColor: active ? theme.colors.accent : theme.colors.border,
  backgroundColor: active ? theme.colors.accentSoft : undefined,
  cursor: 'pointer',
  hover: active ? undefined : { backgroundColor: theme.colors.overlay },
})

export const chipText = (active: boolean): StyleDesc => ({
  fontFamily: theme.font.family,
  fontSize: theme.font.size.sm,
  fontWeight: theme.font.weight.medium,
  color: active ? theme.colors.accent : theme.colors.secondary,
})

export const list: StyleDesc = { flexGrow: 1 }

export const tile = (disabled: boolean): StyleDesc => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  width: '100%',
  gap: theme.spacing.md,
  marginLeft: theme.spacing.lg,
  marginRight: theme.spacing.lg,
  marginTop: theme.spacing.xs,
  marginBottom: theme.spacing.xs,
  padding: theme.spacing.md,
  borderRadius: theme.radius.md,
  borderWidth: 1,
  borderColor: theme.colors.border,
  backgroundColor: theme.colors.raised,
  opacity: disabled ? 0.5 : 1,
  cursor: disabled ? 'default' : 'pointer',
  hover: disabled ? undefined : { borderColor: theme.colors.accent, backgroundColor: theme.colors.raisedHover },
})

export const tileText: StyleDesc = { display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: 0 }

export const tileName: StyleDesc = {
  fontFamily: theme.font.family,
  fontSize: theme.font.size.md,
  fontWeight: theme.font.weight.medium,
  color: theme.colors.text,
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
}

export const tilePrice: StyleDesc = {
  fontFamily: theme.font.family,
  fontSize: theme.font.size.lg,
  fontWeight: theme.font.weight.semibold,
  color: theme.colors.accent,
  flexShrink: 0,
}

export const empty: StyleDesc = {
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing.sm,
}

export const errorRow: StyleDesc = {
  paddingLeft: theme.spacing.lg,
  paddingRight: theme.spacing.lg,
  paddingBottom: theme.spacing.sm,
}
