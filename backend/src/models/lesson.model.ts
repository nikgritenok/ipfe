import { Schema, model, Types } from 'mongoose'

export interface ILesson {
  title: string
  content?: string
  videoUrl?: string
  course: Types.ObjectId
  order?: number
  createdAt: Date
}

const lessonSchema = new Schema<ILesson>(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: false,
    },
    videoUrl: {
      type: String,
      required: false,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    order: {
      type: Number,
      required: false,
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

export const Lesson = model<ILesson>('Lesson', lessonSchema)
