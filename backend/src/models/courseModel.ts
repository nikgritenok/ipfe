import mongoose, { Document, Schema } from 'mongoose'

import slugify from 'slugify'

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
  level: 'beginner' | 'intermediate' | 'advanced'
  published: boolean
  author: mongoose.Types.ObjectId
  tags: mongoose.Types.ObjectId[]
  createdAt: Date
}

const TagSchema = new Schema<ITag>({
  name: { type: String, required: true, unique: true },
})

const Tag = mongoose.model<ITag>('Tag', TagSchema)

const CourseSchema = new Schema<ICourse>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  level: {
    type: String,
    required: true,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner',
  },
  published: { type: Boolean, default: false },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  createdAt: { type: Date, default: Date.now },
})

CourseSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true })
  }
  next()
})

const Course = mongoose.model<ICourse>('Course', CourseSchema)



export { Course, Tag, ICourse, ITag }
