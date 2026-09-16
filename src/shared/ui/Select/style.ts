import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'
import { LIST_MAX_HEIGHT } from './model'

export const root: StyleDesc = { flexGrow: 1, minWidth: 0, display: 'flex' }

export const trigger = (open: boolean): StyleDesc => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.sm + theme.spacing.xxs,
  height: theme.size.input,
  flexGrow: 1,
  minWidth: 0,
  paddingLeft: theme.spacing.md,
  paddingRight: theme.spacing.md,
  borderRadius: theme.radius.md,
  borderWidth: 1,
  borderColor: open ? theme.colors.accent : theme.colors.borderStrong,
  backgroundColor: theme.colors.canvas,
  hover: { borderColor: open ? theme.colors.accent : theme.colors.ghost },
})

export const input: StyleDesc = {
  flexGrow: 1,
  minWidth: 0,
  fontSize: theme.font.size.md,
  fontFamily: theme.font.family,
  color: theme.colors.text,
}

export const inputTheme = { caret: theme.colors.accent }

export const content: StyleDesc = {
  display: 'flex',
  flexDirection: 'column',
  maxHeight: LIST_MAX_HEIGHT,
  overflowY: 'scroll',
  padding: theme.spacing.xs,
  borderRadius: theme.radius.md,
  borderWidth: 1,
  borderColor: theme.colors.borderStrong,
  backgroundColor: theme.colors.sidebar,
  boxShadow: { offsetX: 0, offsetY: 12, blurRadius: 32, spreadRadius: 0, color: '#00000099' },
}

export const group: StyleDesc = {
  paddingLeft: theme.spacing.sm,
  paddingTop: theme.spacing.sm,
  paddingBottom: theme.spacing.xs,
}

export const item = (highlighted: boolean, selected: boolean): StyleDesc => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.xxs,
  paddingLeft: theme.spacing.sm + theme.spacing.xxs,
  paddingRight: theme.spacing.sm,
  paddingTop: theme.spacing.xs + theme.spacing.xxs,
  paddingBottom: theme.spacing.xs + theme.spacing.xxs,
  borderRadius: theme.radius.sm,
  cursor: 'pointer',
  backgroundColor: highlighted ? theme.colors.overlayStrong : selected ? theme.colors.accentSoft : undefined,
})

export const empty: StyleDesc = { padding: theme.spacing.md }
