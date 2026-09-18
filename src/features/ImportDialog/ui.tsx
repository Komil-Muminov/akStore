import { useCallback } from 'react'
import type { EventPayload } from '@gpuix/react'
import { theme } from '@/shared/config'
import { Button, Icon, If, Modal, Spinner, Text } from '@/shared/ui'
import {
  APPLY_LABEL,
  CANCEL_LABEL,
  CLOSE_LABEL,
  CREATED_RESULT,
  DESCRIPTION,
  DROP_HINT,
  DROP_TITLE,
  SKIPPED_RESULT,
  STOCKED_RESULT,
  TEMPLATE_LABEL,
  TITLE,
  UPDATED_RESULT,
  type IProps,
} from './model'
import { actions, body, dropZone, stat, statValue, stats } from './style'
import { PreviewList } from './ui/PreviewList'

export const ImportDialog = ({ open, preview, result, pending, error, onDrop, onApply, onTemplate, onClose }: IProps) => {
  const handleDrop = useCallback(
    (event: EventPayload) => onDrop((event.paths ?? []) as string[]),
    [onDrop],
  )

  return (
    <Modal open={open} title={TITLE} description={DESCRIPTION} icon="download" onClose={onClose} testId="import__dialog">
      <div style={body} onFileDrop={handleDrop}>
        <If condition={pending}>
          <Spinner />
        </If>
        <If condition={result !== null}>
          <div style={stats}>
            <div style={stat}>
              <Text variant="caption">{CREATED_RESULT}</Text>
              <text style={statValue(theme.colors.accentHover)}>{String(result?.created ?? 0)}</text>
            </div>
            <div style={stat}>
              <Text variant="caption">{UPDATED_RESULT}</Text>
              <text style={statValue(theme.colors.info)}>{String(result?.updated ?? 0)}</text>
            </div>
            <div style={stat}>
              <Text variant="caption">{STOCKED_RESULT}</Text>
              <text style={statValue(theme.colors.text)}>{String(result?.stocked ?? 0)}</text>
            </div>
            <div style={stat}>
              <Text variant="caption">{SKIPPED_RESULT}</Text>
              <text style={statValue(theme.colors.secondary)}>{String(result?.failed ?? 0)}</text>
            </div>
          </div>
        </If>
        <If condition={result === null && preview !== null}>
          {() => <PreviewList preview={preview ?? { fileName: '', rows: [], total: 0, toCreate: 0, toUpdate: 0, failed: 0 }} />}
        </If>
        <If condition={result === null && preview === null && !pending}>
          <div style={dropZone}>
            <Icon name="download" size={theme.size.iconXl} color={theme.colors.ghost} />
            <Text variant="title">{DROP_TITLE}</Text>
            <Text variant="secondary">{DROP_HINT}</Text>
          </div>
        </If>
        <If condition={error !== undefined}>
          <Text variant="danger">{error ?? ''}</Text>
        </If>
        <div style={actions}>
          <Button label={TEMPLATE_LABEL} icon="download" variant="secondary" onClick={onTemplate} testId="import__template" />
          <Button label={result === null ? CANCEL_LABEL : CLOSE_LABEL} variant="secondary" onClick={onClose} />
          <If condition={result === null}>
            <Button
              label={APPLY_LABEL}
              icon="check"
              onClick={onApply}
              disabled={pending || preview === null || preview.toCreate + preview.toUpdate === 0}
              testId="import__apply"
            />
          </If>
        </div>
      </div>
    </Modal>
  )
}
