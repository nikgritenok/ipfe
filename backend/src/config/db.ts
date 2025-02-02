import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/mydb')
    console.log('MongoDB подключен!')
  } catch (error) {
    console.error('Ошибка подключения к MongoDB', error)
    process.exit(1)
  }
}

export default connectDB
