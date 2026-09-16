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

const SIZES = {
  sm: { height: 28, fontSize: theme.font.size.xs, padding: theme.spacing.sm },
  md: { height: theme.size.button, fontSize: theme.font.size.sm, padding: theme.spacing.lg },
  lg: { height: theme.size.input, fontSize: theme.font.size.md, padding: theme.spacing.xl },
} as const

export const root = (variant: TButtonVariant, disabled: boolean, fullWidth: boolean, size: 'sm' | 'md' | 'lg' = 'md'): StyleDesc => ({
  height: SIZES[size].height,
  width: fullWidth ? '100%' : undefined,
  flexGrow: fullWidth ? 1 : 0,
  paddingLeft: SIZES[size].padding,
  paddingRight: SIZES[size].padding,
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

export const label = (variant: TButtonVariant, size: 'sm' | 'md' | 'lg' = 'md'): StyleDesc => ({
  fontFamily: theme.font.family,
  fontSize: SIZES[size].fontSize,
  fontWeight: theme.font.weight.medium,
  color: VARIANTS[variant].color,
})

export const iconColor = (variant: TButtonVariant) => VARIANTS[variant].color

