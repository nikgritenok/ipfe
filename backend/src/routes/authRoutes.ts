import express from 'express'
import { Request, Response } from 'express'
import { registerUser, test, loginUser } from '../controllers/authController'
import authMiddleware from '../middlewares/authMiddleware'

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/test', test)

export default router
