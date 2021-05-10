import React from 'react'
import PropTypes from 'prop-types'

const Notification = ({ type, message }) => {
  if (!(type && message)) return null
  return (
    <div className={`notification ${type}`}>
      {message}
    </div>
  )
}

Notification.propTypes = {
  type: PropTypes.string,
  message: PropTypes.string
}

export default Notification
