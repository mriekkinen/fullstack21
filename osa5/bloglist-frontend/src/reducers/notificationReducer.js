const notificationReducer = (state = {}, action) => {
  switch (action.type) {
    case 'NOTIFICATION/SET':
      return action.data
    case 'NOTIFICATION/CLEAR':
      return {}
    default:
      return state
  }
}

let timeoutId

export const setNotification = (type, message) => {
  return async (dispatch) => {
    dispatch({
      type: 'NOTIFICATION/SET',
      data: { type, message }
    })

    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() =>
      dispatch({
        type: 'NOTIFICATION/CLEAR'
      }), 5000)
  }
}

export default notificationReducer
