import loginService from '../services/login'
import blogService from '../services/blogs'
import { setNotification } from './notificationReducer'

const loginReducer = (state = null, action) => {
  switch (action.type) {
    case 'USER/INIT':
      return action.data
    case 'USER/LOGIN':
      return action.data
    case 'USER/LOGOUT':
      return null
    default:
      return state
  }
}

export const initLogin = () => {
  const userJson = window.localStorage.getItem('bloglistUser')
  if (!userJson) {
    blogService.setToken(null)
    return {
      type: 'USER/INIT',
      data: null
    }
  }

  const user = JSON.parse(userJson)
  blogService.setToken(user.token)
  return {
    type: 'USER/INIT',
    data: user
  }
}

export const login = (credentials) => {
  return async (dispatch) => {
    try {
      const user = await loginService.login(credentials)
      window.localStorage.setItem('bloglistUser', JSON.stringify(user))
      blogService.setToken(user.token)
      dispatch({
        type: 'USER/LOGIN',
        data: user
      })
    } catch (error) {
      dispatch(setNotification('error', 'wrong username or password'))
    }
  }
}

export const logout = () => {
  window.localStorage.removeItem('bloglistUser')
  blogService.setToken(null)
  return {
    type: 'USER/LOGOUT'
  }
}

export default loginReducer
