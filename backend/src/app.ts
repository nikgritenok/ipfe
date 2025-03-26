import path from 'path'
import cors from 'cors'
import express from 'express'
import connectDB from './config/db'
import authRouter from './routes/authRoutes'
import courseRouter from './routes/courseRoutes'

const app = express()
app.use(cors())

connectDB()

app.use(express.json())

app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

app.use(authRouter)
app.use(courseRouter)

app.listen(5001, () => {
  console.log('Сервер запущен на порту 5001')
})
