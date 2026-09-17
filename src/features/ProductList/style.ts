import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

export const list: StyleDesc = { flexGrow: 1 }

export const row: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  width: '100%',
  gap: theme.spacing.md,
  paddingLeft: theme.spacing.xl,
  paddingRight: theme.spacing.xl,
  paddingTop: theme.spacing.sm,
  paddingBottom: theme.spacing.sm,
  borderBottomWidth: 1,
  borderColor: theme.colors.border,
  hover: { backgroundColor: theme.colors.overlay },
}

export const rowText: StyleDesc = { display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: 0 }

export const name: StyleDesc = {
  fontFamily: theme.font.family,
  fontSize: theme.font.size.md,
  fontWeight: theme.font.weight.medium,
  color: theme.colors.text,
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
}

export const column: StyleDesc = {
  width: theme.size.sidebar / 2,
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
}

export const price: StyleDesc = {
  fontFamily: theme.font.family,
  fontSize: theme.font.size.md,
  fontWeight: theme.font.weight.semibold,
  color: theme.colors.accent,
}

export const stock = (low: boolean): StyleDesc => ({
  fontFamily: theme.font.family,
  fontSize: theme.font.size.sm,
  fontWeight: theme.font.weight.medium,
  color: low ? theme.colors.danger : theme.colors.secondary,
})

export const actions: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  gap: theme.spacing.xs,
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
