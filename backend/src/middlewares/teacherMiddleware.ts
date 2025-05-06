import { NextFunction, Request, Response } from 'express'
import { USER_ROLES } from '../constants/roles'

const teacherMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (!req.userId || !req.role) {
    res.status(401).json({ message: 'Не авторизован' })
    return
  }

  if (req.role !== USER_ROLES.TEACHER) {
    res.status(403).json({ message: 'Доступ запрещен' })
    return
  }

  next()
}

export default teacherMiddleware
