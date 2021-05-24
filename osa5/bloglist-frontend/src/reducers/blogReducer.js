import blogService from '../services/blogs'
import { setNotification } from './notificationReducer'

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
    case 'BLOG/ADD_COMMENT': {
      const blog = state.find(b => b.id === action.data.id)
      const newComments = [...blog.comments, action.data.comment]
      const newBlog = { ...blog, comments: newComments }
      return state
        .map(b => b.id !== action.data.id ? b : newBlog)
    }
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

export const createBlog = (newBlog, blogFormRef) => {
  return async (dispatch) => {
    try {
      const savedBlog = await blogService.create(newBlog)
      dispatch({
        type: 'BLOG/CREATE',
        data: savedBlog
      })

      if (blogFormRef) {
        blogFormRef.current.setVisible(false)
      }

      dispatch(setNotification(
        'success',
        `a new blog ${savedBlog.title} by ${savedBlog.author} added`
      ))
    } catch (error) {
      dispatch(setNotification(
        'error',
        `creation failed: ${error.response.data.error}`
      ))
    }
  }
}

export const updateBlog = (id, newBlog) => {
  return async (dispatch) => {
    try {
      const savedBlog = await blogService.update(id, newBlog)
      dispatch({
        type: 'BLOG/UPDATE',
        data: savedBlog
      })

      dispatch(setNotification(
        'success',
        `liked blog ${newBlog.title} by ${newBlog.author}`
      ))
    } catch (error) {
      dispatch(setNotification(
        'error',
        `update failed: ${error.response.data.error}`
      ))
    }
  }
}

export const removeBlog = (id, blog) => {
  return async (dispatch) => {
    try {
      await blogService.remove(id)
      dispatch({
        type: 'BLOG/REMOVE',
        data: { id }
      })

      dispatch(setNotification(
        'success',
        `removed blog ${blog.title} by ${blog.author}`
      ))
    } catch (error) {
      dispatch(setNotification(
        'error',
        `removal failed: ${error.response.data.error}`
      ))
    }
  }
}

export const createComment = (id, newComment) => {
  return async (dispatch) => {
    try {
      const savedComment = await blogService.addComment(id, newComment)
      dispatch({
        type: 'BLOG/ADD_COMMENT',
        data: {
          id,
          comment: savedComment
        }
      })
    } catch (error) {
      dispatch(setNotification(
        'error',
        `adding a comment failed: ${error.response.data.error}`
      ))
    }
  }
}

export default blogReducer
