import express from 'express'
import cors from 'cors'
import connectDB from './db'
import authRouter from './authRoutes'

const app = express()
app.use(cors())
connectDB()
app.use(express.json())
app.use('/api/auth', authRouter)

if (require.main === module) {
  app.listen(5002, () => {
    console.log('User-service запущен на порту 5002')
  })
}

export { app }
