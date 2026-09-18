import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

export const body: StyleDesc = {
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.sm,
  paddingTop: theme.spacing.md,
  minHeight: theme.size.importBody,
}

export const list: StyleDesc = { height: theme.size.importList }

export const row: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.sm,
  paddingTop: theme.spacing.xxs,
  paddingBottom: theme.spacing.xxs,
  width: '100%',
}

export const rowText: StyleDesc = { display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: 0 }

export const field: StyleDesc = { width: theme.size.cartQuantity, height: theme.size.control }

export const stats: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: theme.spacing.md,
}

export const stat: StyleDesc = {
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.xxs,
  paddingTop: theme.spacing.sm,
  paddingBottom: theme.spacing.sm,
  paddingLeft: theme.spacing.md,
  paddingRight: theme.spacing.md,
  borderRadius: theme.radius.md,
  backgroundColor: theme.colors.raised,
  minWidth: theme.size.filterField,
  flexGrow: 1,
}

export const statValue = (tone: string): StyleDesc => ({
  fontFamily: theme.font.family,
  fontSize: theme.font.size.lg,
  fontWeight: theme.font.weight.semibold,
  color: tone,
})

export const actions: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  gap: theme.spacing.sm,
  paddingTop: theme.spacing.md,
}
