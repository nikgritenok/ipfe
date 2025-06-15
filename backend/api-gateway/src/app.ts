import express from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'

const app = express()

app.use('/api/auth', createProxyMiddleware({
  target: 'http://localhost:5002',
  changeOrigin: true,
  pathRewrite: { '^/api/auth': '/api/auth' },
}))

app.use(['/api/courses', '/api/lessons', '/api/enrollments', '/api/comments', '/api/favorites'], createProxyMiddleware({
  target: 'http://localhost:5003',
  changeOrigin: true,
}))

app.listen(5001, () => {
  console.log('API Gateway запущен на порту 5001')
}) 