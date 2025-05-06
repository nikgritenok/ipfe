import path from 'path'
import cors from 'cors'
import express from 'express'
import swaggerUi from 'swagger-ui-express'
import connectDB from './config/db'
import { specs } from './config/swagger'
import authRouter from './routes/authRoutes'
import commentRouter from './routes/comment.routes'
import courseRouter from './routes/courseRoutes'
import enrollmentRouter from './routes/enrollmentRoutes'
import favoritesRouter from './routes/favorites'
import lessonRouter from './routes/lesson.routes'

const app = express()
app.use(cors())

connectDB()

app.use(express.json())

app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))

app.use('/api/auth', authRouter)
app.use('/api/courses', courseRouter)
app.use('/api/lessons', lessonRouter)
app.use('/api/comments', commentRouter)
app.use('/api/favorites', favoritesRouter)
app.use('/api/enrollments', enrollmentRouter)

if (require.main === module) {
  app.listen(5001, () => {
    console.log('Сервер запущен на порту 5001')
  })
}

export { app }
