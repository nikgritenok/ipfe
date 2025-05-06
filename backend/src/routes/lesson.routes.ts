import { Router } from 'express'
import { lessonController } from '../controllers/lesson.controller'
import authMiddleware from '../middlewares/authMiddleware'

const router = Router()

/**
 * @swagger
 * /api/lessons:
 *   post:
 *     summary: Создание нового урока
 *     tags: [Уроки]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - course
 *             properties:
 *               title:
 *                 type: string
 *                 description: Заголовок урока
 *               content:
 *                 type: string
 *                 description: Содержание урока
 *               videoUrl:
 *                 type: string
 *                 description: URL видео
 *               course:
 *                 type: string
 *                 description: ID курса
 *               order:
 *                 type: number
 *                 description: Порядковый номер урока
 *     responses:
 *       201:
 *         description: Урок успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lesson'
 *       400:
 *         description: Ошибка при создании урока
 */
router.post('/', authMiddleware, lessonController.create)

/**
 * @swagger
 * /api/lessons/course/{courseId}:
 *   get:
 *     summary: Получение всех уроков курса
 *     tags: [Уроки]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID курса
 *     responses:
 *       200:
 *         description: Список уроков
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Lesson'
 *       400:
 *         description: Ошибка при получении уроков
 */
router.get('/course/:courseId', lessonController.getAllByCourse)

/**
 * @swagger
 * /api/lessons/{id}:
 *   get:
 *     summary: Получение конкретного урока
 *     tags: [Уроки]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID урока
 *     responses:
 *       200:
 *         description: Урок найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lesson'
 *       404:
 *         description: Урок не найден
 */
router.get('/:id', lessonController.getOne)

/**
 * @swagger
 * /api/lessons/{id}:
 *   put:
 *     summary: Обновление урока
 *     tags: [Уроки]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID урока
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               videoUrl:
 *                 type: string
 *               order:
 *                 type: number
 *     responses:
 *       200:
 *         description: Урок успешно обновлен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lesson'
 *       404:
 *         description: Урок не найден
 */
router.put('/:id', authMiddleware, lessonController.update)

/**
 * @swagger
 * /api/lessons/{id}:
 *   delete:
 *     summary: Удаление урока
 *     tags: [Уроки]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID урока
 *     responses:
 *       200:
 *         description: Урок успешно удален
 *       404:
 *         description: Урок не найден
 */
router.delete('/:id', authMiddleware, lessonController.delete)

export default router
