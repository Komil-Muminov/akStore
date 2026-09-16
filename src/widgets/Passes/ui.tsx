import { useCallback } from 'react'
import { PassComposer } from '@/features/PassComposer'
import { PassList } from '@/features/PassList'
import type { ICreatePassDto, IPass } from '@/entities/pass'
import { ApiRoutes, QueryKeys, theme } from '@/shared/config'
import { useGetQuery, useMutationQuery } from '@/shared/hooks'
import { Icon, If, Spinner, Text } from '@/shared/ui'
import { ERROR_PREFIX, TITLE } from './model'
import { header, layout, message, spacer } from './style'

export const Passes = () => {
  const passes = useGetQuery<IPass[]>(QueryKeys.PASSES, ApiRoutes.PASSES_SEARCH)
  const create = useMutationQuery<IPass, ICreatePassDto>(ApiRoutes.PASSES_CREATE, {
    invalidate: [QueryKeys.PASSES],
  })
  const deactivate = useMutationQuery<IPass, string>(ApiRoutes.PASSES_DEACTIVATE, {
    method: 'PATCH',
    invalidate: [QueryKeys.PASSES],
  })

  const createPass = create.mutate
  const deactivatePass = deactivate.mutate
  const handleCreate = useCallback((holderName: string) => createPass({ holderName }), [createPass])
  const handleDeactivate = useCallback((id: string) => deactivatePass(id), [deactivatePass])
  const items = passes.data ?? []
  const errorText = `${ERROR_PREFIX}${passes.error?.message ?? ''}`

  return (
    <div style={layout} testId="passes__layout">
      <div style={header}>
        <Icon name="sparkle" color={theme.colors.accent} />
        <Text variant="title" testId="passes__title">
          {TITLE}
        </Text>
        <Text variant="ghost">{String(items.length)}</Text>
        <div style={spacer} />
      </div>
      <If condition={passes.isPending} fallback={
        <If condition={passes.isError} fallback={<PassList passes={items} onDeactivate={handleDeactivate} />}>
          <div style={message} testId="passes__error">
            <Text variant="danger">{errorText}</Text>
          </div>
        </If>
      }>
        <Spinner />
      </If>
      <PassComposer onCreate={handleCreate} pending={create.isPending} />
    </div>
  )
}
