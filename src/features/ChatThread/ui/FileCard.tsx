import { useCallback } from 'react'
import { fileSizeOf, type IMessage } from '@/entities/message'
import { theme } from '@/shared/config'
import { Icon } from '@/shared/ui'
import { fileCard, fileNameOf, fileSizeStyle, fileText } from '../style'

interface IProps {
  message: IMessage
  own: boolean
  onDownload: (message: IMessage) => void
}

export const FileCard = ({ message, own, onDownload }: IProps) => {
  const handleClick = useCallback(() => onDownload(message), [message, onDownload])

  return (
    <div style={fileCard(own)} onClick={handleClick} testId={`chat__file-${message.id}`}>
      <Icon
        name="folderOpen"
        size={theme.size.iconMd}
        color={own ? theme.colors.onAccent : theme.colors.info}
      />
      <div style={fileText}>
        <text style={fileNameOf(own)}>{message.fileName}</text>
        <text style={fileSizeStyle(own)}>{fileSizeOf(message.fileSize)}</text>
      </div>
      <Icon
        name="download"
        size={theme.size.iconSm}
        color={own ? theme.colors.onAccent : theme.colors.secondary}
      />
    </div>
  )
}
