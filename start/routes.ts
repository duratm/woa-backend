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
  Route.get('/me', 'AuthController.me')
}).prefix('/auth').middleware('auth')

Route.post('/login', 'AuthController.login')

Route.post('/register', 'AuthController.register')

Route.post('/logout', 'AuthController.logout').middleware('auth')

Route.post('/groups', 'GroupController.index').middleware('auth')

Route.post('/groups/create', 'GroupController.store').middleware('auth')

Route.post('/groups/addMember', 'GroupController.addMember').middleware('auth')

Route.post('/groups/removeMember', 'GroupController.removeMember').middleware('auth')

Route.post('/groups/delete', 'GroupController.destroy').middleware('auth')

Route.post('/users/all', 'UserController.index').middleware('auth')

Route.get('/groups/show/:id', 'GroupController.show').middleware('auth')

Route.get('/groups/show/users/:id', 'GroupController.showUsers').middleware('auth')

Route.get('/groups/update', 'GroupController.update').middleware('auth')

Route.put('/groups/expense/create', 'ExpenseController.store').middleware('auth')

