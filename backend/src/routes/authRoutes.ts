import express from 'express'
import {
  registerUser,
  test,
  loginUser,
  getUserData,
  deleteUser,
} from '../controllers/authController'
import authMiddleware from '../middlewares/authMiddleware'

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/me', authMiddleware, getUserData)
router.delete('/delete', authMiddleware, deleteUser)
router.get('/test', test)

export default router
