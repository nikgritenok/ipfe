import amqp from 'amqplib'

export async function sendToUserQueue(queue: string, msg: any) {
  const conn = await amqp.connect('amqp://localhost')
  const ch = await conn.createChannel()
  await ch.assertQueue(queue)
  ch.sendToQueue(queue, Buffer.from(JSON.stringify(msg)))
  setTimeout(() => conn.close(), 500)
} 