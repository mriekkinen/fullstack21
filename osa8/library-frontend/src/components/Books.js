import React, { useEffect, useState } from 'react'
import _ from 'lodash'
import { useLazyQuery, useQuery, useSubscription } from '@apollo/client'
import { ALL_BOOKS, BOOK_ADDED } from '../queries'

const Books = ({ updateCacheWith, show }) => {
  const [genres, setGenres] = useState([])
  const [genre, setGenre] = useState(undefined)
  const [allBooks, result] = useLazyQuery(ALL_BOOKS)
  const resultAll = useQuery(ALL_BOOKS)

  useEffect(() => {
    // NB: In order to show all genres, genre should have the value undefined
    allBooks({ variables: { genre } })
  }, [genre]) // eslint-disable-line

  useEffect(() => {
    if (resultAll.data) {
      const genreList = _.flatten(resultAll.data.allBooks.map(b => b.genres))

      // https://stackoverflow.com/questions/1960473
      setGenres([...new Set(genreList)])
    }
  }, [resultAll.data])

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const newBook = subscriptionData.data.bookAdded
      if (updateCacheWith(newBook)) {
        window.alert(
          `Received a new book from the server:\n\n"${newBook.title}"\nby ${newBook.author.name}`
        )
      }
    }
  })

  if (!show) {
    return null
  }

  if (result.loading) {
    return null
  }

  const books = result.data.allBooks

  return (
    <div>
      <h2>books</h2>
      {genre
        ? <span>in genre <strong>{genre}</strong></span>
        : <span>in <strong>all genres</strong></span>
      }
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {books.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
      <div>
        {genres.map(g =>
          <button
            key={g}
            type='button'
            onClick={() => setGenre(g)}>
            {g}
          </button>
        )}
        <button
          type='button'
          onClick={() => setGenre(undefined)}>
          all genres
        </button>
      </div>
    </div>
  )
}

export default Books
