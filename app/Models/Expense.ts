import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany, ManyToMany, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import Group from 'App/Models/Group'

export default class Expense extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  name: string

  @manyToMany(() => User, {
    pivotTable: 'user_expenses',
    pivotForeignKey: 'expense_id',
    pivotRelatedForeignKey: 'user_id',
    pivotColumns: ['amount', 'is_paid']
  })
  public borrowers: ManyToMany<typeof User>

  @hasOne(() => User, {
    foreignKey: 'lender_id'
  })
  public lender: HasOne<typeof User>

  @hasOne(() => Group)
  public group: HasOne<typeof Group>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
