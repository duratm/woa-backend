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
// import transmit from '@ioc:Adonis/Addons/Transmit'

// transmit
//   .subscribeToChannel('test', 'test', async (payload) => {
//     console.log(payload)
//   })
//   .then((r) => console.log(r))

Route.get('/hello', async () => {
  return { hello: 'world' }
})

Route.group(() => {
  Route.get('/', 'AuthController.login')
  Route.post('/', 'AuthController.register')

  Route.group(() => {
    Route.get('/logout', 'AuthController.logout')
    Route.get('/', 'AuthController.me')
    Route.patch('/', 'AuthController.update')
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
    Route.delete('/:id/users/:userId', 'GroupController.removeUser')
  }).prefix('/groups')

  Route.group(() => {
    Route.post('/', 'ExpenseController.store')
    Route.delete('/:id', 'ExpenseController.destroy')
    Route.patch('/', 'GroupController.updateBorrowers')
  }).prefix('/expenses')

  Route.group(() => {
    Route.get('/', 'UserController.index')
    Route.get('/:id', 'UserController.groupUsers')
  }).prefix('/users')

  Route.group(() => {
    Route.get('/', 'NotificationController.register')
    Route.get('/test', 'NotificationController.sendMessage')
  }).prefix('/notifications')
})
  .prefix('/api')
  .middleware('auth')
