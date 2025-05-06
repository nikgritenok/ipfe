import express from 'express'
import {
  deleteUser,
  getUserData,
  loginUser,
  registerUser,
  test,
} from '../controllers/authController'
import authMiddleware from '../middlewares/authMiddleware'

const router = express.Router()

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Аутентификация
 *     summary: Регистрация нового пользователя
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - login
 *               - password
 *               - role
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: Имя пользователя
 *               lastName:
 *                 type: string
 *                 description: Фамилия пользователя
 *               login:
 *                 type: string
 *                 description: Логин пользователя
 *               password:
 *                 type: string
 *                 description: Пароль пользователя
 *                 minimum: 6
 *               role:
 *                 type: string
 *                 enum: [user, teacher, admin]
 *                 description: Роль пользователя
 *     responses:
 *       201:
 *         description: Пользователь успешно зарегистрирован
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *       400:
 *         description: Ошибка валидации или пользователь уже существует
 *       500:
 *         description: Ошибка сервера
 */
router.post('/register', registerUser)

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Аутентификация
 *     summary: Вход в систему
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - login
 *               - password
 *             properties:
 *               login:
 *                 type: string
 *                 description: Логин пользователя
 *               password:
 *                 type: string
 *                 description: Пароль пользователя
 *     responses:
 *       200:
 *         description: Успешный вход
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       404:
 *         description: Пользователь не найден
 *       400:
 *         description: Неверный пароль
 *       500:
 *         description: Ошибка сервера
 */
router.post('/login', loginUser)

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     tags:
 *       - Аутентификация
 *     summary: Получение данных текущего пользователя
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Данные пользователя
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 login:
 *                   type: string
 *                 role:
 *                   type: string
 *       401:
 *         description: Не авторизован
 *       404:
 *         description: Пользователь не найден
 *       500:
 *         description: Ошибка сервера
 */
router.get('/me', authMiddleware, getUserData)

/**
 * @swagger
 * /api/auth/delete:
 *   delete:
 *     tags:
 *       - Аутентификация
 *     summary: Удаление аккаунта пользователя
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Аккаунт успешно удален
 *       401:
 *         description: Не авторизован
 *       404:
 *         description: Пользователь не найден
 *       500:
 *         description: Ошибка сервера
 */
router.delete('/delete', authMiddleware, deleteUser)

router.get('/test', test)

export default router
