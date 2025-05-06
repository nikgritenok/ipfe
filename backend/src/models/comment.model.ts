import { Schema, model, Types } from 'mongoose'

export interface IComment {
  user: Types.ObjectId
  lesson: Types.ObjectId
  text: string
  createdAt: Date
}

const commentSchema = new Schema<IComment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    lesson: {
      type: Schema.Types.ObjectId,
      ref: 'Lesson',
      required: true,
    },
    text: {
      type: String,
      required: true,
      maxlength: 255,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

export const Comment = model<IComment>('Comment', commentSchema)
