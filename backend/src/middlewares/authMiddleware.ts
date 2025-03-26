import dotenv from 'dotenv'
import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

dotenv.config()
const secret = process.env.JWT_SECRET

if (!secret) {
  throw new Error('JWT_SECRET is not defined')
}

interface JwtPayload {
  userId: string
  role: string
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(401).json({ message: 'Токен не предоставлен' })
    }

    const decoded = jwt.verify(token, secret) as JwtPayload
    ;(req as Express.AuthenticatedRequest).userId = decoded.userId
    ;(req as Express.AuthenticatedRequest).role = decoded.role

    next()
  } catch (error) {
    return res.status(401).json({ message: 'Неверный токен' })
  }
}

export default authMiddleware
