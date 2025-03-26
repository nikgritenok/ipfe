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

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      res.status(401).json({ message: 'Токен не предоставлен' })
      return
    }

    const decoded = jwt.verify(token, secret) as JwtPayload
    req.userId = decoded.userId
    req.role = decoded.role

    next()
  } catch (error) {
    res.status(401).json({ message: 'Неверный токен' })
    return
  }
}

export default authMiddleware
