import React from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { logout } from '../reducers/loginReducer'

const WhoAmI = ({ name }) => {
  const dispatch = useDispatch()

  return (
    <p className='whoami'>
      {name} logged in
      <button onClick={() => dispatch(logout())}>
        log out
      </button>
    </p>
  )
}

WhoAmI.propTypes = {
  name: PropTypes.string.isRequired
}

export default WhoAmI
