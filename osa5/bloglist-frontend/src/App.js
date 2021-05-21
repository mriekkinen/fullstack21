import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './App.css'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import WhoAmI from './components/WhoAmI'
import blogService from './services/blogs'
import loginService from './services/login'
import { setNotification } from './reducers/notificationReducer'
import {
  initBlogs,
  createBlog,
  updateBlog as update,
  removeBlog as remove
} from './reducers/blogReducer'

const App = () => {
  const [ user, setUser ] = useState(null)

  const blogs = useSelector(state => state.blogs)

  const dispatch = useDispatch()

  const blogFormRef = useRef()

  useEffect(() => dispatch(initBlogs()), [])

  useEffect(() => {
    const userJson = window.localStorage.getItem('bloglistUser')
    if (!userJson) return

    const user = JSON.parse(userJson)
    blogService.setToken(user.token)
    setUser(user)
  }, [])

  const login = async (credentials) => {
    try {
      const user = await loginService.login(credentials)

      window.localStorage.setItem('bloglistUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
    } catch (exception) {
      dispatch(setNotification('error', 'wrong username or password'))
    }
  }

  const logout = () => {
    window.localStorage.removeItem('bloglistUser')
    blogService.setToken(null)
    setUser(null)
  }

  const addBlog = async (newBlog) => {
    try {
      dispatch(createBlog(newBlog))
      blogFormRef.current.setVisible(false)
      dispatch(setNotification(
        'success',
        `a new blog ${newBlog.title} by ${newBlog.author} added`
      ))
    } catch (error) {
      dispatch(setNotification(
        'error',
        error.response.data.error
      ))
    }
  }

  const updateBlog = async (id, newBlog) => {
    try {
      dispatch(update(id, newBlog))
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

  const removeBlog = async (id, blog) => {
    try {
      dispatch(remove(id))
      dispatch(setNotification(
        'success',
        `removed blog ${blog.title} by ${blog.author}`
      ))
    } catch (exception) {
      dispatch(setNotification(
        'error',
        `removal failed: ${exception.response.data.error}`
      ))
    }
  }

  const mainContent = () => (
    <div className='main-content'>
      <h2>blogs</h2>
      <WhoAmI
        name={user.name}
        logout={logout} />
      <Togglable
        buttonLabel='create new blog'
        ref={blogFormRef}>
        <BlogForm
          createBlog={addBlog} />
      </Togglable>
      <div id='blogs'>
        {blogs.map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            update={updateBlog}
            remove={
              (blog.user && blog.user.username === user.username)
                ? removeBlog
                : null
            } />
        )}
      </div>
    </div>
  )

  return (
    <div>
      <Notification />
      {user === null
        ? <LoginForm login={login} />
        : mainContent()
      }
    </div>
  )
}

export default App
