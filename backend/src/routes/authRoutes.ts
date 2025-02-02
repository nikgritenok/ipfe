import express from 'express'
import {
  registerUser,
  //loginUser,
  //getUserData,
  //deleteUser,
} from '../controllers/authController'
import authMiddleware from '../middlewares/authMiddleware'

const router = express.Router()

router.post('/register', registerUser)
//router.post('/login', loginUser)
//router.get('/me', authMiddleware, getUserData)
//router.delete('/me', authMiddleware, deleteUser)

export default router
