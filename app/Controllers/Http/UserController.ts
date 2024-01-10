import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Drive from '@ioc:Adonis/Core/Drive'
import Group from 'App/Models/Group'

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

  public async groupUsers(HttpContextContract: HttpContextContract) {
    let groupId = HttpContextContract.params.id
    console.log(groupId)
    if (Number(groupId)) {
      console.log('test')
      const group = await Group.findOrFail(Number(groupId))
      console.log('test')
      let users = await group
        .related('users')
        .query()
        .select('users.id', 'users.username', 'users.avatar_url')
      for (let user of users) {
        user.avatarUrl = await Drive.getSignedUrl(user.avatarUrl)
      }
      return HttpContextContract.response.send(JSON.stringify(users))
    }
    return HttpContextContract.response.badRequest()
  }
}
