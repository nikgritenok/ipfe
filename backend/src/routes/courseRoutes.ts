import express from 'express'
import {
  createCourse,
  deleteCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
} from '../controllers/courseController'
import authMiddleware from '../middlewares/authMiddleware'
import teacherMiddleware from '../middlewares/teacherMiddleware'
import { upload } from '../utils/fileUpload'

const router = express.Router()

/**
 * @swagger
 * /api/courses:
 *   get:
 *     tags:
 *       - Курсы
 *     summary: Получение списка всех курсов
 *     responses:
 *       200:
 *         description: Список курсов
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 results:
 *                   type: number
 *                 total:
 *                   type: number
 *                 totalPages:
 *                   type: number
 *                 currentPage:
 *                   type: number
 *                 data:
 *                   type: object
 *                   properties:
 *                     courses:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           title:
 *                             type: string
 *                           slug:
 *                             type: string
 *                           description:
 *                             type: string
 *                           price:
 *                             type: number
 *                           image:
 *                             type: string
 *                           category:
 *                             type: string
 *                           level:
 *                             type: string
 *                           published:
 *                             type: boolean
 *                           author:
 *                             type: object
 *                             nullable: true
 *                             properties:
 *                               _id:
 *                                 type: string
 *                               firstName:
 *                                 type: string
 *                               lastName:
 *                                 type: string
 *                           tags:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 _id:
 *                                   type: string
 *                                 name:
 *                                   type: string
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 */
router.get('/', getAllCourses)

/**
 * @swagger
 * /api/courses/{id}:
 *   get:
 *     tags:
 *       - Курсы
 *     summary: Получение курса по ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Данные курса
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     course:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         title:
 *                           type: string
 *                         slug:
 *                           type: string
 *                         description:
 *                           type: string
 *                         price:
 *                           type: number
 *                         image:
 *                           type: string
 *                         category:
 *                           type: string
 *                         level:
 *                           type: string
 *                         published:
 *                           type: boolean
 *                         author:
 *                           type: object
 *                           nullable: true
 *                           properties:
 *                             _id:
 *                               type: string
 *                             firstName:
 *                               type: string
 *                             lastName:
 *                               type: string
 *                         tags:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                               name:
 *                                 type: string
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *       404:
 *         description: Курс не найден
 */
router.get('/:id', getCourseById)

/**
 * @swagger
 * /api/courses:
 *   post:
 *     tags:
 *       - Курсы
 *     summary: Создание нового курса
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - price
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               level:
 *                 type: string
 *                 enum: [beginner, intermediate, advanced]
 *                 default: beginner
 *               tags:
 *                 type: string
 *                 description: JSON-строка с массивом тегов, например ["JavaScript", "React"]
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Курс успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     course:
 *                       type: object
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Нет прав преподавателя
 */
router.post(
  '/',
  authMiddleware,
  teacherMiddleware,
  upload.single('image'),
  createCourse,
)

/**
 * @swagger
 * /api/courses/{id}:
 *   put:
 *     tags:
 *       - Курсы
 *     summary: Обновление курса
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               level:
 *                 type: string
 *                 enum: [beginner, intermediate, advanced]
 *               published:
 *                 type: boolean
 *               tags:
 *                 type: string
 *                 description: JSON-строка с массивом тегов, например ["JavaScript", "React"]
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Курс успешно обновлен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     course:
 *                       type: object
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Нет прав преподавателя
 *       404:
 *         description: Курс не найден
 */
router.put(
  '/:id',
  authMiddleware,
  teacherMiddleware,
  upload.single('image'),
  updateCourse,
)

/**
 * @swagger
 * /api/courses/{id}:
 *   delete:
 *     tags:
 *       - Курсы
 *     summary: Удаление курса
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Курс успешно удален
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Нет прав преподавателя
 *       404:
 *         description: Курс не найден
 */
router.delete('/:id', authMiddleware, teacherMiddleware, deleteCourse)

export default router
