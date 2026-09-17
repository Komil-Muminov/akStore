import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

const rowBase: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.sm,
  paddingLeft: theme.spacing.sm + theme.spacing.xxs,
  paddingRight: theme.spacing.sm,
  paddingTop: theme.spacing.xs + theme.spacing.xxs,
  paddingBottom: theme.spacing.xs + theme.spacing.xxs,
  borderRadius: theme.radius.sm,
  cursor: 'pointer',
  hover: { backgroundColor: theme.colors.overlayStrong },
}

export const createRow: StyleDesc = { ...rowBase, backgroundColor: theme.colors.accentSoft }

export const toggleRow: StyleDesc = rowBase

export const createLabel: StyleDesc = {
  fontFamily: theme.font.family,
  fontSize: theme.font.size.md,
  fontWeight: theme.font.weight.medium,
  color: theme.colors.accentHover,
  flexGrow: 1,
  minWidth: 0,
}

export const manageRowOf = (confirming: boolean): StyleDesc => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.xs,
  paddingLeft: theme.spacing.xxs,
  paddingRight: theme.spacing.xxs,
  paddingTop: theme.spacing.xxs,
  paddingBottom: theme.spacing.xxs,
  borderRadius: theme.radius.sm,
  backgroundColor: confirming ? theme.colors.dangerSoft : undefined,
})

export const manageField: StyleDesc = { width: theme.size.manageField }

export const manageInput: StyleDesc = { height: theme.size.manageInput }

export const panel: StyleDesc = {
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.xxs,
}

export const divider: StyleDesc = {
  marginTop: theme.spacing.xs,
  paddingTop: theme.spacing.xs,
  borderTopWidth: 1,
  borderColor: theme.colors.border,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.xxs,
}
