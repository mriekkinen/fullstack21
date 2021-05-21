import blogService from '../services/blogs'

const compare = (a, b) => b.likes - a.likes

const blogReducer = (state = [], action) => {
  switch (action.type) {
    case 'BLOG/INIT':
      return action.data.sort(compare)
    case 'BLOG/CREATE':
      return [...state, action.data].sort(compare)
    case 'BLOG/UPDATE':
      return state
        .map(b => b.id !== action.data.id ? b : action.data)
        .sort(compare)
    case 'BLOG/REMOVE':
      return state.filter(b => b.id !== action.data.id)
    default:
      return state
  }
}

export const initBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch({
      type: 'BLOG/INIT',
      data: blogs
    })
  }
}

export const createBlog = (newBlog) => {
  return async (dispatch) => {
    const savedBlog = await blogService.create(newBlog)
    dispatch({
      type: 'BLOG/CREATE',
      data: savedBlog
    })
  }
}

export const updateBlog = (id, newBlog) => {
  return async (dispatch) => {
    const savedBlog = await blogService.update(id, newBlog)
    dispatch({
      type: 'BLOG/UPDATE',
      data: savedBlog
    })
  }
}

export const removeBlog = (id) => {
  return async (dispatch) => {
    await blogService.remove(id)
    dispatch({
      type: 'BLOG/REMOVE',
      data: { id }
    })
  }
}

export default blogReducer
