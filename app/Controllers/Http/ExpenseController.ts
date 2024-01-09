import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Expense from 'App/Models/Expense'
import * as console from 'console'

export default class ExpenseController {
  public async store(httpContextContract: HttpContextContract) {
    console.log(httpContextContract.request.raw())
    const name = JSON.parse(httpContextContract.request.raw() ?? '{}').name
    const users = JSON.parse(httpContextContract.request.raw() ?? '{}').users
    const groupId = JSON.parse(httpContextContract.request.raw() ?? '{}').groupId ?? null
    if (groupId === null) {
      return httpContextContract.response.badRequest('groupId is null')
    }
    let expense = await Expense.create({
      name: name,
      lenderId: httpContextContract.auth.user?.id,
      groupId: groupId,
    })
    for (const user of users) {
      await expense
        .related('borrowers')
        .attach({ [user.id]: { amount: user.amount, is_paid: user.isPaid } })
    }
    return httpContextContract.response.created(expense)
  }
}
