import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/userModel'

interface CustomRequest extends Request {
  userId?: string
  role?: string
}

dotenv.config()

const secret = process.env.JWT_SECRET

if (!secret) {
  throw new Error('JWT_SECRET is not defined')
}

export const registerUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { firstName, lastName, login, password, role } = req.body
  try {
    const existingUser = await User.findOne({ login })
    if (existingUser) {
      res.status(400).json({ message: 'Пользователь уже существует' })
      return
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
      firstName,
      lastName,
      login,
      password: hashedPassword,
      role,
    })

    await newUser.save()

    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      secret,
      { expiresIn: '1h' },
    )

    res
      .status(201)
      .json({ message: 'Пользователь успешно зарегистрирован', token })
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при регистрации' })
  }
}

export const test = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({ message: 'test' })
}

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { login, password } = req.body
  try {
    const user = await User.findOne({ login })
    if (!user) {
      res.status(404).json({ message: 'Пользователь не найден' })
      return
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) {
      res.status(400).json({ message: 'Неверный пароль' })
      return
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, secret, {
      expiresIn: '1h',
    })
    res.status(200).json({ token })
  } catch (error) {
    res.status(500).json({ message: 'Ошибка авторизации' })
  }
}

export const getUserData = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const user = await User.findById(req.userId).select('-password')
    if (!user) {
      res.status(404).json({ message: 'Пользователь не найден' })
      return
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' })
  }
}

export const deleteUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.userId)
    if (!user) {
      res.status(404).json({ message: 'Пользователь не найден' })
      return
    }
    res.json({ message: 'Пользователь успешно удален' })
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' })
  }
}
