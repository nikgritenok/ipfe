import request from 'supertest'
import express from 'express'
import authRouter from '../routes/authRoutes'
import mongoose from 'mongoose'
import User from '../models/userModel'

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

beforeEach(async () => {
  await User.deleteMany({})
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

describe('GET /me', () => {
  it('должен возвращать данные о пользователе, если токен валиден', async () => {
    const registerResponse = await request(app).post('/register').send({
      firstName: 'John',
      lastName: 'Doe',
      login: 'johndoe',
      password: 'password123',
      role: 'student',
    })

    expect(registerResponse.status).toBe(201)

    const loginResponse = await request(app).post('/login').send({
      login: 'johndoe',
      password: 'password123',
    })

    expect(loginResponse.status).toBe(200)
    const token = loginResponse.body.token

    const response = await request(app)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.firstName).toBe('John')
    expect(response.body.lastName).toBe('Doe')
    expect(response.body.login).toBe('johndoe')
    expect(response.body.role).toBe('student')
  })

  it('должен возвращать ошибку, если токен не передан', async () => {
    const response = await request(app).get('/me')

    expect(response.status).toBe(403)
    expect(response.body.message).toBe('Требуется токен')
  })

  it('должен возвращать ошибку, если токен недействителен', async () => {
    const response = await request(app)
      .get('/me')
      .set('Authorization', 'Bearer invalid_token')

    expect(response.status).toBe(401)
    expect(response.body.message).toBe('Недействительный или истекший токен')
  })
})

describe('DELETE /delete', () => {
  it('должен удалять пользователя, если токен валиден', async () => {
    const registerResponse = await request(app).post('/register').send({
      firstName: 'John',
      lastName: 'Doe',
      login: 'johndoe',
      password: 'password123',
      role: 'student',
    })

    expect(registerResponse.status).toBe(201)

    const loginResponse = await request(app).post('/login').send({
      login: 'johndoe',
      password: 'password123',
    })

    expect(loginResponse.status).toBe(200)
    const token = loginResponse.body.token

    const userBeforeDelete = await User.findOne({ login: 'johndoe' })
    expect(userBeforeDelete).toBeTruthy()

    const deleteResponse = await request(app)
      .delete('/delete')
      .set('Authorization', `Bearer ${token}`)

    expect(deleteResponse.status).toBe(200)
    expect(deleteResponse.body.message).toBe('Пользователь успешно удален')

    const userAfterDelete = await User.findOne({ login: 'johndoe' })
    expect(userAfterDelete).toBeNull()
  })

  it('должен возвращать ошибку, если токен не передан', async () => {
    const response = await request(app).delete('/delete')

    expect(response.status).toBe(403)
    expect(response.body.message).toBe('Требуется токен')
  })

  it('должен возвращать ошибку, если токен недействителен', async () => {
    const response = await request(app)
      .delete('/delete')
      .set('Authorization', 'Bearer invalid_token')

    expect(response.status).toBe(401)
    expect(response.body.message).toBe('Недействительный или истекший токен')
  })
})
