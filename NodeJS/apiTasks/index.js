const express = require('express')

const server = express()
server.use(express.json())

const projects = [{ id: 1, title: "Novo Projeto", tasks: ["Fazer compras", "Buscar as crianças"] }]

function logRequests(req, res, next) {
    console.count("Número de requisições");

    return next();
}

server.use(logRequests)

server.use((req, res, next) => {
    console.time('Request')
    console.log(`Method: ${req.method}; URL: ${req.url}`)

    next()

    console.timeEnd('Request')
})


function checkProjectExists(req, res, next) {
    if (!projects[req.params.id - 1]) {
        return res.status(400).json({ error: 'Project does not exists' })
    }

    return next();
}


server.get('/projects', (req, res) => {
    res.json(projects)
})

server.get(`/projects/:id`, checkProjectExists, (req, res) => {

    const { id } = req.params

    res.json(projects[id - 1]);

})

server.post('/projects', (req, res) => {
    const { id, title, tasks } = req.body
    projects.push({ id, title, tasks })

    return res.json(projects)
})

server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
    const { id } = req.params
    const { title } = req.body

    projects[id - 1].tasks.push(title)

    return res.json(projects)
})

server.put('/projects/:id', checkProjectExists, (req, res) => {
    const { id } = req.params
    const { title } = req.body

    projects[id - 1].title = title

    return res.json([projects])
})

server.delete('/projects/:id', checkProjectExists, (req, res) => {
    const { id } = req.params
    projects.splice(id - 1, 1)

    return res.send()
})

server.listen(3333)
