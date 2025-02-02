// src/tests/auth.test.ts

import request from 'supertest'
import express from 'express'
import authRouter from '../routes/authRoutes'

const app = express()
app.use(express.json())
app.use(authRouter)

describe('POST /register', () => {
  it('должен зарегистрировать нового пользователя и вернуть сообщение об успехе', async () => {
    const response = await request(app).post('/register').send({
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      password: 'password123',
    })

    expect(response.status).toBe(201)
    expect(response.body.message).toBe('Пользователь успешно зарегистрирован')
  })
})
