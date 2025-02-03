import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/userModel'

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
    res.status(201).json({ message: 'Пользователь успешно зарегистрирован' })
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при регистрации' })
  }
}

export const test = async (req: Request, res: Response) => {
  res.status(200).json({ message: 'test' })
}

// export const loginUser = async (req: Request, res: Response) => {
//   const { login, password } = req.body
//   try {
//     const user = await User.findOne({ login })
//     if (!user) {
//       return res.status(404).json({ message: 'Пользователь не найден' })
//     }

//     const isPasswordCorrect = await bcrypt.compare(password, user.password)
//     if (!isPasswordCorrect) {
//       return res.status(400).json({ message: 'Неверный пароль' })
//     }

//     const token = jwt.sign(
//       { userId: user._id, role: user.role },
//       'your_jwt_secret',
//       { expiresIn: '1h' },
//     )
//     res.status(200).json({ token })
//   } catch (error) {
//     res.status(500).json({ message: 'Ошибка авторизации' })
//   }
// }

// export const getUserData = async (req: Request, res: Response) => {
//   const user = await User.findById(req.userId)
//   if (!user) {
//     return res.status(404).json({ message: 'User not found' })
//   }
//   res.status(200).json({
//     firstName: user.firstName,
//     lastName: user.lastName,
//     login: user.login,
//     role: user.role,
//   })
// }

// export const deleteUser = async (req: Request, res: Response) => {
//   try {
//     await User.findByIdAndDelete(req.userId)
//     res.status(200).json({ message: 'Пользователь успешно удален' })
//   } catch (error) {
//     res.status(500).json({ message: 'Ошибка при удалении пользователя' })
//   }
// }
