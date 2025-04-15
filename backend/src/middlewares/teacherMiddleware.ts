import { NextFunction, Request, Response } from 'express'

const teacherMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (req.role !== 'teacher') {
      res
        .status(403)
        .json({ message: 'Доступ запрещен. Требуется роль учителя.' })
      return
    }
    next()
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при проверке роли' })
    return
  }
}

export default teacherMiddleware
