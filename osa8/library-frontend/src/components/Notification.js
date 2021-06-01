import React from 'react'

const Notification = ({ message }) => {
  if (!message) {
    return null
  }

  return (
    <div style={{ color: 'red', margin: '5px 0'}}>
      {message}
    </div>
  )
}

export default Notification
