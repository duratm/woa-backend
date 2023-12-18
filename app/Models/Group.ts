import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany, ManyToMany, hasMany, HasMany} from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import Expense from 'App/Models/Expense'

export default class Group extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @manyToMany(() => User, {
    pivotTable: 'group_users',
    pivotForeignKey: 'group_id',
    pivotRelatedForeignKey: 'user_id'
  })
  public users: ManyToMany<typeof User>

  @hasMany(() => Expense)
  public expenses: HasMany<typeof Expense>

}
