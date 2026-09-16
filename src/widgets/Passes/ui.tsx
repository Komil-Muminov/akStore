import { useCallback, useMemo, useState } from 'react'
import { PassComposer } from '@/features/PassComposer'
import { PassList } from '@/features/PassList'
import { Sidebar } from '@/features/Sidebar'
import type { ICreatePassDto, IPass, PassFilter } from '@/entities/pass'
import { ApiRoutes, QueryKeys } from '@/shared/config'
import { useGetQuery, useMutationQuery } from '@/shared/hooks'
import { If, Spinner, Text, TextInput } from '@/shared/ui'
import { countByFilter, selectVisible } from './lib'
import { COUNT_SUFFIX, HEADERS, INITIAL_FILTER, SEARCH_PLACEHOLDER } from './model'
import { composer, header, headerText, layout, main, search, sectionHead } from './style'
import { ErrorState } from './ui/ErrorState'

export const Passes = () => {
  const [filter, setFilter] = useState<PassFilter>(INITIAL_FILTER)
  const [query, setQuery] = useState('')
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
  const refetch = passes.refetch
  const handleCreate = useCallback((holderName: string) => createPass({ holderName }), [createPass])
  const handleDeactivate = useCallback((id: string) => deactivatePass(id), [deactivatePass])
  const handleRetry = useCallback(() => void refetch(), [refetch])

  const items = passes.data ?? []
  const counts = useMemo(() => countByFilter(items), [items])
  const visible = useMemo(() => selectVisible(items, filter, query), [items, filter, query])
  const searching = query.trim().length > 0
  const heading = HEADERS[filter]

  return (
    <div style={layout} testId="passes__layout">
      <Sidebar active={filter} counts={counts} onSelect={setFilter} />
      <div style={main}>
        <div style={header}>
          <div style={headerText}>
            <Text variant="heading">{heading.title}</Text>
            <Text variant="secondary">{heading.description}</Text>
          </div>
          <div style={search}>
            <TextInput value={query} onChange={setQuery} placeholder={SEARCH_PLACEHOLDER} icon="search" testId="passes__search" />
          </div>
        </div>
        <div style={composer}>
          <PassComposer onCreate={handleCreate} pending={create.isPending} error={create.error?.message} />
        </div>
        <div style={sectionHead}>
          <Text variant="label">{`${heading.title.toUpperCase()} · ${visible.length}${COUNT_SUFFIX}`}</Text>
        </div>
        <If condition={passes.isPending} fallback={
          <If
            condition={passes.isError}
            fallback={<PassList passes={visible} filter={filter} searching={searching} onDeactivate={handleDeactivate} />}
          >
            <ErrorState details={passes.error?.message ?? ''} onRetry={handleRetry} />
          </If>
        }>
          <Spinner />
        </If>
      </div>
    </div>
  )
}
