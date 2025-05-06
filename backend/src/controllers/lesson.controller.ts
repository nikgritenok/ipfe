import { Request, Response } from 'express'
import { Lesson } from '../models/lesson.model'
import { AsyncRequestHandler } from '../types/express'

export const lessonController = {
  // Создание нового урока
  create: async (req: Request, res: Response): Promise<void> => {
    try {
      const lesson = new Lesson(req.body)
      await lesson.save()
      res.status(201).json(lesson)
    } catch (error) {
      res.status(400).json({ message: 'Ошибка при создании урока', error })
    }
  },

  // Получение всех уроков курса
  getAllByCourse: async (req: Request, res: Response): Promise<void> => {
    try {
      const lessons = await Lesson.find({ course: req.params.courseId })
        .sort('order')
        .populate('course')
      res.json(lessons)
    } catch (error) {
      res.status(400).json({ message: 'Ошибка при получении уроков', error })
    }
  },

  // Получение конкретного урока
  getOne: async (req: Request, res: Response): Promise<void> => {
    try {
      const lesson = await Lesson.findById(req.params.id).populate('course')
      if (!lesson) {
        res.status(404).json({ message: 'Урок не найден' })
        return
      }
      res.json(lesson)
    } catch (error) {
      res.status(400).json({ message: 'Ошибка при получении урока', error })
    }
  },

  // Обновление урока
  update: async (req: Request, res: Response): Promise<void> => {
    try {
      const lesson = await Lesson.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true },
      )
      if (!lesson) {
        res.status(404).json({ message: 'Урок не найден' })
        return
      }
      res.json(lesson)
    } catch (error) {
      res.status(400).json({ message: 'Ошибка при обновлении урока', error })
    }
  },

  // Удаление урока
  delete: async (req: Request, res: Response): Promise<void> => {
    try {
      const lesson = await Lesson.findByIdAndDelete(req.params.id)
      if (!lesson) {
        res.status(404).json({ message: 'Урок не найден' })
        return
      }
      res.json({ message: 'Урок успешно удален' })
    } catch (error) {
      res.status(400).json({ message: 'Ошибка при удалении урока', error })
    }
  },
}
