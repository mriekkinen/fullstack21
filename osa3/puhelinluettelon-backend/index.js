const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

morgan.token('body', (req, res) => JSON.stringify(req.body))

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
  }
]

app.get('/info', (req, res) => {
  res.send(`
    <p>
      Phonebook has info for ${persons.length} people
    </p>
    <p>
      ${new Date()}
    </p>
  `)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)

  if (!person) {
    return res.status(404).end()
  }

  res.json(person)
})

app.post('/api/persons', (req, res) => {
  const person = req.body
  const generateId = () => Math.floor(Math.random() * 1000000)

  if (!person.name || !person.number) {
    return res.status(400).json({
      error: 'name or number is missing'
    })
  }

  if (persons.some(p => p.name === person.name)) {
    return res.status(400).json({
      error: 'name must be unique'
    })
  }

  const newPerson = {
    name: person.name,
    number: person.number,
    id: generateId()
  }

  persons.push(newPerson)
  res.json(newPerson)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(p => p.id !== id)

  res.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})