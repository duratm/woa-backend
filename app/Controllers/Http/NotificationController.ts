import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import transmit from '@ioc:Adonis/Addons/Transmit'

export default class NotificationController {
  public async register(ctx: HttpContextContract) {
    transmit.createStream(ctx)
    await transmit.subscribeToChannel('notification', 'notification', ctx)
    await transmit.broadcast('notification', { message: 'Hello world' })
  }
  public async sendMessage(contract: HttpContextContract) {
    const record: Record<string, unknown> = { message: 'Hello world' }
    transmit.broadcast('http://localhost:3333/api/notifications', record)
    return contract.response.send(record)
  }
}
