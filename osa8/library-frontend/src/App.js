import React, { useEffect, useState } from 'react'
import { useApolloClient, useLazyQuery } from '@apollo/client'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Recommend from './components/Recommend'
import Login from './components/Login'
import Notification from './components/Notification'
import { ALL_AUTHORS, ALL_BOOKS } from './queries'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const [error, setError] = useState(null)

  const client = useApolloClient()
  const [allBooks] = useLazyQuery(ALL_BOOKS)

  useEffect(() => {
    const storedToken = localStorage.getItem('library-user-token')
    if (storedToken) {
      setToken(storedToken)
    }
  }, [])

  const setErrorMessage = (message) => {
    setError(message)
    setTimeout(() => setError(null), 5000)
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    setPage('authors')
  }

  const updateCacheWith = (newBook) => {
    if (updateCacheWithBook(newBook)) {
      updateCacheWithAuthor(newBook.author)

      return true
    }

    return false
  }

  const updateCacheWithBook = (newBook) => {
    const dataInStore = client.readQuery({ query: ALL_BOOKS })
    const books = dataInStore.allBooks

    if (books.some(b => b.id === newBook.id)) {
      return false
    }

    client.writeQuery({
      query: ALL_BOOKS,
      data: {
        allBooks: [...books, newBook]
      }
    })

    newBook.genres.forEach(g => {
      const inGenreStore = client.readQuery({
        query: ALL_BOOKS,
        variables: { genre: g }
      })

      if (!inGenreStore) {
        // results for this genre are missing from the cache
        // -> fetch from the server
        return allBooks({ variables: { genre: g }})
      }

      const inGenre = inGenreStore.allBooks

      client.writeQuery({
        query: ALL_BOOKS,
        variables: { genre: g },
        data: {
          allBooks: [...inGenre, newBook]
        }
      })
    })

    return true
  }

  const updateCacheWithAuthor = (newAuthor) => {
    const dataInStore = client.readQuery({ query: ALL_AUTHORS })
    const authors = dataInStore.allAuthors

    if (authors.some(a => a.id === newAuthor.id)) {
      return false
    }

    client.writeQuery({
      query: ALL_AUTHORS,
      data: {
        allAuthors: [...authors, newAuthor]
      }
    })

    return true
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token &&
          <>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={() => setPage('recommend')}>recommend</button>
            <button onClick={logout}>logout</button>
          </>
        }
        {!token &&
          <button onClick={() => setPage('login')}>login</button>
        }
      </div>

      <Notification
        message={error}
      />

      <Authors
        token={token}
        show={page === 'authors'}
      />

      <Books
        updateCacheWith={updateCacheWith}
        show={page === 'books'}
      />

      <NewBook
        updateCacheWith={updateCacheWith}
        setError={setErrorMessage}
        show={page === 'add'}
      />

      <Recommend
        token={token}
        show={page === 'recommend'}
      />

      <Login
        setToken={setToken}
        setError={setErrorMessage}
        setPage={setPage}
        show={page === 'login'}
      />
    </div>
  )
}

export default App
