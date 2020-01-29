const express = require('express')

const app = express()

app.use(express.json())

const users = ['Diego', 'Ruan', 'Marcelo']

app.use((request, response, next) => {
  console.time('Request')
  console.log(`Método: ${request.method}; URL: ${request.url}`)

  next()

  console.timeEnd('Request')
})

function checkUserExists(request, response, next) {
  if (!request.body.name) {
    return response.status(400).json({ error: 'User name is required' })
  }

  return next()
}

function checkUserInArray(request, response, next) {
  const user = users[request.params.index]
  if(!users){
     return response.status(400).json({error: 'User does not exists'})
  }

  request.user = user;

  return next();
}

app.get('/users', (request, response) => {
  response.json(users)
})

app.get('/users/:index',checkUserInArray, (request, response) => {
  //const { index } = request.params
  response.json(request.user);
})

app.post('/users', checkUserExists, (request, response) => {
  const { name } = request.body
  users.push(name)

  return response.json(users)

})

app.put('/users/:index', checkUserInArray, checkUserExists, (request, response) => {
  const { index } = request.params
  const { name } = request.body

  users[index] = name

  return response.json(users)

})

app.delete('/users/:index', checkUserInArray, (request, response) => {
  const { index } = request.params

  users.splice(index, 1)

  return response.send()
})

app.listen(3000)