import { Response, Router } from 'express'
import { Types } from 'mongoose'
import authMiddleware from '../middlewares/authMiddleware'
import { FavoriteCourse } from '../models/favoriteModel'
import { AsyncRequestHandler } from '../types/express'

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
 *                     favorite:
 *                       type: object
 *       400:
 *         description: Курс уже в избранном
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.post('/:courseId', authMiddleware, async (req, res) => {
  try {
    const courseId = new Types.ObjectId(req.params.courseId)
    const userId = req.userId

    const existingFavorite = await FavoriteCourse.findOne({
      user: userId,
      course: courseId,
    })
    if (existingFavorite) {
      res.status(400).json({
        status: 'fail',
        message: 'Курс уже в избранном',
      })
      return
    }

    const favoriteCourse = new FavoriteCourse({
      user: userId,
      course: courseId,
    })

    await favoriteCourse.save()
    res.status(201).json({
      status: 'success',
      data: {
        favorite: favoriteCourse,
      },
    })
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Что-то пошло не так',
    })
  }
})

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
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 results:
 *                   type: number
 *                 data:
 *                   type: object
 *                   properties:
 *                     favorites:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           user:
 *                             type: string
 *                           course:
 *                             $ref: '#/components/schemas/Course'
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const favorites = await FavoriteCourse.find({
      user: req.userId,
    }).populate('course')

    res.status(200).json({
      status: 'success',
      results: favorites.length,
      data: {
        favorites,
      },
    })
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Что-то пошло не так',
    })
  }
})

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
 *       204:
 *         description: Курс успешно удален из избранного
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.delete('/:courseId', authMiddleware, async (req, res) => {
  try {
    const courseId = new Types.ObjectId(req.params.courseId)
    const result = await FavoriteCourse.findOneAndDelete({
      user: req.userId,
      course: courseId,
    })

    if (!result) {
      res.status(404).json({
        status: 'fail',
        message: 'Курс не найден в избранном',
      })
      return
    }

    res.status(204).json({
      status: 'success',
      data: null,
    })
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Что-то пошло не так',
    })
  }
})

export default router
