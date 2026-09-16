import { useCallback, useMemo, useState } from 'react'
import { OrgCanvas } from '@/features/OrgCanvas'
import { PositionsManager } from '@/features/PositionsManager'
import { UnitDetails } from '@/features/UnitDetails'
import { UnitForm, type IUnitFormState } from '@/features/UnitForm'
import { UnitPositionsPicker } from '@/features/UnitPositionsPicker'
import type { IPoint, IUnit } from '@/entities/unit'
import type { IPosition, IPositionInput } from '@/entities/position'
import { ConfirmDialog, If, Spinner } from '@/shared/ui'
import { usePositionMutations, usePositionsQuery, useUnitMutations, useUnitsQuery } from './hooks'
import { createFormFor, inputFor, layoutItems, renameFormFor, rootOf } from './lib'
import { DELETE_DIALOG, DELETE_POSITION_DIALOG } from './model'
import { layout, main } from './style'
import { ErrorState } from './ui/ErrorState'
import { Toolbar } from './ui/Toolbar'

export const Structure = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [form, setForm] = useState<IUnitFormState | null>(null)
  const [picking, setPicking] = useState<IUnit | null>(null)
  const [deleting, setDeleting] = useState<IUnit | null>(null)
  const [deletingPosition, setDeletingPosition] = useState<IPosition | null>(null)
  const [positionsOpen, setPositionsOpen] = useState(false)
  const unitsQuery = useUnitsQuery()
  const positionsQuery = usePositionsQuery()
  const unitMutations = useUnitMutations()
  const positionMutations = usePositionMutations()

  const units = useMemo(() => unitsQuery.data ?? [], [unitsQuery.data])
  const positions = useMemo(() => positionsQuery.data ?? [], [positionsQuery.data])
  const root = useMemo(() => rootOf(units), [units])
  const selected = useMemo(() => units.find((unit) => unit.id === selectedId) ?? null, [units, selectedId])
  const refetch = unitsQuery.refetch

  const handleRetry = useCallback(() => void refetch(), [refetch])
  const closeForm = useCallback(() => setForm(null), [])
  const closePicker = useCallback(() => setPicking(null), [])
  const closeDetails = useCallback(() => setSelectedId(null), [])
  const cancelDelete = useCallback(() => setDeleting(null), [])
  const cancelDeletePosition = useCallback(() => setDeletingPosition(null), [])
  const openPositions = useCallback(() => setPositionsOpen(true), [])
  const closePositions = useCallback(() => setPositionsOpen(false), [])
  const openAddChild = useCallback((parent: IUnit) => setForm(createFormFor(parent)), [])
  const openRename = useCallback((unit: IUnit) => setForm(renameFormFor(unit)), [])
  const openAddManagement = useCallback(() => root && setForm(createFormFor(root)), [root])

  const { create, update, move, setLayout, setPositions, remove } = unitMutations
  const handleSubmitForm = useCallback(
    (name: string) => {
      if (!form) return
      const onSuccess = () => setForm(null)
      form.mode === 'rename' && form.unit
        ? update.mutate({ id: form.unit.id, name, point: { x: form.unit.x, y: form.unit.y } }, { onSuccess })
        : create.mutate(inputFor(units, form, name), { onSuccess: (unit) => { setForm(null); setSelectedId(unit.id) } })
    },
    [form, units, create, update],
  )
  const handleMoveNode = useCallback(
    (id: string, point: IPoint) => {
      const unit = units.find((entry) => entry.id === id)
      if (unit) update.mutate({ id, name: unit.name, point })
    },
    [units, update],
  )
  const handleAttach = useCallback((childId: string, parentId: string) => move.mutate({ id: childId, parentId }), [move])
  const handleAutoLayout = useCallback(() => setLayout.mutate({ items: layoutItems(units) }), [units, setLayout])
  const handleSubmitPositions = useCallback(
    (positionIds: string[]) => picking && setPositions.mutate({ id: picking.id, positionIds }, { onSuccess: () => setPicking(null) }),
    [picking, setPositions],
  )
  const handleDelete = useCallback(() => {
    if (!deleting) return
    remove.mutate(deleting.id, { onSuccess: () => { setDeleting(null); setSelectedId(null) } })
  }, [deleting, remove])
  const handleCreatePosition = useCallback((input: IPositionInput) => positionMutations.create.mutate(input), [positionMutations.create])
  const handleDeletePosition = useCallback(() => {
    if (!deletingPosition) return
    positionMutations.remove.mutate(deletingPosition.id, { onSuccess: () => setDeletingPosition(null) })
  }, [deletingPosition, positionMutations.remove])

  return (
    <div style={layout} testId="structure__layout">
      <div style={main}>
        <Toolbar canAddManagement={root !== null} onAddManagement={openAddManagement} onAutoLayout={handleAutoLayout} onPositions={openPositions} />
        <If condition={unitsQuery.isPending} fallback={
          <If condition={unitsQuery.isError} fallback={
            <OrgCanvas units={units} positions={positions} selectedId={selectedId} onSelect={setSelectedId} onMoveNode={handleMoveNode} onAttach={handleAttach} />
          }>
            <ErrorState details={unitsQuery.error?.message ?? ''} onRetry={handleRetry} />
          </If>
        }>
          <Spinner />
        </If>
      </div>
      <If condition={selected !== null}>
        {() => (
          <UnitDetails
            unit={selected as IUnit}
            units={units}
            positions={positions}
            pending={unitMutations.pending}
            onAddChild={openAddChild}
            onRename={openRename}
            onEditPositions={setPicking}
            onDelete={setDeleting}
            onClose={closeDetails}
          />
        )}
      </If>
      <UnitForm state={form} pending={create.isPending || update.isPending} error={form?.mode === 'rename' ? update.error?.message : create.error?.message} onSubmit={handleSubmitForm} onClose={closeForm} />
      <UnitPositionsPicker unit={picking} positions={positions} pending={setPositions.isPending} error={setPositions.error?.message} onSubmit={handleSubmitPositions} onClose={closePicker} />
      <PositionsManager open={positionsOpen} positions={positions} pending={positionMutations.pending} error={positionMutations.create.error?.message ?? positionMutations.remove.error?.message} onCreate={handleCreatePosition} onDelete={setDeletingPosition} onClose={closePositions} />
      <ConfirmDialog open={deleting !== null} title={DELETE_DIALOG.title} text={DELETE_DIALOG.text} confirmLabel={DELETE_DIALOG.confirm} cancelLabel={DELETE_DIALOG.cancel} pending={remove.isPending} onConfirm={handleDelete} onCancel={cancelDelete} />
      <ConfirmDialog open={deletingPosition !== null} title={DELETE_POSITION_DIALOG.title} text={DELETE_POSITION_DIALOG.text} confirmLabel={DELETE_POSITION_DIALOG.confirm} cancelLabel={DELETE_POSITION_DIALOG.cancel} pending={positionMutations.remove.isPending} onConfirm={handleDeletePosition} onCancel={cancelDeletePosition} />
    </div>
  )
}
