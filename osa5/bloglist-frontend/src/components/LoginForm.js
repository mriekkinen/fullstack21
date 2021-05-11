import React, { useState } from 'react'
import PropTypes from 'prop-types'

const LoginForm = ({ login }) => {
  const [ username, setUsername ] = useState('')
  const [ password,  setPassword] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()

    await login({ username, password })
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

LoginForm.propTypes = {
  login: PropTypes.func.isRequired
}

export default LoginForm