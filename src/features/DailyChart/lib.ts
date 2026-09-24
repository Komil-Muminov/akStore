import type { IDailyPoint, IHourlyPoint } from '@/entities/report'

const MIN_RATIO = 0.04

export const ratioOf = (point: IDailyPoint, points: IDailyPoint[]) => {
  const peak = points.reduce((max, entry) => Math.max(max, entry.revenue), 0)
  if (peak <= 0) return MIN_RATIO
  return Math.max(point.revenue / peak, MIN_RATIO)
}

export const hourlyRatioOf = (point: IHourlyPoint, points: IHourlyPoint[]) => {
  const peak = points.reduce((max, entry) => Math.max(max, entry.revenue), 0)
  if (peak <= 0) return MIN_RATIO
  return Math.max(point.revenue / peak, MIN_RATIO)
}

export const peakHourOf = (points: IHourlyPoint[]) => {
  if (points.length === 0) return null
  return points.reduce((best, cur) => (cur.revenue > best.revenue ? cur : best), points[0])
}
