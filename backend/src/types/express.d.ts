import { Request, Response, RequestHandler, NextFunction } from 'express'

// Расширяем Request для поддержки пользовательских свойств
declare global {
  namespace Express {
    interface Request {
      userId?: string
      role?: string
      file?: Express.Multer.File
    }
    export interface AuthenticatedRequest extends Request {
      userId: string
      role: string
    }
  }
}

// Тип для асинхронных обработчиков
export type AsyncRequestHandler<
  P = {},
  ResBody = any,
  ReqBody = any,
  ReqQuery = any,
> = (
  req: Request<P, ResBody, ReqBody, ReqQuery>,
  res: Response<ResBody>,
  next: NextFunction,
) => Promise<void>

// Общие типы для ответов API
export interface ApiResponse<T = any> {
  status: 'success' | 'fail' | 'error'
  message?: string
  results?: number
  total?: number
  totalPages?: number
  currentPage?: number
  data?: T
  error?: string
}

// Типы для параметров запросов
export interface PaginationQuery {
  page?: string
  limit?: string
  sort?: string
  order?: string
}

export interface CourseQuery extends PaginationQuery {
  category?: string
  level?: string
  search?: string
  tag?: string
  published?: string
}

// Типы для тела запросов
export interface CourseBody {
  title: string
  description: string
  price: number
  category: string
  level?: string
  published?: boolean
  tags?: string
}

// Параметры URL
export interface CourseParams {
  id?: string
  courseId?: string
}

export {}
