import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { login } from '../reducers/loginReducer'
import Notification from './Notification'
import styled from 'styled-components'
import { Button } from './Button'

const LoginForm = () => {
  const [ username, setUsername ] = useState('')
  const [ password,  setPassword] = useState('')

  const dispatch = useDispatch()

  const handleLogin = async (e) => {
    e.preventDefault()

    dispatch(login({ username, password }))
  }

  return (
    <LoginContainer>
      <Notification />
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <Grid>
          <Label htmlFor='username'>username:</Label>
          <input
            type='text'
            id='username'
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoFocus
          />
          <Label htmlFor='password'>password:</Label>
          <input
            type='password'
            id='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </Grid>
        <SubmitButton type='submit'>
          log in
        </SubmitButton>
      </form>
    </LoginContainer>
  )
}

const LoginContainer = styled.div`
  max-width: 600px;
  margin: 8px 3vw;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 3px 8px;
  max-width: 200px;
`

const Label = styled.label`
  /*justify-self: end;*/
`

const SubmitButton = styled(Button)`
  margin: 3px 0;
`

LoginForm.propTypes = {}

export default LoginForm
