import Group from 'App/Models/Group'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import validator from 'validator'
import isInt = validator.isInt
import * as console from 'console'
import Drive from '@ioc:Adonis/Core/Drive'

export default class GroupController {
  public async index({ auth, response }: HttpContextContract) {
    const groups = await Group.query()
      .whereHas('users', (query) => {
        query.where('users.id', auth.user?.id!)
      })
      .preload('users')
    for (const group of groups) {
      for (const user of group.users) {
        user.avatarUrl = await Drive.getSignedUrl(user.avatarUrl)
      }
    }
    response.send(groups)
  }

  public async store(httpContextContract: HttpContextContract) {
    const name = JSON.parse(httpContextContract.request.raw() ?? '{}').name
    const users = JSON.parse(httpContextContract.request.raw() ?? '{}').users
    console.log(httpContextContract.request)
    const group = await Group.create({ name })
    for (const user of users) {
      await group.related('users').attach([user.id])
    }
    await httpContextContract.auth.user?.related('groups').attach([group.id])
    return httpContextContract.response.created(group)
  }

  public async addMember(httpContextContract: HttpContextContract) {
    const groupId = httpContextContract.request.input('groupId')
    const userId = httpContextContract.request.input('userId')
    const group = await Group.findOrFail(groupId)
    await group.related('users').attach([userId])
    return this.index(httpContextContract)
  }

  public async removeMember(httpContextContract: HttpContextContract) {
    const groupId = httpContextContract.request.input('groupId')
    const userId = httpContextContract.request.input('userId')
    const group = await Group.findOrFail(groupId)
    await group.related('users').detach([userId])
    return this.index(httpContextContract)
  }

  public async destroy(httpContextContract: HttpContextContract) {
    const groupId = httpContextContract.request.input('groupId')
    const group = await Group.findOrFail(groupId)
    await group.delete()
    return this.index(httpContextContract)
  }

  public async show(httpContextContract: HttpContextContract) {
    let groupId = httpContextContract.params.id
    if (isInt(groupId)) {
      groupId = parseInt(groupId)
    }
    const group = await Group.findOrFail(groupId)
    const expenses = await group
      .related('expenses')
      .query()
      .preload('borrowers', (borrowersQuery) => {
        borrowersQuery
          .pivotColumns(['is_paid', 'amount'])
          .select('users.id', 'user_expenses.is_paid', 'user_expenses.amount')
      })
    console.log(expenses)
    return { id: group.id, name: group.name, expenses: expenses }
  }

  public async updateBorrowers(httpContextContract: HttpContextContract) {
    const data = JSON.parse(httpContextContract.request.raw() ?? '{}')
    const groupId = data.groupId
    const expenses = data.expenses
    const group = await Group.findOrFail(groupId)
    for (const expense of expenses) {
      const expenseId = expense.id
      const borrowers = expense.borrowers
      const expenseModel = await group
        .related('expenses')
        .query()
        .where('id', parseInt(expenseId))
        .firstOrFail()
      for (const borrower of borrowers) {
        await expenseModel
          .related('borrowers')
          .pivotQuery()
          .where('user_id', '=', parseInt(borrower.id))
          .update({ is_paid: borrower.is_paid })
      }
    }
    return httpContextContract.response.ok(group)
  }

  public async showUsers(httpContextContract: HttpContextContract) {
    let groupId = httpContextContract.params.id
    if (isInt(groupId)) {
      groupId = parseInt(groupId)
    }
    const group = await Group.findOrFail(groupId)
    const expenses = await group
      .related('expenses')
      .query()
      .preload('borrowers', (borrowersQuery) => {
        borrowersQuery
          .pivotColumns(['is_paid', 'amount'])
          .select('users.id', 'user_expenses.is_paid', 'user_expenses.amount')
      })
    const users = await group
      .related('users')
      .query()
      .select('users.id', 'users.username', 'users.avatar_url')
    for (const user of users) {
      user.avatarUrl = await Drive.getSignedUrl(user.avatarUrl)
    }
    console.log(expenses)
    return { groups: { id: group.id, name: group.name, expenses: expenses }, users: users }
  }
}
