import React, { useState, useEffect } from 'react'
import personService from './services/persons'
import './index.css'

const Notification = ({ message }) => {
  if (!message.message) {
    return null
  }

  return (
    <div className={`notification ${message.type}`}>
      {message.message}
    </div>
  )
}

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

const Persons = ({ filteredPersons, removePerson }) => (
  <div>
    {filteredPersons.map(person => 
      <Person
        key={person.name}
        person={person}
        removePerson={removePerson} />
    )}
  </div>
)

const Person = ({ person, removePerson }) => (
  <div>
    {person.name} {person.number}
    <button onClick={removePerson(person)}>
      delete
    </button>
  </div>
)

const App = () => {
  const [ persons, setPersons ] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filter, setFilter ] = useState('')
  const [ message, setMessage ] = useState({})

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const showMessage = (message, type = 'success') => {
    setMessage({ message, type })
    setTimeout(() => {
      setMessage({})
    }, 5000);
  }

  const handleNameChange = (e) => {
    setNewName(e.target.value)
  }

  const handleNumberChange = (e) => {
    setNewNumber(e.target.value)
  }

  const addPerson = (e) => {
    e.preventDefault()

    const oldPerson = persons.find(p => p.name === newName)

    if (oldPerson) {
      const changedPerson = { ...oldPerson, number: newNumber }
      updatePerson(oldPerson.id, changedPerson)
      return
    }

    const newPerson = { name: newName, number: newNumber }
    personService
      .create(newPerson)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        showMessage(`Added ${returnedPerson.name}`)
      })
      .catch(error => {
        showMessage(error.response.data.error, 'failure')
      })
  }

  const updatePerson = (id, changedPerson) => {
    if (window.confirm(`${changedPerson.name} is already added to phonebook, replace the old number with a new one?`)) {
      personService
        .update(id, changedPerson)
        .then(returnedPerson => {
          setPersons(persons.map(person => person.id !== id ? person : returnedPerson))
          setNewName('')
          setNewNumber('')
          showMessage(
            `Updated ${returnedPerson.name}`
          )
        })
        .catch(error => {
          showMessage(
            `Information of ${changedPerson.name} has already been removed from server`,
            'failure'
          )
          setPersons(persons.filter(person => person.id !== id))
        })
    }
  }

  const removePerson = (person) => () => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .remove(person.id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== person.id))
          showMessage(`Deleted ${person.name}`)
        })
        .catch(error => {
          showMessage(
            `Information of ${person.name} has already been removed from server`,
            'failure'
          )
          setPersons(persons.filter(p => p.id !== person.id))
        })
    }
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
      <Notification message={message} />
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
        filteredPersons={filteredPersons}
        removePerson={removePerson} />
    </div>
  )
}

export default App
