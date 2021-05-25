import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import styled, { css } from 'styled-components'

const Notification = () => {
  const { type, message } = useSelector(state => state.notification)

  if (!(type && message)) {
    return null
  }

  return (
    <Message
      id='notification'
      type={type}>
      {message}
    </Message>
  )
}

const Message = styled.div`
  padding: 10px;
  margin: 0;
  border: none;
  border-radius: 5px;
  font-size: 1.2em;
  font-weight: 400;

  ${props => props.type === 'success' && css`
    color: #FAFAFA;
    background-color: #81C784;
  `}

  ${props => props.type === 'error' && css`
    color: #FAFAFA;
    background-color: #E57373;
  `}
`

Notification.propTypes = {
  type: PropTypes.string,
  message: PropTypes.string
}

export default Notification
