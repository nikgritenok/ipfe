import { Types } from 'mongoose'
import { Course } from '../models/courseModel'
import { Enrollment } from '../models/enrollmentModel'
import { Lesson } from '../models/lesson.model'
import { ApiResponse, AsyncRequestHandler } from '../types/express'

interface EnrollmentParams {
  id?: string
  courseId?: string
  lessonId?: string
}

interface EnrollmentBody {
  userId?: string
  courseId?: string
  lessonId?: string
}

/**
 * @swagger
 * /api/enrollments:
 *   post:
 *     summary: Запись на курс
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *             properties:
 *               courseId:
 *                 type: string
 *                 description: ID курса
 *     responses:
 *       201:
 *         description: Успешная запись на курс
 *       400:
 *         description: Некорректные данные
 *       401:
 *         description: Не авторизован
 *       404:
 *         description: Курс не найден
 *       409:
 *         description: Пользователь уже записан на этот курс
 */
export const enrollInCourse: AsyncRequestHandler<
  {},
  ApiResponse,
  EnrollmentBody
> = async (req, res) => {
  try {
    const { courseId } = req.body
    const userId = req.userId

    if (!userId) {
      res.status(401).json({
        status: 'fail',
        message: 'Вы не авторизованы',
      })
      return
    }

    const course = await Course.findById(courseId)
    if (!course) {
      res.status(404).json({
        status: 'fail',
        message: 'Курс не найден',
      })
      return
    }

    const existingEnrollment = await Enrollment.findOne({
      user: userId,
      course: courseId,
    })

    if (existingEnrollment) {
      res.status(409).json({
        status: 'fail',
        message: 'Вы уже записаны на этот курс',
      })
      return
    }

    const enrollment = await Enrollment.create({
      user: userId,
      course: courseId,
      enrolledAt: new Date(),
      completedLessons: [],
      isCompleted: false,
      progress: 0,
    })

    res.status(201).json({
      status: 'success',
      data: {
        enrollment,
      },
    })
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Ошибка при записи на курс',
      error: (error as Error).message,
    })
  }
}

/**
 * @swagger
 * /api/enrollments:
 *   get:
 *     summary: Получить курсы, на которые записан пользователь
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список курсов, на которые записан пользователь
 *       401:
 *         description: Не авторизован
 */
export const getMyEnrollments: AsyncRequestHandler<{}, ApiResponse> = async (
  req,
  res,
) => {
  try {
    const userId = req.userId

    if (!userId) {
      res.status(401).json({
        status: 'fail',
        message: 'Вы не авторизованы',
      })
      return
    }

    const enrollments = await Enrollment.find({ user: userId })
      .populate({
        path: 'course',
        select: 'title description image category level',
        populate: {
          path: 'author',
          select: 'firstName lastName',
        },
      })
      .sort({ enrolledAt: -1 })

    res.status(200).json({
      status: 'success',
      results: enrollments.length,
      data: {
        enrollments,
      },
    })
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Ошибка при получении записей на курсы',
      error: (error as Error).message,
    })
  }
}

/**
 * @swagger
 * /api/enrollments/{courseId}/progress:
 *   get:
 *     summary: Получить прогресс студента по определенному курсу
 *     tags: [Enrollments]
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
 *         description: Прогресс курса
 *       401:
 *         description: Не авторизован
 *       404:
 *         description: Запись на курс не найдена
 */
export const getCourseProgress: AsyncRequestHandler<
  EnrollmentParams,
  ApiResponse
> = async (req, res) => {
  try {
    const { courseId } = req.params
    const userId = req.userId

    if (!userId) {
      res.status(401).json({
        status: 'fail',
        message: 'Вы не авторизованы',
      })
      return
    }

    const enrollment = await Enrollment.findOne({
      user: userId,
      course: courseId,
    })

    if (!enrollment) {
      res.status(404).json({
        status: 'fail',
        message: 'Запись на курс не найдена',
      })
      return
    }

    res.status(200).json({
      status: 'success',
      data: {
        progress: enrollment.progress,
        completedLessons: enrollment.completedLessons,
        isCompleted: enrollment.isCompleted,
      },
    })
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Ошибка при получении прогресса курса',
      error: (error as Error).message,
    })
  }
}

/**
 * @swagger
 * /api/enrollments/{courseId}/complete-lesson:
 *   post:
 *     summary: Отметить урок как завершенный
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID курса
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - lessonId
 *             properties:
 *               lessonId:
 *                 type: string
 *                 description: ID урока
 *     responses:
 *       200:
 *         description: Прогресс обновлен
 *       401:
 *         description: Не авторизован
 *       404:
 *         description: Запись на курс или урок не найдены
 */
export const completeLesson: AsyncRequestHandler<
  EnrollmentParams,
  ApiResponse,
  EnrollmentBody
> = async (req, res) => {
  try {
    const { courseId } = req.params
    const { lessonId } = req.body
    const userId = req.userId

    if (!userId) {
      res.status(401).json({
        status: 'fail',
        message: 'Вы не авторизованы',
      })
      return
    }

    // Проверяем, существует ли урок в данном курсе
    const lesson = await Lesson.findOne({
      _id: lessonId,
      course: courseId,
    })

    if (!lesson) {
      res.status(404).json({
        status: 'fail',
        message: 'Урок не найден в данном курсе',
      })
      return
    }

    // Находим запись о курсе
    const enrollment = await Enrollment.findOne({
      user: userId,
      course: courseId,
    })

    if (!enrollment) {
      res.status(404).json({
        status: 'fail',
        message: 'Запись на курс не найдена',
      })
      return
    }

    // Проверяем, не отмечен ли урок уже как завершенный
    const isLessonCompleted = enrollment.completedLessons.some(
      (id) => id.toString() === lessonId,
    )

    if (!isLessonCompleted) {
      // Добавляем урок в список завершенных
      enrollment.completedLessons.push(new Types.ObjectId(lessonId))

      // Пересчитываем прогресс
      await updateProgress(enrollment)
    }

    res.status(200).json({
      status: 'success',
      data: {
        progress: enrollment.progress,
        completedLessons: enrollment.completedLessons,
        isCompleted: enrollment.isCompleted,
      },
    })
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Ошибка при отметке урока как завершенного',
      error: (error as Error).message,
    })
  }
}

/**
 * @swagger
 * /api/enrollments/{courseId}/uncomplete-lesson:
 *   post:
 *     summary: Отметить урок как незавершенный
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID курса
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - lessonId
 *             properties:
 *               lessonId:
 *                 type: string
 *                 description: ID урока
 *     responses:
 *       200:
 *         description: Прогресс обновлен
 *       401:
 *         description: Не авторизован
 *       404:
 *         description: Запись на курс или урок не найдены
 */
export const uncompleteLesson: AsyncRequestHandler<
  EnrollmentParams,
  ApiResponse,
  EnrollmentBody
> = async (req, res) => {
  try {
    const { courseId } = req.params
    const { lessonId } = req.body
    const userId = req.userId

    if (!userId) {
      res.status(401).json({
        status: 'fail',
        message: 'Вы не авторизованы',
      })
      return
    }

    // Находим запись о курсе
    const enrollment = await Enrollment.findOne({
      user: userId,
      course: courseId,
    })

    if (!enrollment) {
      res.status(404).json({
        status: 'fail',
        message: 'Запись на курс не найдена',
      })
      return
    }

    // Удаляем урок из списка завершенных
    enrollment.completedLessons = enrollment.completedLessons.filter(
      (id) => id.toString() !== lessonId,
    )

    // Пересчитываем прогресс
    await updateProgress(enrollment)

    res.status(200).json({
      status: 'success',
      data: {
        progress: enrollment.progress,
        completedLessons: enrollment.completedLessons,
        isCompleted: enrollment.isCompleted,
      },
    })
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Ошибка при отметке урока как незавершенного',
      error: (error as Error).message,
    })
  }
}

/**
 * @swagger
 * /api/enrollments/{courseId}/cancel:
 *   delete:
 *     summary: Отменить запись на курс
 *     tags: [Enrollments]
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
 *         description: Запись отменена
 *       401:
 *         description: Не авторизован
 *       404:
 *         description: Запись на курс не найдена
 */
export const cancelEnrollment: AsyncRequestHandler<
  EnrollmentParams,
  ApiResponse
> = async (req, res) => {
  try {
    const { courseId } = req.params
    const userId = req.userId

    if (!userId) {
      res.status(401).json({
        status: 'fail',
        message: 'Вы не авторизованы',
      })
      return
    }

    const enrollment = await Enrollment.findOneAndDelete({
      user: userId,
      course: courseId,
    })

    if (!enrollment) {
      res.status(404).json({
        status: 'fail',
        message: 'Запись на курс не найдена',
      })
      return
    }

    res.status(200).json({
      status: 'success',
      message: 'Запись на курс успешно отменена',
    })
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Ошибка при отмене записи на курс',
      error: (error as Error).message,
    })
  }
}

/**
 * @swagger
 * /api/courses/{courseId}/students:
 *   get:
 *     summary: Получить количество студентов, записанных на курс
 *     tags: [Enrollments]
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
 *         description: Количество студентов
 *       401:
 *         description: Не авторизован
 *       404:
 *         description: Курс не найден
 */
export const getCourseStudentsCount: AsyncRequestHandler<
  EnrollmentParams,
  ApiResponse
> = async (req, res) => {
  try {
    const { courseId } = req.params
    const userId = req.userId

    if (!userId) {
      res.status(401).json({
        status: 'fail',
        message: 'Вы не авторизованы',
      })
      return
    }

    const course = await Course.findById(courseId)
    if (!course) {
      res.status(404).json({
        status: 'fail',
        message: 'Курс не найден',
      })
      return
    }

    const studentsCount = await Enrollment.countDocuments({ course: courseId })

    res.status(200).json({
      status: 'success',
      data: {
        studentsCount,
      },
    })
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Ошибка при получении количества студентов',
      error: (error as Error).message,
    })
  }
}

/**
 * @swagger
 * /api/courses/{courseId}/students:
 *   get:
 *     summary: Получить список студентов, записанных на курс (для преподавателя)
 *     tags: [Enrollments]
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
 *         description: Список студентов
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Нет прав доступа
 *       404:
 *         description: Курс не найден
 */
export const getCourseStudents: AsyncRequestHandler<
  EnrollmentParams,
  ApiResponse
> = async (req, res) => {
  try {
    const { courseId } = req.params
    const userId = req.userId

    if (!userId) {
      res.status(401).json({
        status: 'fail',
        message: 'Вы не авторизованы',
      })
      return
    }

    const course = await Course.findById(courseId)
    if (!course) {
      res.status(404).json({
        status: 'fail',
        message: 'Курс не найден',
      })
      return
    }

    if (course.author.toString() !== userId) {
      res.status(403).json({
        status: 'fail',
        message: 'У вас нет прав доступа к этой информации',
      })
      return
    }

    const enrollments = await Enrollment.find({ course: courseId })
      .populate('user', 'firstName lastName login')
      .sort({ enrolledAt: -1 })

    res.status(200).json({
      status: 'success',
      results: enrollments.length,
      data: {
        enrollments,
      },
    })
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Ошибка при получении списка студентов',
      error: (error as Error).message,
    })
  }
}

/**
 * Пересчет прогресса
 */
const updateProgress = async (enrollment: any) => {
  const totalLessons = await Lesson.countDocuments({
    course: enrollment.course,
  })

  if (totalLessons === 0) {
    enrollment.progress = 0
    enrollment.isCompleted = false
  } else {
    const completedLessonsCount = enrollment.completedLessons.length
    enrollment.progress = Math.round(
      (completedLessonsCount / totalLessons) * 100,
    )

    enrollment.isCompleted = enrollment.progress === 100
  }

  await enrollment.save()

  return enrollment
}
