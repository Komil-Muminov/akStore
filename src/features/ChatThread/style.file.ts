import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

export const fileCard = (own: boolean): StyleDesc => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.sm,
  marginTop: theme.spacing.xxs,
  marginBottom: theme.spacing.xxs,
  paddingTop: theme.spacing.sm,
  paddingBottom: theme.spacing.sm,
  paddingLeft: theme.spacing.md,
  paddingRight: theme.spacing.md,
  borderRadius: theme.radius.md,
  cursor: 'pointer',
  backgroundColor: own ? theme.colors.overlayStrong : theme.colors.canvas,
  borderWidth: 1,
  borderColor: own ? theme.colors.accentSoft : theme.colors.border,
  hover: { borderColor: own ? theme.colors.onAccent : theme.colors.borderStrong },
})

export const fileText: StyleDesc = { display: 'flex', flexDirection: 'column', minWidth: 0, flexGrow: 1 }

export const fileNameOf = (own: boolean): StyleDesc => ({
  fontFamily: theme.font.family,
  fontSize: theme.font.size.sm,
  fontWeight: theme.font.weight.medium,
  color: own ? theme.colors.onAccent : theme.colors.text,
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
})

export const fileSizeStyle = (own: boolean): StyleDesc => ({
  fontFamily: theme.font.family,
  fontSize: theme.font.size.xs,
  color: own ? theme.colors.onAccent : theme.colors.tertiary,
})

export const dropOverlay: StyleDesc = {
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.colors.accentSoft,
  borderWidth: 2,
  borderColor: theme.colors.accent,
  borderRadius: theme.radius.lg,
}
