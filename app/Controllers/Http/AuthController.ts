import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Env from '@ioc:Adonis/Core/Env'
import * as console from 'console'
import Drive from '@ioc:Adonis/Core/Drive'

export default class AuthController {
  public async me({ auth, response }: HttpContextContract) {
    let user = auth.user
    if (user) {
      user.avatarUrl = await Drive.getSignedUrl(user.avatarUrl)
    }
    return response.ok(auth.user)
  }
  public async login({ auth, request, response }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    try {
      const token = await auth.use('api').attempt(email, password)
      response.cookie(Env.get('API_TOKEN_COOKIE_NAME'), token.toJSON().token, {
        maxAge: 60 * 60 * 24 * 7,
        secure: true,
        httpOnly: true,
        sameSite: 'none',
      })
      let user = await User.findByOrFail('username', auth.user?.username)
      user.avatarUrl = await Drive.getSignedUrl(user.avatarUrl)
      return response.ok(user)
    } catch (error) {
      console.log(error)
      return response.unauthorized({ error: 'Invalid credentials' })
    }
  }

  public async logout({ auth, response }: HttpContextContract) {
    try {
      await auth.logout()
      await auth.use('api').revoke()
      response.clearCookie(String(Env.get('API_TOKEN_COOKIE_NAME')))
      return response.send({ message: 'Logout successful' })
    } catch (error) {
      return response.badRequest({ error: 'Mauvais token ou vous nêtes pas conncté' })
    }
  }

  public async register({ auth, request, response }: HttpContextContract) {
    if (auth.isLoggedIn) {
      return response.unauthorized({ error: 'You are already logged in' })
    }
    console.log(request.file('avatarUrl'))
    const image = request.file('avatarUrl')
    let avatarUrl = ''
    if (image === null) {
      avatarUrl = 'default.png'
    } else {
      avatarUrl = request.input('username') + '.' + image.extname
      await image.moveToDisk(
        '',
        {
          name: avatarUrl,
          overwrite: true,
          contentType: image.type,
        },
        's3'
      )
    }

    const email = request.input('email')
    const password = request.input('password')
    const username = request.input('username')
    const userMail = await User.findBy('email', email)
    const useUsername = await User.findBy('username', username)
    if (userMail !== null || useUsername !== null) {
      if (userMail !== null) {
        return response.unauthorized({ error: 'email' })
      }
      return response.unauthorized({ error: 'user' })
    } else {
      const user = await User.create({ email, password, avatarUrl, username })
      const token = await auth.use('api').attempt(email, password, { expiresIn: '3 hours' })
      response.cookie(Env.get('API_TOKEN_COOKIE_NAME'), token.toJSON().token, {
        maxAge: 60 * 60 * 24 * 7,
        secure: true,
        httpOnly: true,
        sameSite: 'none',
      })
      user.avatarUrl = await Drive.getSignedUrl(user.avatarUrl)
      console.log(user)
      return response.ok(user)
    }
  }
}
