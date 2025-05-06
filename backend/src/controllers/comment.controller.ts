import { Request, Response } from 'express'
import { Comment } from '../models/comment.model'

export const commentController = {
  // Создание нового комментария
  create: async (req: Request, res: Response): Promise<void> => {
    try {
      const comment = new Comment({
        ...req.body,
        user: req.userId, // используем ID пользователя из middleware
      })
      await comment.save()

      // Populate user для возврата полной информации о пользователе
      await comment.populate('user', 'name email')
      res.status(201).json(comment)
    } catch (error) {
      res
        .status(400)
        .json({ message: 'Ошибка при создании комментария', error })
    }
  },

  // Получение всех комментариев к уроку
  getAllByLesson: async (req: Request, res: Response): Promise<void> => {
    try {
      const comments = await Comment.find({ lesson: req.params.lessonId })
        .sort('-createdAt')
        .populate('user', 'name email')
      res.json(comments)
    } catch (error) {
      res
        .status(400)
        .json({ message: 'Ошибка при получении комментариев', error })
    }
  },

  // Обновление комментария
  update: async (req: Request, res: Response): Promise<void> => {
    try {
      // Проверяем, что пользователь обновляет свой комментарий
      const comment = await Comment.findOneAndUpdate(
        { _id: req.params.id, user: req.userId },
        { $set: { text: req.body.text } },
        { new: true },
      ).populate('user', 'name email')

      if (!comment) {
        res.status(404).json({
          message:
            'Комментарий не найден или у вас нет прав на его редактирование',
        })
        return
      }

      res.json(comment)
    } catch (error) {
      res
        .status(400)
        .json({ message: 'Ошибка при обновлении комментария', error })
    }
  },

  // Удаление комментария
  delete: async (req: Request, res: Response): Promise<void> => {
    try {
      // Проверяем, что пользователь удаляет свой комментарий
      const comment = await Comment.findOneAndDelete({
        _id: req.params.id,
        user: req.userId,
      })

      if (!comment) {
        res.status(404).json({
          message: 'Комментарий не найден или у вас нет прав на его удаление',
        })
        return
      }

      res.json({ message: 'Комментарий успешно удален' })
    } catch (error) {
      res
        .status(400)
        .json({ message: 'Ошибка при удалении комментария', error })
    }
  },
}
