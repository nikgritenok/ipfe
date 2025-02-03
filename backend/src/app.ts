import express from 'express'
import connectDB from './config/db'
import authRouter from './routes/authRoutes'

const app = express()

app.use(express.json())
app.use(authRouter)
connectDB()

app.listen(5001, () => {
  console.log('Сервер запущен на порту 5001')
})
