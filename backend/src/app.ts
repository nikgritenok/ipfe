import express from 'express'
import connectDB from './config/db'

const app = express()

app.use(express.json())
connectDB()

app.listen(5001, () => {
  console.log('Сервер запущен на порту 5001')
})
