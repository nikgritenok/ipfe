import express from 'express'
import {
  cancelEnrollment,
  completeLesson,
  enrollInCourse,
  getCourseProgress,
  getCourseStudents,
  getCourseStudentsCount,
  getMyEnrollments,
  uncompleteLesson,
} from '../controllers/enrollmentController'
import authMiddleware from '../middlewares/authMiddleware'

const router = express.Router()

router.use(authMiddleware)

router.post('/', enrollInCourse)
router.get('/', getMyEnrollments)

router.get('/:courseId/progress', getCourseProgress)
router.post('/:courseId/complete-lesson', completeLesson)
router.post('/:courseId/uncomplete-lesson', uncompleteLesson)
router.delete('/:courseId/cancel', cancelEnrollment)

router.get('/courses/:courseId/students/count', getCourseStudentsCount)
router.get('/courses/:courseId/students', getCourseStudents)

export default router
