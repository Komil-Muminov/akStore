import type { ReactNode } from 'react'
import { Tooltip as Root, TooltipContent, TooltipTrigger } from '@gpuix/react/tooltip'
import { Text } from '../Text'
import { content } from './style'

interface IProps {
  title: string
  children: ReactNode
}

export const Tooltip = ({ title, children }: IProps) => (
  <Root>
    <TooltipTrigger>{children}</TooltipTrigger>
    <TooltipContent style={content}>
      <Text variant="secondary">{title}</Text>
    </TooltipContent>
  </Root>
)
