import { Types } from 'mongoose'
import slugify from 'slugify'
import { Course, Tag } from '../models/courseModel'
import { FavoriteCourse } from '../models/favoriteModel'
import {
  ApiResponse,
  AsyncRequestHandler,
  CourseBody,
  CourseParams,
  CourseQuery,
} from '../types/express'
import { processImage } from '../utils/fileUpload'

export const getAllCourses: AsyncRequestHandler<
  {},
  ApiResponse,
  {},
  CourseQuery
> = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'desc',
      category,
      level,
      search,
      tag,
      published,
    } = req.query

    const pageNumber = parseInt(page as string)
    const limitNumber = parseInt(limit as string)
    const skip = (pageNumber - 1) * limitNumber

    const filter: any = {}

    if (category) filter.category = category
    if (level) filter.level = level
    if (search) filter.title = { $regex: search, $options: 'i' }
    if (published !== undefined) filter.published = published === 'true'

    if (tag) {
      const tagDoc = await Tag.findOne({ name: tag })
      if (tagDoc) {
        filter.tags = tagDoc._id
      }
    }

    const sortOrder = order === 'desc' ? -1 : 1
    const sortQuery: any = {}
    sortQuery[sort as string] = sortOrder

    const courses = await Course.find(filter)
      .populate('author', 'firstName lastName')
      .populate('tags', 'name')
      .sort(sortQuery)
      .skip(skip)
      .limit(limitNumber)

    const total = await Course.countDocuments(filter)

    res.status(200).json({
      status: 'success',
      results: courses.length,
      total,
      totalPages: Math.ceil(total / limitNumber),
      currentPage: pageNumber,
      data: {
        courses,
      },
    })
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Ошибка при получении курсов',
      error: (error as Error).message,
    })
  }
}

export const getCourseById: AsyncRequestHandler<
  CourseParams,
  ApiResponse
> = async (req, res) => {
  try {
    const { id } = req.params

    const course = await Course.findById(id)
      .populate('author', 'firstName lastName')
      .populate('tags', 'name')

    if (!course) {
      res.status(404).json({
        status: 'fail',
        message: 'Курс не найден',
      })
      return
    }

    res.status(200).json({
      status: 'success',
      data: {
        course,
      },
    })
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Ошибка при получении курса',
      error: (error as Error).message,
    })
  }
}

export const createCourse: AsyncRequestHandler<
  {},
  ApiResponse,
  CourseBody
> = async (req, res) => {
  try {
    const { title, description, price, category, level, tags } = req.body

    if (!req.userId) {
      res.status(401).json({
        status: 'fail',
        message: 'Вы не авторизованы',
      })
      return
    }

    if (!req.file) {
      res.status(400).json({
        status: 'fail',
        message: 'Необходимо загрузить изображение',
      })
      return
    }

    await processImage(req.file.path)

    const slug = slugify(title, { lower: true })

    let tagIds: Types.ObjectId[] = []
    if (tags) {
      const tagNames = JSON.parse(tags) as string[]

      const tagPromises = tagNames.map(async (tagName) => {
        let tag = await Tag.findOne({ name: tagName })
        if (!tag) {
          tag = await Tag.create({ name: tagName })
        }
        return tag._id
      })

      tagIds = (await Promise.all(tagPromises)) as Types.ObjectId[]
    }

    const newCourse = await Course.create({
      title,
      slug,
      description,
      price,
      image: req.file.path,
      category,
      level: level || 'beginner',
      published: false,
      author: req.userId,
      tags: tagIds,
    })

    res.status(201).json({
      status: 'success',
      data: {
        course: newCourse,
      },
    })
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Ошибка при создании курса',
      error: (error as Error).message,
    })
  }
}

export const updateCourse: AsyncRequestHandler<
  CourseParams,
  ApiResponse,
  CourseBody
> = async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, price, category, level, published, tags } =
      req.body

    if (!req.userId) {
      res.status(401).json({
        status: 'fail',
        message: 'Вы не авторизованы',
      })
      return
    }

    const course = await Course.findById(id)

    if (!course) {
      res.status(404).json({
        status: 'fail',
        message: 'Курс не найден',
      })
      return
    }

    if (course.author.toString() !== req.userId) {
      res.status(403).json({
        status: 'fail',
        message: 'У вас нет прав для обновления этого курса',
      })
      return
    }

    let imagePath = course.image
    if (req.file) {
      await processImage(req.file.path)
      imagePath = req.file.path
    }

    let slug = course.slug
    if (title && title !== course.title) {
      slug = slugify(title, { lower: true })
    }

    let updatedTagIds: Types.ObjectId[] = course.tags
    if (tags) {
      const tagNames = JSON.parse(tags) as string[]

      const tagPromises = tagNames.map(async (tagName) => {
        let tag = await Tag.findOne({ name: tagName })
        if (!tag) {
          tag = await Tag.create({ name: tagName })
        }
        return tag._id
      })

      updatedTagIds = (await Promise.all(tagPromises)) as Types.ObjectId[]
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      {
        title: title || course.title,
        slug,
        description:
          description !== undefined ? description : course.description,
        price: price || course.price,
        image: imagePath,
        category: category || course.category,
        level: level || course.level,
        published: published !== undefined ? published : course.published,
        tags: updatedTagIds,
      },
      { new: true, runValidators: true },
    )
      .populate('author', 'firstName lastName')
      .populate('tags', 'name')

    res.status(200).json({
      status: 'success',
      data: {
        course: updatedCourse,
      },
    })
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Ошибка при обновлении курса',
      error: (error as Error).message,
    })
  }
}

export const deleteCourse: AsyncRequestHandler<
  CourseParams,
  ApiResponse
> = async (req, res) => {
  try {
    const { id } = req.params

    if (!req.userId) {
      res.status(401).json({
        status: 'fail',
        message: 'Вы не авторизованы',
      })
      return
    }

    const course = await Course.findById(id)

    if (!course) {
      res.status(404).json({
        status: 'fail',
        message: 'Курс не найден',
      })
      return
    }

    if (course.author.toString() !== req.userId) {
      res.status(403).json({
        status: 'fail',
        message: 'У вас нет прав для удаления этого курса',
      })
      return
    }

    await Course.findByIdAndDelete(id)

    await FavoriteCourse.deleteMany({ course: id })

    res.status(204).json({
      status: 'success',
      data: null,
    })
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Ошибка при удалении курса',
      error: (error as Error).message,
    })
  }
}

export const addToFavorites: AsyncRequestHandler<
  CourseParams,
  ApiResponse
> = async (req, res) => {
  try {
    const { courseId } = req.params

    if (!req.userId) {
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

    const existingFavorite = await FavoriteCourse.findOne({
      user: req.userId,
      course: courseId,
    })

    if (existingFavorite) {
      res.status(400).json({
        status: 'fail',
        message: 'Курс уже добавлен в избранное',
      })
      return
    }

    const favorite = await FavoriteCourse.create({
      user: req.userId,
      course: courseId,
    })

    res.status(201).json({
      status: 'success',
      data: {
        favorite,
      },
    })
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Ошибка при добавлении курса в избранное',
      error: (error as Error).message,
    })
  }
}

export const removeFromFavorites: AsyncRequestHandler<
  CourseParams,
  ApiResponse
> = async (req, res) => {
  try {
    const { courseId } = req.params

    if (!req.userId) {
      res.status(401).json({
        status: 'fail',
        message: 'Вы не авторизованы',
      })
      return
    }

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
      message: 'Ошибка при удалении курса из избранного',
      error: (error as Error).message,
    })
  }
}

export const getFavorites: AsyncRequestHandler<{}, ApiResponse> = async (
  req,
  res,
) => {
  try {
    if (!req.userId) {
      res.status(401).json({
        status: 'fail',
        message: 'Вы не авторизованы',
      })
      return
    }

    const favorites = await FavoriteCourse.find({ user: req.userId }).populate({
      path: 'course',
      select: 'title description price image category level',
      populate: [
        { path: 'author', select: 'firstName lastName' },
        { path: 'tags', select: 'name' },
      ],
    })

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
      message: 'Ошибка при получении избранных курсов',
      error: (error as Error).message,
    })
  }
}
