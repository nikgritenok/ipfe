import swaggerJsdoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Документация',
      version: '1.0.0',
      description: 'Документация API для образовательной платформы',
    },
    servers: [
      {
        url: 'http://localhost:5001',
        description: 'Локальный сервер',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            email: { type: 'string', format: 'email' },
            name: { type: 'string' },
            role: { type: 'string', enum: ['user', 'teacher', 'admin'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Course: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            author: {
              type: 'object',
              $ref: '#/components/schemas/User',
            },
            image: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Lesson: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            content: { type: 'string' },
            videoUrl: { type: 'string' },
            course: {
              type: 'object',
              $ref: '#/components/schemas/Course',
            },
            order: { type: 'number' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Comment: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            user: {
              type: 'object',
              $ref: '#/components/schemas/User',
            },
            lesson: {
              type: 'object',
              $ref: '#/components/schemas/Lesson',
            },
            text: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        FavoriteCourse: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            user: {
              type: 'object',
              $ref: '#/components/schemas/User',
            },
            course: {
              type: 'object',
              $ref: '#/components/schemas/Course',
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
      links: {
        GetCourseLessons: {
          operationId: 'getLessonsByCourse',
          parameters: {
            courseId: '$response.body._id',
          },
          description: 'Ссылка на получение уроков курса',
        },
        GetCourseComments: {
          operationId: 'getCommentsByCourse',
          parameters: {
            courseId: '$response.body._id',
          },
          description: 'Ссылка на получение комментариев курса',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'], // путь к файлам с маршрутами
}

export const specs = swaggerJsdoc(options)
