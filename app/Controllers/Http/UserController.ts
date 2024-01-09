import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Drive from '@ioc:Adonis/Core/Drive'

export default class UserController {
  public async index(HttpContextContract: HttpContextContract) {
    if (HttpContextContract.auth.user) {
      let users = await User.query()
        .select('id', 'username', 'avatar_url')
        .whereNot('id', HttpContextContract.auth.user.id)
      for (let user of users) {
        user.avatarUrl = await Drive.getSignedUrl(user.avatarUrl)
      }
      return HttpContextContract.response.send(JSON.stringify(users))
    }
    return HttpContextContract.response.unauthorized()
  }
}
