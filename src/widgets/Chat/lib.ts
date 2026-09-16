import type { IHost } from '@/entities/host'

export const filterCompanions = (companions: IHost[], query: string, currentUserId: string) => {
  const needle = query.trim().toLowerCase()
  return companions.filter(
    (companion) =>
      companion.userId !== currentUserId &&
      (companion.fullName.toLowerCase().includes(needle) || companion.login.toLowerCase().includes(needle)),
  )
}
