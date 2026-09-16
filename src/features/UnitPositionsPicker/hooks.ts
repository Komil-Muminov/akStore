import { useCallback, useEffect, useMemo, useState } from 'react'
import type { IUnit, IUnitAssignment } from '@/entities/unit'
import type { IPosition, IPositionInput } from '@/entities/position'
import { POSITION_NAME_MIN_LENGTH } from '@/entities/position'

export const useUnitPositionsPicker = (
  unit: IUnit | null,
  positions: IPosition[],
  onCreatePosition: (input: IPositionInput) => unknown,
  onSubmit: (assignments: IUnitAssignment[]) => void,
  pending: boolean,
) => {
  const [assignments, setAssignments] = useState<Record<string, string | null>>({})
  const [newPositionName, setNewPositionName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const open = unit !== null

  useEffect(() => {
    if (!open || !unit) return
    const map: Record<string, string | null> = {}
    if (unit.assignments && unit.assignments.length > 0) {
      unit.assignments.forEach((item) => {
        map[item.positionId] = item.userId
      })
    } else {
      unit.positionIds.forEach((id) => {
        map[id] = null
      })
    }
    setAssignments(map)
    setEditingId(null)
  }, [open, unit])

  const filteredPositions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return q ? positions.filter((p) => p.name.toLowerCase().includes(q)) : positions
  }, [positions, searchQuery])

  const toggle = useCallback((positionId: string) => {
    setAssignments((current) => {
      const next = { ...current }
      if (positionId in next) {
        delete next[positionId]
      } else {
        next[positionId] = null
      }
      return next
    })
  }, [])

  const handleSelectUser = useCallback((positionId: string, userId: string | null) => {
    setAssignments((current) => ({ ...current, [positionId]: userId }))
  }, [])

  const handleCreatePosition = useCallback(async () => {
    const trimmed = newPositionName.trim()
    if (trimmed.length < POSITION_NAME_MIN_LENGTH) return
    try {
      const created = await onCreatePosition({ name: trimmed })
      setNewPositionName('')
      if (created && typeof created === 'object' && 'id' in created) {
        setAssignments((current) => ({ ...current, [(created as { id: string }).id]: null }))
      }
    } catch {
      return
    }
  }, [newPositionName, onCreatePosition])

  const handleSubmit = useCallback(() => {
    if (pending) return
    const result: IUnitAssignment[] = positions
      .filter((position) => position.id in assignments)
      .map((position) => ({ positionId: position.id, userId: assignments[position.id] ?? null }))
    onSubmit(result)
  }, [pending, onSubmit, positions, assignments])

  return {
    open,
    assignments,
    newPositionName,
    setNewPositionName,
    searchQuery,
    setSearchQuery,
    filteredPositions,
    editingId,
    setEditingId,
    toggle,
    handleSelectUser,
    handleCreatePosition,
    handleSubmit,
  }
}
