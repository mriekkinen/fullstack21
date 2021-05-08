import React from 'react'

const Notification = ({ type, message }) => {
  if (!(type && message)) return null
  return (
    <div className={`notification ${type}`}>
      {message}
    </div>
  )
}

export default Notification
