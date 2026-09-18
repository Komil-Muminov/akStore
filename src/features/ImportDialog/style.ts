import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

export const body: StyleDesc = {
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.md,
  paddingTop: theme.spacing.md,
  minHeight: theme.size.importBody,
}

export const dropZone: StyleDesc = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing.sm,
  paddingTop: theme.spacing.xxl,
  paddingBottom: theme.spacing.xxl,
  borderRadius: theme.radius.lg,
  borderWidth: 1,
  borderColor: theme.colors.borderStrong,
  backgroundColor: theme.colors.overlay,
}

export const stats: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  gap: theme.spacing.md,
  flexWrap: 'wrap',
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

export const list: StyleDesc = { height: theme.size.importList }

export const row: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.md,
  paddingTop: theme.spacing.xs,
  paddingBottom: theme.spacing.xs,
  width: '100%',
}

export const rowName: StyleDesc = { flexGrow: 1, minWidth: 0 }

export const actions: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  gap: theme.spacing.sm,
  paddingTop: theme.spacing.md,
}
