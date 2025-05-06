import { Router } from 'express'
import { commentController } from '../controllers/comment.controller'
import authMiddleware from '../middlewares/authMiddleware'

const router = Router()

/**
 * @swagger
 * /api/comments:
 *   post:
 *     summary: Создание нового комментария
 *     tags: [Комментарии]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - lesson
 *               - text
 *             properties:
 *               lesson:
 *                 type: string
 *                 description: ID урока
 *               text:
 *                 type: string
 *                 description: Текст комментария
 *                 maxLength: 255
 *     responses:
 *       201:
 *         description: Комментарий успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Ошибка при создании комментария
 */
router.post('/', authMiddleware, commentController.create)

/**
 * @swagger
 * /api/comments/lesson/{lessonId}:
 *   get:
 *     summary: Получение всех комментариев к уроку
 *     tags: [Комментарии]
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID урока
 *     responses:
 *       200:
 *         description: Список комментариев
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Ошибка при получении комментариев
 */
router.get('/lesson/:lessonId', commentController.getAllByLesson)

/**
 * @swagger
 * /api/comments/{id}:
 *   put:
 *     summary: Обновление комментария
 *     tags: [Комментарии]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID комментария
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 description: Текст комментария
 *                 maxLength: 255
 *     responses:
 *       200:
 *         description: Комментарий успешно обновлен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Комментарий не найден или нет прав на редактирование
 */
router.put('/:id', authMiddleware, commentController.update)

/**
 * @swagger
 * /api/comments/{id}:
 *   delete:
 *     summary: Удаление комментария
 *     tags: [Комментарии]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID комментария
 *     responses:
 *       200:
 *         description: Комментарий успешно удален
 *       404:
 *         description: Комментарий не найден или нет прав на удаление
 */
router.delete('/:id', authMiddleware, commentController.delete)

export default router
