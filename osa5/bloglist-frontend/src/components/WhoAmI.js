import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../reducers/loginReducer'

const WhoAmI = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)

  return (
    <div className='whoami'>
      {user.name} logged in
      <button onClick={() => dispatch(logout())}>
        log out
      </button>
    </div>
  )
}

WhoAmI.propTypes = {}

export default WhoAmI
