import { useEffect } from 'react'

interface IProps {
  canPark: boolean
  cartTotal: number
  onFocusSearch: () => void
  onPark: () => void
  onExactCash: () => void
  onExactCard: () => void
  onClear: () => void
}

export const usePosHotkeys = ({
  canPark,
  cartTotal,
  onFocusSearch,
  onPark,
  onExactCash,
  onExactCard,
  onClear,
}: IProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        e.preventDefault()
        onFocusSearch()
        return
      }
      if (e.key === 'F4') {
        e.preventDefault()
        if (canPark) onPark()
        return
      }
      if (e.key === 'F8') {
        e.preventDefault()
        if (cartTotal > 0) onExactCash()
        return
      }
      if (e.key === 'F9') {
        e.preventDefault()
        if (cartTotal > 0) onExactCard()
        return
      }
      if (e.key === 'Escape') {
        onClear()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [canPark, cartTotal, onFocusSearch, onPark, onExactCash, onExactCard, onClear])
}
