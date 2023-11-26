import Group from 'App/Models/Group'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import validator from 'validator'
import isInt = validator.isInt
import Database from '@ioc:Adonis/Lucid/Database'
import * as console from 'console'

export default class GroupController {

  public async index({ auth, response }: HttpContextContract) {
    const groups = await auth.user?.related('groups').query()
    response.send(JSON.stringify(groups))
  }

  public async store(httpContextContract: HttpContextContract) {
    const name = JSON.parse(httpContextContract.request.raw() || "{}").name
    console.log(httpContextContract.request)
    const group = await Group.create({ name })
    httpContextContract.auth.user?.related('groups').attach([group.id])
    return this.index(httpContextContract)
  }

  public async addMember(httpContextContract: HttpContextContract) {
    const groupId = httpContextContract.request.input('groupId')
    const userId = httpContextContract.request.input('userId')
    const group = await Group.findOrFail(groupId)
    await group.related('User').attach([userId])
    return this.index(httpContextContract)
  }

  public async removeMember(httpContextContract: HttpContextContract) {
    const groupId = httpContextContract.request.input('groupId')
    const userId = httpContextContract.request.input('userId')
    const group = await Group.findOrFail(groupId)
    await group.related('User').detach([userId])
    return this.index(httpContextContract)
  }

  public async destroy(httpContextContract: HttpContextContract) {
    const groupId = httpContextContract.request.input('groupId')
    const group = await Group.findOrFail(groupId)
    await group.delete()
    return this.index(httpContextContract)
  }

  public async show(httpContextContract: HttpContextContract) {
    let groupId = JSON.parse(httpContextContract.request.raw() || "{}").id
    if (isInt(groupId)){
      groupId = parseInt(groupId)
    }
    const group = await Group.findOrFail(groupId)
    const paid =  await Database.query().from('user_expenses').where('is_paid', false).sum('amount').groupBy('lender_id').join('expenses','expense_id', 'expenses.id').select('lender_id')// await group.related('Expense').query().select('id', 'name', 'amount', 'lender_id')
    const borrowed =  await Database.query().from('user_expenses').where('is_paid', false).sum('amount').groupBy('user_id').join('expenses','expense_id', 'expenses.id').select('user_id')// await group.related('Expense').query().select('id', 'name', 'amount', 'lender_id')
    const users = await group.related('User').query().select('id', 'username', 'avatarUrl')
    console.log(paid, borrowed)
    return {id: group.id, name : group.name, users: users, paid: paid, borrowed: borrowed}
  }


}
