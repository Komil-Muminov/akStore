import { motion } from '@gpuix/react'
import { theme } from '@/shared/config'
import { Icon } from '../Icon'
import { Text } from '../Text'
import { fade, root } from './style'

const LABEL = 'Загрузка…'

export const Spinner = () => (
  <motion.div initial={fade.initial} animate={fade.animate} transition={fade.transition} style={root}>
    <Icon name="sparkle" size={theme.size.iconLg} color={theme.colors.ghost} />
    <Text variant="secondary">{LABEL}</Text>
  </motion.div>
)
