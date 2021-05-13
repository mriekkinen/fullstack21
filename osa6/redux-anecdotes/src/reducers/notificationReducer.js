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

export const createNotification = (message) => {
  return {
    type: 'NOTIFICATION/SET_MESSAGE',
    data: { message }
  }
}

export const clearNotification = () => {
  return {
    type: 'NOTIFICATION/CLEAR'
  }
}

export default reducer
