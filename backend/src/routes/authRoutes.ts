import express from 'express'
import { Request, Response } from 'express'
import { registerUser, test } from '../controllers/authController'
import authMiddleware from '../middlewares/authMiddleware'

const router = express.Router()

router.post('/register', registerUser)
router.get('/test', test)

export default router
