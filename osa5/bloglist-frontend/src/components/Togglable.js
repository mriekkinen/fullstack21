import React, { useState, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Button } from './Button'

const Togglable = React.forwardRef((props, ref) => {
  const { buttonLabel, children } = props
  const [ isVisible, setVisible ] = useState(false)

  useImperativeHandle(ref, () => ({
    setVisible
  }))

  return (
    <>
      {isVisible
        ? <div>
            {children}
            <FormButton onClick={() => setVisible(false)}>
              cancel
            </FormButton>
          </div>
        : <FormButton onClick={() => setVisible(true)}>
            {buttonLabel}
          </FormButton>
      }
    </>
  )
})

const FormButton = styled(Button)`
  margin: 1px 0;
`

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
}

Togglable.displayName = 'Togglable'

export default Togglable
