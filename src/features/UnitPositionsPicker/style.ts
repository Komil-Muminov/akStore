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

export const itemCard: StyleDesc = {
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.xs,
  padding: theme.spacing.sm,
  borderRadius: theme.radius.sm,
  backgroundColor: theme.colors.raised,
  borderWidth: 1,
  borderColor: theme.colors.border,
}

export const selectRow: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.sm,
  paddingLeft: theme.spacing.xl,
}

export const selectStyle: StyleDesc = {
  fontFamily: theme.font.family,
  fontSize: theme.font.size.xs,
  color: theme.colors.text,
  backgroundColor: theme.colors.overlay,
  borderColor: theme.colors.borderStrong,
  borderWidth: 1,
  borderRadius: theme.radius.sm,
  padding: theme.spacing.xs,
  outline: 'none',
}

export const footer: StyleDesc = { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }
export const spacer: StyleDesc = { flexGrow: 1, minWidth: 0 }
