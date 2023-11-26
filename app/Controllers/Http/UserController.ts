import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UserController {

  public async index({ response }: HttpContextContract) {
    const users = await User.all()
    response.send(JSON.stringify(users))
  }

}
