import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UserController {
  public async index(HttpContextContract: HttpContextContract) {
    let users = {}
    if (HttpContextContract.auth.user) {
      users = await User.query()
        .select('id', 'username', 'avatar_url')
        .whereNot('id', HttpContextContract.auth.user.id)
    }
    HttpContextContract.response.send(JSON.stringify(users))
  }
}
