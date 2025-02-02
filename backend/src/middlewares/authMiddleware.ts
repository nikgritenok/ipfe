import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res.status(403).json({ message: 'Token is required' })
  }

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret')
    req.userId = (decoded as any).userId
    req.role = (decoded as any).role
    next()
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' })
  }
}

export default authMiddleware
