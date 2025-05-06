import { Schema, model, Types } from 'mongoose'

interface IFavorite {
  user: Types.ObjectId
  course: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const favoriteSchema = new Schema<IFavorite>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  },
  {
    timestamps: true,
  },
)

// Создаем составной индекс для предотвращения дублирования
favoriteSchema.index({ user: 1, course: 1 }, { unique: true })

const FavoriteCourse = model<IFavorite>('FavoriteCourse', favoriteSchema)

export { FavoriteCourse, IFavorite }
