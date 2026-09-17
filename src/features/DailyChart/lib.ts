import type { IDailyPoint } from '@/entities/report'

const MIN_RATIO = 0.04

export const ratioOf = (point: IDailyPoint, points: IDailyPoint[]) => {
  const peak = points.reduce((max, entry) => Math.max(max, entry.revenue), 0)
  if (peak <= 0) return MIN_RATIO
  return Math.max(point.revenue / peak, MIN_RATIO)
}
