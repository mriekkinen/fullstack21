import React, { useEffect } from 'react'
import { useLazyQuery, useQuery } from '@apollo/client'
import { ALL_BOOKS, ME } from '../queries'

const Recommend = ({ token, show }) => {
  const resultMe = useQuery(ME)
  const [allBooks, result] = useLazyQuery(ALL_BOOKS)

  useEffect(() => {
    resultMe.refetch()
  }, [token]) // eslint-disable-line

  useEffect(() => {
    if (resultMe.data && resultMe.data.me) {
      allBooks({ variables: {
        genre: resultMe.data.me.favoriteGenre
      }})
    }
  }, [resultMe.data]) // eslint-disable-line

  if (!show) {
    return null
  }

  if (result.loading) {
    return null
  }

  const books = result.data.allBooks
  const favoriteGenre = resultMe.data.me.favoriteGenre

  return (
    <div>
      <h2>recommendations</h2>
      <span>
        in your favorite genre <strong>{favoriteGenre}</strong>
      </span>
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
    </div>
  )
}

export default Recommend
