import React, { useState, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'

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
            <button onClick={() => setVisible(false)}>
              cancel
            </button>
          </div>
        : <button onClick={() => setVisible(true)}>
            {buttonLabel}
          </button>
      }
    </>
  )
})

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
}

Togglable.displayName = 'Togglable'

export default Togglable
