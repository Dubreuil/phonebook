const express = require('express')
const morgan = require('morgan')

const app = express()

morgan.token('post_return', function (req, res) { 
    const method = req.method

    if (method === 'POST') {
        return JSON.stringify(req.body)
    } else {
        return ""
    }
})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post_return'))

let persons = [
    {
        "name": "Mathieu Dubreuil",
        "number": "12123434",
        "id": 5
    },
    {
        "name": "Arto Hellas",
        "number": "1234512345",
        "id": 6
    }
]

app.get('/info', (req, res) => {
    
    res.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>
        `)
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)

    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const id = Math.floor(Math.random() * 1000000)
    const body = req.body

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'Missing parameters'
        })
    } 

    const name = body.name
    const number = body.number

    const exists = persons.filter(p => p.name === name).length > 0 ? true : false

    if (exists) {
        return res.status(400).json({
            error: 'Name must be unique'
        })
    
    } else {
        const person = {
            name: body.name,
            number: body.number,
            id: id
        }
        
        persons = persons.concat(person)
        res.json(persons)
    }
})

const PORT = 3001
app.listen(PORT)
console.log(`Listening on Port ${PORT}`)