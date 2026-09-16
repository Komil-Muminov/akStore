import { Router } from 'express'
import { rbacMiddleware } from '../middleware'
import { hostsService } from '../services'
import { UserRole } from '../types'
import { respond } from './respond'

const anyRole = rbacMiddleware(UserRole.EMPLOYEE)

export const hostsRouter = Router()

hostsRouter.get('/search', anyRole, respond(() => hostsService.search()))
