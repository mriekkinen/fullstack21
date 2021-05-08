import React, { useState, useImperativeHandle } from 'react'

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

export default Togglable
