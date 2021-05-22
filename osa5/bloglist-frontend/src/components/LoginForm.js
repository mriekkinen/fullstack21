import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { login } from '../reducers/loginReducer'

const LoginForm = () => {
  const [ username, setUsername ] = useState('')
  const [ password,  setPassword] = useState('')

  const dispatch = useDispatch()

  const handleLogin = async (e) => {
    e.preventDefault()

    dispatch(login({ username, password }))
  }

  return (
    <div className='login-form'>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>
            username
            <input
              type='text'
              name='username'
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoFocus
            />
          </label>
        </div>
        <div>
          <label>
            password
            <input
              type='password'
              name='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </label>
        </div>
        <div>
          <button type='submit'>
            log in
          </button>
        </div>
      </form>
    </div>
  )
}

LoginForm.propTypes = {}

export default LoginForm
