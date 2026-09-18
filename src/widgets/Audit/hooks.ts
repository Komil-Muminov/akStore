import { ApiRoutes, QueryKeys } from '@/shared/config'
import { useGetQuery, useMutationQuery } from '@/shared/hooks'
import type { IAuditEntry, IBackupFile } from './model'

export const useAuditQuery = (filters: string) =>
  useGetQuery<IAuditEntry[]>(QueryKeys.AUDIT, ApiRoutes.AUDIT_SEARCH(filters))

export const useBackupsQuery = () => useGetQuery<IBackupFile[]>(QueryKeys.BACKUPS, ApiRoutes.AUDIT_BACKUPS)

export const useBackupMutation = () =>
  useMutationQuery<IBackupFile, void>(ApiRoutes.AUDIT_BACKUP_CREATE, { invalidate: [QueryKeys.BACKUPS] })
