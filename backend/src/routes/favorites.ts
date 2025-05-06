import { Response, Router } from 'express'
import { Types } from 'mongoose'
import authMiddleware from '../middlewares/authMiddleware'
import { FavoriteCourse } from '../models/favoriteModel'
import { AuthRequest } from '../types/auth'

const router = Router()

/**
 * @swagger
 * /api/favorites/{courseId}:
 *   post:
 *     summary: Добавление курса в избранное
 *     tags: [Избранное]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID курса
 *     responses:
 *       201:
 *         description: Курс успешно добавлен в избранное
 *       400:
 *         description: Курс уже в избранном
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.post(
  '/:courseId',
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const courseId = new Types.ObjectId(req.params.courseId)
      const userId = req.user._id

      const existingFavorite = await FavoriteCourse.findOne({
        user: userId,
        course: courseId,
      })
      if (existingFavorite) {
        res.status(400).json({ message: 'Курс уже в избранном' })
        return
      }

      const favoriteCourse = new FavoriteCourse({
        user: userId,
        course: courseId,
      })

      await favoriteCourse.save()
      res.status(201).json(favoriteCourse)
    } catch (error) {
      res.status(500).json({ message: 'Что-то пошло не так' })
    }
  },
)

/**
 * @swagger
 * /api/favorites:
 *   get:
 *     summary: Получение списка избранных курсов
 *     tags: [Избранное]
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
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   user:
 *                     type: string
 *                   course:
 *                     $ref: '#/components/schemas/Course'
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.get(
  '/',
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const favorites = await FavoriteCourse.find({
        user: req.user._id,
      }).populate('course')
      res.json(favorites)
    } catch (error) {
      res.status(500).json({ message: 'Что-то пошло не так' })
    }
  },
)

/**
 * @swagger
 * /api/favorites/{courseId}:
 *   delete:
 *     summary: Удаление курса из избранного
 *     tags: [Избранное]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID курса
 *     responses:
 *       200:
 *         description: Курс успешно удален из избранного
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.delete(
  '/:courseId',
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const courseId = new Types.ObjectId(req.params.courseId)
      await FavoriteCourse.findOneAndDelete({
        user: req.user._id,
        course: courseId,
      })
      res.json({ message: 'Курс удален из избранного' })
    } catch (error) {
      res.status(500).json({ message: 'Что-то пошло не так' })
    }
  },
)

export default router
