import type { StyleDesc } from '@gpuix/react'
import type { TTextVariant } from './model'
import { variants } from './style'

interface IProps {
  children: string
  variant?: TTextVariant
  style?: StyleDesc
  testId?: string
}

export const Text = ({ children, variant = 'body', style, testId }: IProps) => (
  <text testId={testId} style={{ ...variants[variant], ...style }}>
    {children}
  </text>
)
