import commentRouter from './comment.routes'
import connectDB from './db'
import cors from 'cors'
import courseRouter from './courseRoutes'
import enrollmentRouter from './enrollmentRoutes'
import express from 'express'
import favoritesRouter from './favorites'
import lessonRouter from './lesson.routes'

const app = express()
app.use(cors())
connectDB()
app.use(express.json())

app.use('/api/courses', courseRouter)
app.use('/api/lessons', lessonRouter)
app.use('/api/enrollments', enrollmentRouter)
app.use('/api/comments', commentRouter)
app.use('/api/favorites', favoritesRouter)

if (require.main === module) {
  app.listen(5003, () => {
    console.log('Courses-service запущен на порту 5003')
  })
}

export { app }
