import request from 'supertest'
import express from 'express'
import authRouter from '../routes/authRoutes'
import mongoose from 'mongoose'

const app = express()
app.use(express.json())
app.use(authRouter)

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/testdb')
  console.log('MongoDB подключен!')
})

afterAll(async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
})

describe('POST /register', () => {
  it('должен зарегистрировать нового пользователя и вернуть сообщение об успехе', async () => {
    const response = await request(app).post('/register').send({
      firstName: 'John',
      lastName: 'Doe',
      login: 'johndoe',
      password: 'password123',
      role: 'student',
    })

    expect(response.status).toBe(201)
    expect(response.body.message).toBe('Пользователь успешно зарегистрирован')
  })
})

describe('GET /test', () => {
  it('должен возвращать сообщение об успешном выполнении', async () => {
    const response = await request(app).get('/test')

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('test')
  })
})

describe('POST /login', () => {
  it('должен авторизовать пользователя и вернуть токен', async () => {
    await request(app).post('/register').send({
      firstName: 'John',
      lastName: 'Doe',
      login: 'johndoe',
      password: 'password123',
      role: 'student',
    })

    const response = await request(app).post('/login').send({
      login: 'johndoe',
      password: 'password123',
    })

    expect(response.status).toBe(200)
    expect(response.body.token).toBeDefined()
  })

  it('должен вернуть ошибку при неправильном пароле', async () => {
    await request(app).post('/register').send({
      firstName: 'John',
      lastName: 'Doe',
      login: 'johndoe',
      password: 'password123',
      role: 'student',
    })

    const response = await request(app).post('/login').send({
      login: 'johndoe',
      password: 'wrongpassword',
    })

    expect(response.status).toBe(400)
    expect(response.body.message).toBe('Неверный пароль')
  })

  it('должен вернуть ошибку при неправильном логине', async () => {
    const response = await request(app).post('/login').send({
      login: 'nonexistentuser',
      password: 'password123',
    })

    expect(response.status).toBe(404)
    expect(response.body.message).toBe('Пользователь не найден')
  })
})
