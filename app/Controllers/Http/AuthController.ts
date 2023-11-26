import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Env from '@ioc:Adonis/Core/Env'
import * as console from 'console'

export default class AuthController {
  public async login({ auth, request, response }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    try {
      const token = await auth.use('api').attempt(email, password)
      response.cookie(
        Env.get('API_TOKEN_COOKIE_NAME'),
        token.toJSON().token,
        {maxAge: 60 * 60 * 24 * 7, secure: true, httpOnly: true, sameSite: 'none'})
      return response.ok(auth.user)
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
      return response.unauthorized({error: 'You are already logged in'})
    }
    const email = request.input('email')
    const password = request.input('password')
    const username = request.input('username') || ""
    const avatarUrl = request.input('avatarUrl')
    const userMail = await User.findBy('email', email)
    const useUsername = await User.findBy('username', username)
    if (userMail != null || useUsername != null) {
      return response.unauthorized({error: 'User already exists'})
    }
    else {
      await User.create({ email, password, avatarUrl, username })
      const token = await auth.use('api').attempt(email, password)
      response.cookie(
        Env.get('API_TOKEN_COOKIE_NAME'),
        token.toJSON().token,
        {maxAge: 60 * 60 * 24 * 7, secure: true, httpOnly: true, sameSite: 'none'})
    }
    return response.ok(auth.user)
  }
}
