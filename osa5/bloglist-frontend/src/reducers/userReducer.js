import userService from '../services/users'

const compare = (a, b) => b.blogs.length - a.blogs.length

const userReducer = (state = [], action) => {
  switch (action.type) {
    case 'USERS/INIT':
      return action.data.sort(compare)
    default:
      return state
  }
}

export const initUsers = () => {
  return async (dispatch) => {
    const users = await userService.getAll()
    dispatch({
      type: 'USERS/INIT',
      data: users
    })
  }
}

export default userReducer
