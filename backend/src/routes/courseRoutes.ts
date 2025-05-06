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
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
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
 *               $ref: '#/components/schemas/Course'
 *         links:
 *           getLessons:
 *             $ref: '#/components/links/GetCourseLessons'
 *           getComments:
 *             $ref: '#/components/links/GetCourseComments'
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
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Курс успешно создан
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
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Курс успешно обновлен
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

/**
 * @swagger
 * /api/favorites/{courseId}:
 *   post:
 *     tags:
 *       - Избранное
 *     summary: Добавление курса в избранное
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Курс добавлен в избранное
 *       401:
 *         description: Не авторизован
 *       404:
 *         description: Курс не найден
 */
router.post('/favorites/:courseId', authMiddleware, addToFavorites)

/**
 * @swagger
 * /api/favorites/{courseId}:
 *   delete:
 *     tags:
 *       - Избранное
 *     summary: Удаление курса из избранного
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Курс удален из избранного
 *       401:
 *         description: Не авторизован
 *       404:
 *         description: Курс не найден
 */
router.delete('/favorites/:courseId', authMiddleware, removeFromFavorites)

/**
 * @swagger
 * /api/favorites:
 *   get:
 *     tags:
 *       - Избранное
 *     summary: Получение списка избранных курсов
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список избранных курсов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 *       401:
 *         description: Не авторизован
 */
router.get('/favorites', authMiddleware, getFavorites)

export default router
