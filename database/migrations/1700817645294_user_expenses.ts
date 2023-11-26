import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'user_expenses'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.float("amount").notNullable()
      table.boolean("is_paid").defaultTo(false)
      table.integer("user_id").unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer("expense_id").unsigned().references('id').inTable('expenses').onDelete('CASCADE')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
