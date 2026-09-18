import { CashDialog } from '@/features/CashDialog'
import { ParkedSales } from '@/features/ParkedSales'
import type { useCashMoves } from '../cash'
import type { useParked } from '../parked'

interface IProps {
  cash: ReturnType<typeof useCashMoves>
  parked: ReturnType<typeof useParked>
}

export const SaleDialogs = ({ cash, parked }: IProps) => (
  <>
      <CashDialog
        open={cash.open}
        moves={cash.moves}
        pending={cash.pending}
        error={cash.error}
        onMove={cash.handleMove}
        onClose={cash.closeDialog}
      />
      <ParkedSales
        open={parked.open}
        parked={parked.parked}
        pending={parked.pending}
        error={parked.error}
        onRestore={parked.handleRestore}
        onRemove={parked.handleRemove}
        onClose={parked.closeDialog}
      />
  </>
)
