import fs from 'fs'
import path from 'path'
import multer from 'multer'
import sharp from 'sharp'
import { v4 as uuidv4 } from 'uuid'

// Настройка хранилища для Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/'
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniquePrefix = uuidv4()
    cb(null, `${uniquePrefix}-${file.originalname}`)
  },
})

// Проверка типа файла
const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(
      new Error(
        'Недопустимый формат файла. Разрешены только JPEG, JPG, PNG и WEBP.',
      ),
    )
  }
}

// Сжатие изображения и добавление водяного знака
export const processImage = async (filePath: string) => {
  try {
    // Получаем путь к водяному знаку
    const watermarkPath = path.join(__dirname, '../assets/watermark.png')

    // Получаем метаданные исходного изображения
    const imageMetadata = await sharp(filePath).metadata()

    // Изменяем размер водяного знака, чтобы он был меньше основного изображения
    // Обычно водяной знак должен занимать 20-30% от исходного изображения
    const watermarkWidth = Math.floor(imageMetadata.width! * 0.3)
    const watermarkBuffer = await sharp(watermarkPath)
      .resize(watermarkWidth, null, { fit: 'inside' })
      .toBuffer()

    // Обрабатываем основное изображение и добавляем измененный водяной знак
    const processedImage = await sharp(filePath)
      .resize(800, 600, { fit: 'inside' })
      .composite([
        {
          input: watermarkBuffer,
          gravity: 'southeast', // Размещение в правом нижнем углу
        },
      ])
      .jpeg({ quality: 80 })
      .toBuffer()

    // Сохраняем обработанное изображение
    await sharp(processedImage).toFile(filePath)

    return true
  } catch (error) {
    console.error('Ошибка при обработке изображения', error)
    return false
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Ограничение размера файла до 5MB
})
