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

export const setNotification = (message, duration) => {
  return async (dispatch) => {
    dispatch({
      type: 'NOTIFICATION/SET_MESSAGE',
      data: { message }
    })
    setTimeout(() => dispatch({
      type: 'NOTIFICATION/CLEAR'
    }), duration * 1000)
  }
}

export default reducer
