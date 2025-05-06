import { Router } from 'express'
import { Types } from 'mongoose'
import { auth } from '../middleware/auth'
import { FavoriteCourse } from '../models/FavoriteCourse'

const router = Router()

router.post('/:courseId', auth, async (req, res) => {
  try {
    const courseId = new Types.ObjectId(req.params.courseId)
    const userId = req.user._id

    const existingFavorite = await FavoriteCourse.findOne({
      user: userId,
      course: courseId,
    })
    if (existingFavorite) {
      return res.status(400).json({ message: 'Курс уже в избранном' })
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
})

router.get('/', auth, async (req, res) => {
  try {
    const favorites = await FavoriteCourse.find({
      user: req.user._id,
    }).populate('course')
    res.json(favorites)
  } catch (error) {
    res.status(500).json({ message: 'Что-то пошло не так' })
  }
})

router.delete('/:courseId', auth, async (req, res) => {
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
})

export default router
