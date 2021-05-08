import React from 'react'

const WhoAmI = ({ name, logout }) => (
  <p className='whoami'>
    {name} logged in
    <button onClick={() => logout()}>
      logout
    </button>
  </p>
)

export default WhoAmI
