import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

export const root: StyleDesc = {
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.md,
  padding: theme.spacing.lg,
  borderRadius: theme.radius.lg,
  backgroundColor: theme.colors.raised,
  borderWidth: 1,
  borderColor: theme.colors.border,
  flexGrow: 1,
  minHeight: 0,
}

export const list: StyleDesc = { flexGrow: 1, minHeight: 0 }

export const row: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.md,
  paddingTop: theme.spacing.sm,
  paddingBottom: theme.spacing.sm,
  borderBottomWidth: 1,
  borderColor: theme.colors.border,
  width: '100%',
}

export const rowText: StyleDesc = { display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: 0 }

export const total: StyleDesc = {
  fontFamily: theme.font.family,
  fontSize: theme.font.size.lg,
  fontWeight: theme.font.weight.semibold,
  color: theme.colors.text,
  flexShrink: 0,
}

export const empty: StyleDesc = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing.sm,
  paddingTop: theme.spacing.xl,
  paddingBottom: theme.spacing.xl,
  flexGrow: 1,
  justifyContent: 'center',
}
