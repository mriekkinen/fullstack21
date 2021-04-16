import React, { useState } from 'react'

const Filter = ({ filter, handleFilterChange }) => (
  <div>
    filter shown with:
    <input
      value={filter}
      onChange={handleFilterChange} />
  </div>
)

const PersonForm = ({ newName, newNumber, handleNameChange, handleNumberChange, addPerson }) => (
  <form onSubmit={addPerson}>
    <div>
      name:
      <input
        value={newName}
        onChange={handleNameChange} />
    </div>
    <div>
      number:
      <input
        value={newNumber}
        onChange={handleNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

const Persons = ({ filteredPersons }) => (
  <div>
    {filteredPersons.map(person => 
      <Person key={person.name} person={person} />
    )}
  </div>
)

const Person = ({ person }) => (
  <div>
    {person.name} {person.number}
  </div>
)

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filter, setFilter ] = useState('')

  const handleNameChange = (e) => {
    setNewName(e.target.value)
  }

  const handleNumberChange = (e) => {
    setNewNumber(e.target.value)
  }

  const addPerson = (e) => {
    e.preventDefault()

    if (persons.some(p => p.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    const newPerson = { name: newName, number: newNumber }
    setPersons(persons.concat(newPerson))
    setNewName('')
    setNewNumber('')
  }

  const handleFilterChange = (e) => {
    setFilter(e.target.value)
  }

  const filteredPersons = filter === ''
    ? persons
    : persons.filter(p =>
        p.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter
        filter={filter}
        handleFilterChange={handleFilterChange} />

      <h2>add a new</h2>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addPerson={addPerson} />

      <h2>Numbers</h2>
      <Persons
        filteredPersons={filteredPersons} />
    </div>
  )
}

export default App
