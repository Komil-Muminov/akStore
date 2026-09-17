import { useCallback, useEffect, useState } from 'react'
import { GateScanner } from '@/features/GateScanner'
import { OnSiteList } from '@/features/OnSiteList'
import { useGateMutations, useEntriesQuery, useFoundQuery, useOnSiteQuery } from './hooks'
import { CHECKED_IN_NOTICE, CHECKED_OUT_NOTICE, NOTICE_TIMEOUT_MS } from './model'
import { main, root } from './style'

export const Gate = () => {
  const [code, setCode] = useState('')
  const [query, setQuery] = useState('')
  const [notice, setNotice] = useState<string | undefined>(undefined)
  const onSite = useOnSiteQuery()
  const entries = useEntriesQuery()
  const found = useFoundQuery(query, query.length > 0)
  const { checkIn, checkOut } = useGateMutations()

  useEffect(() => {
    if (notice === undefined) return
    const timer = setTimeout(() => setNotice(undefined), NOTICE_TIMEOUT_MS)
    return () => clearTimeout(timer)
  }, [notice])

  const handleFind = useCallback(() => {
    setNotice(undefined)
    setQuery(code.trim().toUpperCase())
  }, [code])

  const handleReset = useCallback(() => {
    setCode('')
    setQuery('')
    setNotice(undefined)
  }, [])

  const passId = found.data?.pass.id ?? ''
  const refetchFound = found.refetch
  const checkInMutate = checkIn.mutate
  const checkOutMutate = checkOut.mutate

  const handleCheckIn = useCallback(() => {
    if (passId.length === 0) return
    checkInMutate(passId, {
      onSuccess: () => {
        setNotice(CHECKED_IN_NOTICE)
        void refetchFound()
      },
    })
  }, [passId, checkInMutate, refetchFound])

  const handleCheckOut = useCallback(() => {
    if (passId.length === 0) return
    checkOutMutate(passId, {
      onSuccess: () => {
        setNotice(CHECKED_OUT_NOTICE)
        void refetchFound()
      },
    })
  }, [passId, checkOutMutate, refetchFound])

  return (
    <div style={root} testId="gate__layout">
      <div style={main}>
        <GateScanner
          code={code}
          found={found.data ?? null}
          pending={checkIn.isPending || checkOut.isPending || found.isFetching}
          error={found.error?.message ?? checkIn.error?.message ?? checkOut.error?.message}
          notice={notice}
          onCodeChange={setCode}
          onFind={handleFind}
          onCheckIn={handleCheckIn}
          onCheckOut={handleCheckOut}
          onReset={handleReset}
        />
      </div>
      <OnSiteList people={onSite.data ?? []} entries={entries.data ?? []} />
    </div>
  )
}
