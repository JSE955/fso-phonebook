import { useEffect, useState } from 'react'
import personsService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    personsService
      .getAll()
      .then(initialPeople => {
        setPersons(initialPeople)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const value = persons.findIndex(p => p.name === newName)
    if (value >= 0) {
      alert(`${newName} is already added to phonebook`)
    } else {
      const person = {
        name: newName,
        number: newNumber
      }
      personsService
        .create(person)
        .then(newPerson => {
          setPersons(persons.concat(newPerson))
        })
    }
    setNewName('')
    setNewNumber('')
  }

  const deletePerson = (id) => {
    personsService
      .removePerson(id)
      .then(setPersons(persons.filter(person => person.id !== id)))
  }
  
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        filter shown with <input name={filter} onChange={handleFilterChange} />
      </div>

      <h2>add a new</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange}/>
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <Numbers filter={filter} persons={persons} forButton={deletePerson}/>
    </div>
  )
}

const Numbers = ({filter, persons, forButton}) => {
  if (filter === "") {
    return (
      <ul>
        {persons.map(person => <li key={person.id}>{person.name} {person.number} <DeleteButton id={person.id} deletion={forButton}/></li>)}
      </ul>
    )
  }
  const filteredPersons = persons.filter(person => person.name.toLowerCase().startsWith(filter.toLowerCase()))
  return (
    <ul>
      {filteredPersons.map(person => <li key={person.id}>{person.name} {person.number} <DeleteButton id={person.id} deletion={forButton}/></li>)}
    </ul>
  )
}

const DeleteButton = ({id, deletion}) => {
  return (
    <button onClick={() => deletion(id)}>delete {id}</button>
  )
}

export default App