import { Request } from 'express'
import { Types } from 'mongoose'

export interface AuthRequest extends Request {
  user: {
    _id: Types.ObjectId
    email: string
    name: string
    role: string
  }
}
