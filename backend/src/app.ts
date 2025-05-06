import path from 'path'
import cors from 'cors'
import express from 'express'
import swaggerUi from 'swagger-ui-express'
import connectDB from './config/db'
import { specs } from './config/swagger'
import authRouter from './routes/authRoutes'
import commentRouter from './routes/comment.routes'
import courseRouter from './routes/courseRoutes'
import lessonRouter from './routes/lesson.routes'

const app = express()
app.use(cors())

connectDB()

app.use(express.json())

app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// Swagger документация
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))

app.use('/api/auth', authRouter)
app.use('/api/courses', courseRouter)
app.use('/api/lessons', lessonRouter)
app.use('/api/comments', commentRouter)

// Запускаем сервер только если файл запущен напрямую
if (require.main === module) {
  app.listen(5001, () => {
    console.log('Сервер запущен на порту 5001')
  })
}

export { app }
