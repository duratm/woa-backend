/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/hello', async () => {
  return { hello: 'world' }
})

Route.group(() => {
  Route.get('/', 'AuthController.login')
  Route.post('/', 'AuthController.register')

  Route.group(() => {
    Route.get('/logout', 'AuthController.logout')
    Route.get('/', 'AuthController.me')
  })
    .prefix('/me')
    .middleware('auth')
}).prefix('/auth')

Route.group(() => {
  Route.group(() => {
    Route.get('/', 'GroupController.index')
    Route.post('/', 'GroupController.store')
    Route.patch('/', 'GroupController.update')
    Route.delete('/', 'GroupController.destroy')
    Route.group(() => {
      Route.patch('/', 'GroupController.addMember')
      Route.delete('/', 'GroupController.removeMember')
    }).prefix('/members')
    Route.group(() => {
      Route.get('/:id', 'GroupController.show')
      Route.get('/users/:id', 'GroupController.showUsers')
    }).prefix('/show')
  }).prefix('/groups')

  Route.group(() => {
    Route.post('/', 'ExpenseController.store')
    Route.delete('/:id', 'ExpenseController.destroy')
  }).prefix('/expenses')

  Route.group(() => {
    Route.get('/', 'UserController.index')
    Route.get('/:id', 'UserController.groupUsers')
  }).prefix('/users')
})
  .prefix('/api')
  .middleware('auth')
