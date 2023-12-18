import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  column,
  beforeSave,
  BaseModel,
  ManyToMany,
  manyToMany,
  hasMany,
  HasMany,
} from '@ioc:Adonis/Lucid/Orm'
import Group from 'App/Models/Group'
import Expense from 'App/Models/Expense'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public username: string

  @column()
  public avatarUrl: string | null

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @manyToMany(() => Group, {
    pivotTable: 'group_users',
    pivotForeignKey: 'user_id',
    pivotRelatedForeignKey: 'group_id'
  })
  public groups: ManyToMany<typeof Group>

  @manyToMany(() => Expense, {
    pivotTable: 'user_expenses',
    pivotForeignKey: 'expense_id',
    pivotRelatedForeignKey: 'user_id',
    pivotColumns: ['amount', 'is_paid']
  })
  public borrowings: ManyToMany<typeof Expense>

  @column()
  public amount: number

  @column()
  public is_paid: boolean

  @hasMany(() => Expense, {
    foreignKey: 'lender',
    localKey: 'expenses'
  })
  public expenses: HasMany<typeof Expense>

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
