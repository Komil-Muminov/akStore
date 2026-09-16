import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'
import type { TButtonVariant } from './model'

const DISABLED_OPACITY = 0.45

const VARIANTS: Record<TButtonVariant, { background: string; hover: string; color: string; border?: string }> = {
  primary: { background: theme.colors.accent, hover: theme.colors.accentHover, color: theme.colors.onAccent },
  secondary: {
    background: theme.colors.overlay,
    hover: theme.colors.overlayStrong,
    color: theme.colors.text,
    border: theme.colors.borderStrong,
  },
  danger: { background: theme.colors.dangerSoft, hover: theme.colors.dangerSoftHover, color: theme.colors.danger },
}

export const root = (variant: TButtonVariant, disabled: boolean, fullWidth: boolean): StyleDesc => ({
  height: theme.size.button,
  flexGrow: fullWidth ? 1 : 0,
  paddingLeft: theme.spacing.lg,
  paddingRight: theme.spacing.lg,
  borderRadius: theme.radius.md,
  borderWidth: VARIANTS[variant].border ? 1 : 0,
  borderColor: VARIANTS[variant].border,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing.sm,
  flexShrink: 0,
  opacity: disabled ? DISABLED_OPACITY : 1,
  backgroundColor: VARIANTS[variant].background,
  cursor: disabled ? 'not-allowed' : 'pointer',
  hover: disabled ? undefined : { backgroundColor: VARIANTS[variant].hover },
})

export const label = (variant: TButtonVariant): StyleDesc => ({
  fontFamily: theme.font.family,
  fontSize: theme.font.size.sm,
  fontWeight: theme.font.weight.medium,
  color: VARIANTS[variant].color,
})

export const iconColor = (variant: TButtonVariant) => VARIANTS[variant].color
