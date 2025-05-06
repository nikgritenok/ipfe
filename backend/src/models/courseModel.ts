import mongoose, { Document, Schema, Types } from 'mongoose'
import slugify from 'slugify'
import { COURSE_LEVELS, CourseLevel } from '../constants/courseLevel'

interface ITag extends Document {
  name: string
}

interface ICourse extends Document {
  title: string
  slug: string
  description?: string
  price: number
  image: string
  category: string
  level: CourseLevel
  published: boolean
  author: Types.ObjectId
  tags: Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

const TagSchema = new Schema<ITag>({
  name: { type: String, required: true, unique: true },
})

const Tag = mongoose.model<ITag>('Tag', TagSchema)

const CourseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    category: { type: String, required: true },
    level: {
      type: String,
      required: true,
      enum: Object.values(COURSE_LEVELS),
    },
    published: { type: Boolean, default: false },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  },
  {
    timestamps: true,
  },
)

CourseSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true })
  }
  next()
})

const Course = mongoose.model<ICourse>('Course', CourseSchema)

export { Course, Tag, ICourse, ITag }
