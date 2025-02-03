import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()
const secret = process.env.JWT_SECRET

if (!secret) {
  throw new Error('JWT_SECRET is not defined')
}

interface CustomRequest extends Request {
  userId?: string
  role?: string
}

interface JwtPayload {
  userId: string
  role: string
}

const authMiddleware = (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    res.status(403).json({ message: 'Требуется токен' })
    return
  }

  try {
    const decoded = jwt.verify(token, secret)

    if (typeof decoded === 'object' && decoded !== null) {
      req.userId = (decoded as JwtPayload).userId
      req.role = (decoded as JwtPayload).role
      next()
    } else {
      res.status(401).json({ message: 'Недействительный или истекший токен' })
    }
  } catch (error) {
    res.status(401).json({ message: 'Недействительный или истекший токен' })
  }
}

export default authMiddleware
