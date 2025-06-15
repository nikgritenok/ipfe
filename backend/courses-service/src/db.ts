import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    await mongoose.connect(
      'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000',
    )
    console.log('MongoDB подключен!')
  } catch (error) {
    console.error('Ошибка подключения к MongoDB', error)
    process.exit(1)
  }
}

export default connectDB
