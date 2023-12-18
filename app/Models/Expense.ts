import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany, ManyToMany, belongsTo, BelongsTo} from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import Group from 'App/Models/Group'

export default class Expense extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  name: string

  @column()
  amount: number

  @column()
  isPaid: boolean

  @manyToMany(() => User, {
    pivotTable: 'user_expenses',
    pivotForeignKey: 'expense_id',
    pivotRelatedForeignKey: 'user_id',
    pivotColumns: ['amount', 'is_paid']
  })
  public borrowers: ManyToMany<typeof User>

  @belongsTo(() => User, {
    foreignKey: 'lenderId',
  })
  public lender: BelongsTo<typeof User>

  @column()
  public lenderId: number

  @belongsTo(() => Group)
  public group: BelongsTo<typeof Group>

  @column()
  public groupId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
