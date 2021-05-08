import React, { useState, useEffect } from 'react'
import './App.css'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const Notification = ({ type, message }) => {
  if (!(type && message)) return null
  return (
    <div className={`notification ${type}`}>
      {message}
    </div>
  )
}

const App = () => {
  const [ blogs, setBlogs ] = useState([])
  const [ username, setUsername ] = useState('')
  const [ password,  setPassword] = useState('')
  const [ user, setUser ] = useState(null)
  const [ notification, setNotification ] = useState({})
  const [ title, setTitle ] = useState('')
  const [ author, setAuthor ] = useState('')
  const [ url, setUrl ] = useState('')

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

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem('bloglistUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      showNotification('error', 'wrong username or password')
    }
  }

  const handleLogout = (e) => {
    window.localStorage.removeItem('bloglistUser')
    blogService.setToken(null)
    setUser(null)
  }

  const handleCreate = async (e) => {
    e.preventDefault()

    try {
      const newBlog = {
        title, author, url
      }

      const savedBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(savedBlog))

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

  const loginForm = () => (
    <div className='login-form'>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>
            username
            <input
              type='text'
              name='username'
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoFocus
            />
          </label>
        </div>
        <div>
          <label>
            password
              <input
                type='password'
                name='password'
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
          </label>
        </div>
        <div>
          <button type='submit'>
            login
          </button>
        </div>
      </form>
    </div>
  )

  const noteForm = () => (
    <div className='note-form'>
      <h2>blogs</h2>
      <p className='whoami'>
        {user.name} logged in
        <button onClick={handleLogout}>
          logout
        </button>
      </p>
      {createForm()}
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )

  const createForm = () => (
    <div className='create-form'>
      <h2>create new</h2>
      <form onSubmit={handleCreate}>
        <div>
          <label>
            title:
            <input
              type='text'
              name='title'
              value={title}
              onChange={e => setTitle(e.target.value)}
            />            
          </label>
        </div>
        <div>
          <label>
            author:
            <input
              type='text'
              name='author'
              value={author}
              onChange={e => setAuthor(e.target.value)}
            />            
          </label>
        </div>
        <div>
          <label>
            url:
            <input
              type='text'
              name='url'
              value={url}
              onChange={e => setUrl(e.target.value)}
            />            
          </label>
        </div>
        <div>
          <button type='submit'>
            create
          </button>
        </div>
      </form>
    </div>
  )

  return (
    <div>
      <Notification
        type={notification.type}
        message={notification.message} />
      {user === null
        ? loginForm()
        : noteForm()
      }
    </div>
  )
}

export default App
