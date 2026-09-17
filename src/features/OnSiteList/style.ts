import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

export const root: StyleDesc = {
  width: theme.size.chatPanel,
  height: '100%',
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.colors.sidebar,
  borderLeftWidth: 1,
  borderColor: theme.colors.border,
}

export const section: StyleDesc = {
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.xs,
  padding: theme.spacing.lg,
  borderBottomWidth: 1,
  borderColor: theme.colors.border,
}

export const list: StyleDesc = { flexGrow: 1, overflowY: 'scroll' }

export const row: StyleDesc = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.md,
  paddingLeft: theme.spacing.lg,
  paddingRight: theme.spacing.lg,
  paddingTop: theme.spacing.sm,
  paddingBottom: theme.spacing.sm,
  borderBottomWidth: 1,
  borderColor: theme.colors.border,
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

export const mark = (incoming: boolean): StyleDesc => ({
  width: theme.size.control,
  height: theme.size.control,
  flexShrink: 0,
  borderRadius: theme.radius.full,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: incoming ? theme.colors.accentSoft : theme.colors.mutedSoft,
})

export const empty: StyleDesc = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  paddingTop: theme.spacing.xl,
  paddingBottom: theme.spacing.xl,
}
