import React, { useState, useEffect, useRef } from 'react'
import './App.css'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import WhoAmI from './components/WhoAmI'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [ blogs, setBlogs ] = useState([])
  const [ user, setUser ] = useState(null)
  const [ notification, setNotification ] = useState({})

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )  
  }, [])

  useEffect(() => {
    const userJson = window.localStorage.getItem('bloglistUser')
    if (!userJson) return

    const user = JSON.parse(userJson)
    blogService.setToken(user.token)
    setUser(user)
  }, [])

  const showNotification = (type, message) => {
    setNotification({ type, message })
    setTimeout(() => setNotification({}), 5000)
  }

  const login = async (credentials) => {
    try {
      const user = await loginService.login(credentials)

      window.localStorage.setItem('bloglistUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
    } catch (exception) {
      showNotification('error', 'wrong username or password')
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
      setBlogs(blogs.concat(savedBlog))

      blogFormRef.current.setVisible(false)
      showNotification(
        'success',
        `a new blog ${savedBlog.title} by ${savedBlog.author} added`
      )
    } catch (exception) {
      showNotification(
        'error',
        exception.response.data.error)
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
      <div>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
    </div>
  )

  return (
    <div>
      <Notification
        type={notification.type}
        message={notification.message} />
      {user === null
        ? <LoginForm login={login} />
        : mainContent()
      }
    </div>
  )
}

export default App
