import React, { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
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

const App = () => {
  const [ blogs, setBlogs ] = useState([])
  const [ user, setUser ] = useState(null)

  const dispatch = useDispatch()

  const blogFormRef = useRef()

  const compare = (a, b) => b.likes - a.likes

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort(compare))
    )
  }, [])

  useEffect(() => {
    const userJson = window.localStorage.getItem('bloglistUser')
    if (!userJson) return

    const user = JSON.parse(userJson)
    blogService.setToken(user.token)
    setUser(user)
  }, [])

  /*
  const showNotification = (type, message) => {
    //setNotification({ type, message })
    //setTimeout(() => setNotification({}), 5000)
    dispatch(setNotification(type, message))
  }
  */

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
      const savedBlog = await blogService.create(newBlog)

      setBlogs(blogs.concat(savedBlog).sort(compare))
      blogFormRef.current.setVisible(false)
      dispatch(setNotification(
        'success',
        `a new blog ${savedBlog.title} by ${savedBlog.author} added`
      ))
    } catch (exception) {
      dispatch(setNotification(
        'error',
        exception.response.data.error
      ))
    }
  }

  const updateBlog = async (id, newBlog) => {
    try {
      const returnedBlog = await blogService.update(id, newBlog)

      const updatedBlogs = blogs.map(b => b.id !== id ? b : returnedBlog)
      setBlogs(updatedBlogs.sort(compare))
      dispatch(setNotification(
        'success',
        `liked blog ${returnedBlog.title} by ${returnedBlog.author}`
      ))
    } catch (exception) {
      dispatch(setNotification(
        'error',
        `update failed: ${exception.response.data.error}`
      ))
    }
  }

  const removeBlog = async (id, blog) => {
    try {
      await blogService.remove(id)

      const filteredBlogs = blogs.filter(b => b.id !== id)
      setBlogs(filteredBlogs)
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
