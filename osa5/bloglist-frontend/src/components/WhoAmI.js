import React from 'react'
import PropTypes from 'prop-types'

const WhoAmI = ({ name, logout }) => (
  <p className='whoami'>
    {name} logged in
    <button onClick={() => logout()}>
      log out
    </button>
  </p>
)

WhoAmI.propTypes = {
  name: PropTypes.string.isRequired,
  logout: PropTypes.func.isRequired
}

export default WhoAmI
