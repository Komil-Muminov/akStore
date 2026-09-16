import { passesDb } from '../db'
import { HttpError, HttpStatus } from '../shared/utils'
import { PassStatus, type ICreatePassDto, type IPass } from '../types'

export const passesService = {
  search: (): Promise<IPass[]> => passesDb.search(),
  create: (dto: ICreatePassDto): Promise<IPass> => passesDb.create(dto.holderName),
  deactivate: async (id: string): Promise<IPass> => {
    const pass = await passesDb.setStatus(id, PassStatus.REVOKED)
    if (!pass) throw new HttpError(HttpStatus.NOT_FOUND, 'Пропуск не найден')
    return pass
  },
}
