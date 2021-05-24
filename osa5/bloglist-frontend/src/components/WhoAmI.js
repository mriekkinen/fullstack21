import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../reducers/loginReducer'
import styled from 'styled-components'
import { FaUserCircle } from 'react-icons/fa'
import { Button } from './Button'

const WhoAmI = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)

  return (
    <UserContainer>
      <UserIcon />
      {user.name}
      <Button onClick={() => dispatch(logout())}>
        log out
      </Button>
    </UserContainer>
  )
}

const UserContainer = styled.div`
  display: flex;
  align-items: center;
`

const UserIcon = styled(FaUserCircle)`
  width: 1em;
  height: 1em;
  padding-right: 3px;
`

WhoAmI.propTypes = {}

export default WhoAmI
