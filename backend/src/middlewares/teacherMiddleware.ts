import { Request, Response, NextFunction } from 'express'
import { USER_ROLES } from '../constants/roles'

export const teacherMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Не авторизован' })
  }

  if (req.role !== USER_ROLES.TEACHER) {
    return res.status(403).json({ message: 'Доступ запрещен' })
  }

  next()
}
