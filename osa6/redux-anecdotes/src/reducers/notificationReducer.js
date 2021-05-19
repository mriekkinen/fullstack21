const reducer = (state = null, action) => {
  switch (action.type) {
    case 'NOTIFICATION/SET_MESSAGE':
      return action.data.message
    case 'NOTIFICATION/CLEAR':
      return null
    default:
      return state
  }
}

let timeoutId

export const setNotification = (message, duration) => {
  return async (dispatch) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }

    dispatch({
      type: 'NOTIFICATION/SET_MESSAGE',
      data: { message }
    })

    timeoutId = setTimeout(() =>
      dispatch({
        type: 'NOTIFICATION/CLEAR'
      }), duration * 1000
    )
  }
}

export default reducer
