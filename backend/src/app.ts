import express from 'express'
import connectDB from './config/db'
import authRouter from './routes/authRoutes'
import cors from 'cors'

const app = express()
app.use(cors())

app.use(express.json())
app.use(authRouter)

connectDB()

app.listen(5001, () => {
  console.log('Сервер запущен на порту 5001')
})
