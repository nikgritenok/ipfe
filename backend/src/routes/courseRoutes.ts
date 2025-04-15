import express from 'express'
import {
  addToFavorites,
  createCourse,
  deleteCourse,
  getAllCourses,
  getCourseById,
  getFavorites,
  removeFromFavorites,
  updateCourse,
} from '../controllers/courseController'
import authMiddleware from '../middlewares/authMiddleware'
import teacherMiddleware from '../middlewares/teacherMiddleware'
import { upload } from '../utils/fileUpload'

const router = express.Router()

// Маршруты для курсов
router.get('/courses', getAllCourses)
router.get('/courses/:id', getCourseById)
router.post(
  '/courses',
  authMiddleware,
  teacherMiddleware,
  upload.single('image'),
  createCourse,
)
router.put(
  '/courses/:id',
  authMiddleware,
  teacherMiddleware,
  upload.single('image'),
  updateCourse,
)
router.delete('/courses/:id', authMiddleware, teacherMiddleware, deleteCourse)

// Маршруты для избранных курсов
router.post('/favorites/:courseId', authMiddleware, addToFavorites)
router.delete('/favorites/:courseId', authMiddleware, removeFromFavorites)
router.get('/favorites', authMiddleware, getFavorites)

export default router
