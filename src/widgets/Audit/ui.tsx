import { useCallback, useMemo, useState } from 'react'
import { saleStampOf } from '@/entities/sale'
import { theme } from '@/shared/config'
import { Button, Icon, If, Select, Spinner, Text } from '@/shared/ui'
import { useAuditQuery, useBackupMutation, useBackupsQuery } from './hooks'
import {
  ACTION_LABELS,
  ACTION_OPTIONS,
  ALL_ACTIONS,
  BACKUPS_TITLE,
  BACKUP_LABEL,
  DESCRIPTION,
  EMPTY_BACKUPS,
  EMPTY_HINT,
  EMPTY_TITLE,
  ESTIMATED_ROW_HEIGHT,
  KILOBYTE,
  TITLE,
} from './model'
import {
  actionLabel,
  column,
  columns,
  empty,
  filterBox,
  head,
  headText,
  list,
  root,
  row,
  rowText,
  sideColumn,
} from './style'

export const Audit = () => {
  const [action, setAction] = useState<string | null>(null)
  const filters = useMemo(() => (action ? `action=${action}` : ''), [action])
  const entries = useAuditQuery(filters)
  const backups = useBackupsQuery()
  const backup = useBackupMutation()

  const backupMutate = backup.mutate
  const handleBackup = useCallback(() => backupMutate(), [backupMutate])

  return (
    <div style={root} testId="audit__layout">
      <div style={head}>
        <div style={headText}>
          <Text variant="heading">{TITLE}</Text>
          <Text variant="secondary">{DESCRIPTION}</Text>
        </div>
        <div style={filterBox}>
          <Select
            value={action}
            options={ACTION_OPTIONS}
            placeholder={ALL_ACTIONS}
            onChange={setAction}
            testId="audit__action"
          />
        </div>
        <Button
          label={BACKUP_LABEL}
          icon="download"
          onClick={handleBackup}
          disabled={backup.isPending}
          testId="audit__backup"
        />
      </div>
      <div style={columns}>
        <div style={column}>
          <If condition={entries.isPending} fallback={
            <If
              condition={(entries.data ?? []).length > 0}
              fallback={
                <div style={empty}>
                  <Icon name="listChecks" size={theme.size.iconXl} color={theme.colors.ghost} />
                  <Text variant="title">{EMPTY_TITLE}</Text>
                  <Text variant="secondary">{EMPTY_HINT}</Text>
                </div>
              }
            >
              <virtual-list estimatedItemHeight={ESTIMATED_ROW_HEIGHT} style={list} testId="audit__list">
                {(entries.data ?? []).map((entry) => (
                  <div key={entry.id} style={row}>
                    <div style={rowText}>
                      <Text variant="bodyStrong">{`${entry.entity || '—'}${entry.details ? ` · ${entry.details}` : ''}`}</Text>
                      <Text variant="caption">{`${saleStampOf(entry.createdAt)} · ${entry.actorName}`}</Text>
                    </div>
                    <text style={actionLabel}>{ACTION_LABELS[entry.action] ?? entry.action}</text>
                  </div>
                ))}
              </virtual-list>
            </If>
          }>
            <Spinner />
          </If>
        </div>
        <div style={sideColumn}>
          <Text variant="title">{BACKUPS_TITLE}</Text>
          <If
            condition={(backups.data ?? []).length > 0}
            fallback={<Text variant="secondary">{EMPTY_BACKUPS}</Text>}
          >
            <virtual-list estimatedItemHeight={ESTIMATED_ROW_HEIGHT} style={list} testId="audit__backups">
              {(backups.data ?? []).map((file) => (
                <div key={file.name} style={row}>
                  <div style={rowText}>
                    <Text variant="body">{saleStampOf(file.createdAt)}</Text>
                    <Text variant="caption">{`${String(Math.round(file.size / KILOBYTE))} КБ`}</Text>
                  </div>
                </div>
              ))}
            </virtual-list>
          </If>
        </div>
      </div>
    </div>
  )
}
