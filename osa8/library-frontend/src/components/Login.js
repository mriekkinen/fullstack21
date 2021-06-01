import React, { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'

const Login = ({ setError, setToken, setPage, show }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      setError(error.graphQLErrors[0].message)
    }
  })

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('library-user-token', token)
      setUsername('')
      setPassword('')
      setPage('authors')
    }
  }, [result.data]) // eslint-disable-line

  if (!show) {
    return null
  }

  const submit = (e) => {
    e.preventDefault()
    login({ variables: { username, password }})
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          <label>
            username:
            <input
              type='text'
              value={username}
              onChange={e => setUsername(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            password:
            <input
              type='password'
              value={password}
              onChange={e => setPassword(e.target.value)} />
          </label>
        </div>
        <div>
          <button type='submit'>login</button>
        </div>
      </form>
    </div>
  )
}

export default Login
