import { Request } from 'express'

// Базовый интерфейс для данных пользователя в JWT
export interface JwtUserData {
  userId: string
  role: string
}

// Расширяем Request для поддержки JWT данных
declare global {
  namespace Express {
    interface Request {
      userId?: string
      role?: string
    }
  }
}

// JwtPayload использует Partial для опциональных полей
export type JwtPayload = Partial<JwtUserData> & {
  iat?: number
  exp?: number
}
