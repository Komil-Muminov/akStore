import type { StyleDesc } from '@gpuix/react'
import { theme } from '@/shared/config'

export const field: StyleDesc = { display: 'flex', flexDirection: 'column', gap: theme.spacing.xs }
export const fieldRow: StyleDesc = { display: 'flex', flexDirection: 'row' }
export const footer: StyleDesc = { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }
export const spacer: StyleDesc = { flexGrow: 1, minWidth: 0 }
