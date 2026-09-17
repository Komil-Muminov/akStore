import type { IColleague } from '@/entities/message'

export const filterCompanions = (companions: IColleague[], query: string, currentUserId: string) => {
  const needle = query.trim().toLowerCase()
  return companions.filter(
    (companion) =>
      companion.userId !== currentUserId &&
      (companion.fullName.toLowerCase().includes(needle) || companion.login.toLowerCase().includes(needle)),
  )
}
