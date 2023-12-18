import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Env from '@ioc:Adonis/Core/Env'
import Logger from '@ioc:Adonis/Core/Logger'

export default class SetAuthorizationHeader {
  public async handle ({ request }: HttpContextContract, next: () => Promise<void>) {
    const token = request.cookie(String(Env.get('API_TOKEN_COOKIE_NAME')))
    Logger.info(token)
    if (token) {
      request.headers().authorization = `Bearer ${token}`
    }
    await next()
  }
}
