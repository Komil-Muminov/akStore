import type { ReactNode } from 'react'
import type { StyleDesc } from '@gpuix/react'
import { Tooltip as Root, TooltipContent, TooltipTrigger } from '@gpuix/react/tooltip'
import { Text } from '../Text'
import { content } from './style'

interface IProps {
  title: string
  children: ReactNode
  style?: StyleDesc
  asChild?: boolean
}

export const Tooltip = ({ title, children, style, asChild = false }: IProps) => (
  <Root style={style}>
    <TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
    <TooltipContent style={content}>
      <Text variant="secondary">{title}</Text>
    </TooltipContent>
  </Root>
)
