import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'
import { useGpuix, useWindowSize, type ElementBounds, type PublicInstance } from '@gpuix/react'

const EMPTY: ElementBounds = { x: 0, y: 0, width: 0, height: 0 }

const same = (a: ElementBounds, b: ElementBounds) =>
  a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height

type TResult = [RefObject<PublicInstance | null>, ElementBounds, () => ElementBounds]

export const useElementBounds = (): TResult => {
  const ref = useRef<PublicInstance | null>(null)
  const { renderer } = useGpuix()
  const windowSize = useWindowSize()
  const [bounds, setBounds] = useState<ElementBounds>(EMPTY)

  const read = useCallback((): ElementBounds => {
    const id = ref.current?.id
    return (id === undefined ? null : renderer?.getElementBounds?.(id)) ?? EMPTY
  }, [renderer])

  const measure = useCallback(() => {
    const next = read()
    setBounds((current) => (next.width > 0 && !same(current, next) ? next : current))
    return next
  }, [read])

  useEffect(() => {
    const timer = setTimeout(measure, 0)
    return () => clearTimeout(timer)
  })

  useEffect(() => {
    measure()
  }, [measure, windowSize.width, windowSize.height])

  return [ref, bounds, measure]
}
