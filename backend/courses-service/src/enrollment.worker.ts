import { Enrollment } from './enrollmentModel'
import amqp from 'amqplib'
import connectDB from './db'

async function startWorker() {
  await connectDB()
  const conn = await amqp.connect('amqp://localhost')
  const ch = await conn.createChannel()
  await ch.assertQueue('enrollments')
  ch.consume('enrollments', async (msg) => {
    if (msg) {
      const { userId, courseId } = JSON.parse(msg.content.toString())
      try {
        await Enrollment.create({ user: userId, course: courseId, enrolledAt: new Date(), completedLessons: [], isCompleted: false, progress: 0 })
        console.log('Enrollment processed:', userId, courseId)
      } catch (e) {
        console.error('Enrollment error:', e)
      }
      ch.ack(msg)
    }
  })
}
startWorker() 