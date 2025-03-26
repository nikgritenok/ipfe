import mongoose, { Document, Schema } from 'mongoose'

interface IFavorite extends Document {
  user: mongoose.Types.ObjectId
  course: mongoose.Types.ObjectId
  createdAt: Date
}

const FavoriteSchema = new Schema<IFavorite>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  createdAt: { type: Date, default: Date.now },
})

// Создаем составной индекс для предотвращения дублирования
FavoriteSchema.index({ user: 1, course: 1 }, { unique: true })

const Favorite = mongoose.model<IFavorite>('Favorite', FavoriteSchema)

export { Favorite, IFavorite }
