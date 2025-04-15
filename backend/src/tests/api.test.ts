import mongoose from 'mongoose'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '../app'
import { Course, Tag } from '../models/courseModel'
import { Favorite } from '../models/favoriteModel'
import { User } from '../models/userModel'

describe('API Tests', () => {
  let studentToken: string
  let teacherToken: string
  let courseId: string

  beforeAll(async () => {
    // Очищаем базу данных перед тестами
    await User.deleteMany({})
    await Course.deleteMany({})
    await Tag.deleteMany({})
    await Favorite.deleteMany({})

    // Регистрируем студента
    const studentResponse = await request(app).post('/api/auth/register').send({
      firstName: 'Student',
      lastName: 'Test',
      login: 'student@test.com',
      password: 'password123',
      role: 'student',
    })

    studentToken = studentResponse.body.token

    // Регистрируем преподавателя
    const teacherResponse = await request(app).post('/api/auth/register').send({
      firstName: 'Teacher',
      lastName: 'Test',
      login: 'teacher@test.com',
      password: 'password123',
      role: 'teacher',
    })

    teacherToken = teacherResponse.body.token
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })

  describe('Auth API', () => {
    it('should register a new user', async () => {
      const response = await request(app).post('/api/auth/register').send({
        firstName: 'New',
        lastName: 'User',
        login: 'new@test.com',
        password: 'password123',
        role: 'student',
      })

      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('token')
    })

    it('should login user', async () => {
      const response = await request(app).post('/api/auth/login').send({
        login: 'student@test.com',
        password: 'password123',
      })

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('token')
    })

    it('should get user data', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${studentToken}`)

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('firstName')
      expect(response.body).toHaveProperty('lastName')
      expect(response.body).toHaveProperty('login')
      expect(response.body).toHaveProperty('role')
    })

    it('should delete user', async () => {
      const response = await request(app)
        .delete('/api/auth/delete')
        .set('Authorization', `Bearer ${studentToken}`)

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('message')
    })
  })

  describe('Course API', () => {
    it('should not allow student to create a course', async () => {
      const response = await request(app)
        .post('/api/courses/courses')
        .set('Authorization', `Bearer ${studentToken}`)
        .field('title', 'Test Course')
        .field('description', 'Test Description')
        .field('price', '100')
        .field('category', 'programming')
        .field('level', 'beginner')
        .attach('image', './test-image.jpg')

      expect(response.status).toBe(403)
      expect(response.body.message).toBe(
        'Доступ запрещен. Требуется роль учителя.',
      )
    })

    it('should allow teacher to create a new course', async () => {
      const response = await request(app)
        .post('/api/courses/courses')
        .set('Authorization', `Bearer ${teacherToken}`)
        .field('title', 'Test Course')
        .field('description', 'Test Description')
        .field('price', '100')
        .field('category', 'programming')
        .field('level', 'beginner')
        .attach('image', './test-image.jpg')

      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('_id')
      courseId = response.body._id
    })

    it('should get all courses', async () => {
      const response = await request(app).get('/api/courses/courses')

      expect(response.status).toBe(200)
    })

    it('should get course by id', async () => {
      const response = await request(app).get(
        `/api/courses/courses/${courseId}`,
      )

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('_id')
    })

    it('should not allow student to update a course', async () => {
      const response = await request(app)
        .put(`/api/courses/${courseId}`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          title: 'Updated Course',
          price: 200,
        })

      expect(response.status).toBe(403)
      expect(response.body.message).toBe(
        'Доступ запрещен. Требуется роль учителя.',
      )
    })

    it('should not allow student to delete a course', async () => {
      const response = await request(app)
        .delete(`/api/courses/${courseId}`)
        .set('Authorization', `Bearer ${studentToken}`)

      expect(response.status).toBe(403)
      expect(response.body.message).toBe(
        'Доступ запрещен. Требуется роль учителя.',
      )
    })
  })

  describe('Favorite API', () => {
    it('should add course to favorites', async () => {
      const response = await request(app)
        .post(`/api/courses/${courseId}/favorite`)
        .set('Authorization', `Bearer ${studentToken}`)

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('message')
    })

    it('should get favorite courses', async () => {
      const response = await request(app)
        .get('/api/courses/favorites')
        .set('Authorization', `Bearer ${studentToken}`)

      expect(response.status).toBe(200)
      expect(Array.isArray(response.body)).toBe(true)
    })

    it('should remove course from favorites', async () => {
      const response = await request(app)
        .delete(`/api/courses/${courseId}/favorite`)
        .set('Authorization', `Bearer ${studentToken}`)

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('message')
    })
  })
})
