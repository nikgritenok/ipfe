import mongoose, { Document, Schema, Types } from 'mongoose'

export interface IEnrollment extends Document {
  user: Types.ObjectId
  course: Types.ObjectId
  enrolledAt: Date
  completedLessons: Types.ObjectId[]
  isCompleted: boolean
  progress: number
}

const EnrollmentSchema = new Schema<IEnrollment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    completedLessons: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Lesson',
      },
    ],
    isCompleted: {
      type: Boolean,
      default: false,
    },
    progress: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

EnrollmentSchema.index({ user: 1, course: 1 }, { unique: true })

export const Enrollment = mongoose.model<IEnrollment>(
  'Enrollment',
  EnrollmentSchema,
)
