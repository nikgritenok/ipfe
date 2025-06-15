import amqp from 'amqplib'

async function startUserWorker() {
  const conn = await amqp.connect('amqp://localhost')
  const ch = await conn.createChannel()
  await ch.assertQueue('users')
  ch.consume('users', async (msg) => {
    if (msg) {
      const data = JSON.parse(msg.content.toString())
      // Здесь логика обработки (например, отправка email)
      console.log('User event:', data)
      ch.ack(msg)
    }
  })
}
startUserWorker() 