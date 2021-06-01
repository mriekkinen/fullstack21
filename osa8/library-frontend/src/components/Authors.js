import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'
import Select from 'react-select'

const Authors = ({ token, show }) => {
  const result = useQuery(ALL_AUTHORS)

  if (!show) {
    return null
  }

  if (result.loading) {
    return null
  }

  const authors = result.data.allAuthors

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>

      <SetBirthyear
        token={token}
        authors={authors} />
    </div>
  )
}

const SetBirthyear = ({ token, authors }) => {
  const [selectedAuthor, setSelectedAuthor] = useState(null)
  const [born, setBorn] = useState('')

  const [ editAuthor ] = useMutation(EDIT_AUTHOR)

  const setBirthyear = (e) => {
    e.preventDefault()
    if (!selectedAuthor) return

    editAuthor({
      variables: {
        name: selectedAuthor.value,
        born: Number(born)
      }
    })

    //setSelectedAuthor(null)
    setBorn('')
  }

  const options = authors.map(author => ({
    value: author.name,
    label: author.name
  }))

  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={setBirthyear}>
        <div style={{ maxWidth: 300 }}>
          <label>
            author: <br />
            <Select
              defaultValue={selectedAuthor}
              onChange={setSelectedAuthor}
              options={options} />
          </label>
        </div>
        <div>
          <label>
            born: <br />
            <input
              type='number'
              value={born}
              onChange={e => setBorn(e.target.value)} />
          </label>
        </div>
        <div>
          <button type='submit'>
            update author
          </button>
        </div>
      </form>
    </div>
  )
}

export default Authors
