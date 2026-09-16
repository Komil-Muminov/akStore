import type { ReactNode } from 'react'
import { motion } from '@gpuix/react'
import { theme } from '@/shared/config'
import { Icon, type TIconName } from '../Icon'
import { IconButton } from '../IconButton'
import { If } from '../If'
import { Text } from '../Text'
import { backdrop, card, fade, head, headText } from './style'

interface IProps {
  open: boolean
  title: string
  description?: string
  icon?: TIconName
  iconColor?: string
  onClose: () => void
  children: ReactNode
  testId?: string
}

export const Modal = ({ open, title, description, icon, iconColor = theme.colors.accent, onClose, children, testId }: IProps) => (
  <If condition={open}>
    <motion.div initial={fade.initial} animate={fade.animate} transition={fade.transition} style={backdrop}>
      <div style={card} testId={testId}>
        <div style={head}>
          <If condition={icon !== undefined}>
            <Icon name={icon ?? 'sparkle'} size={theme.size.iconLg} color={iconColor} />
          </If>
          <div style={headText}>
            <Text variant="title">{title}</Text>
            <If condition={description !== undefined}>
              <Text variant="secondary">{description ?? ''}</Text>
            </If>
          </div>
          <IconButton icon="x" onClick={onClose} testId="modal__close" />
        </div>
        {children}
      </div>
    </motion.div>
  </If>
)
