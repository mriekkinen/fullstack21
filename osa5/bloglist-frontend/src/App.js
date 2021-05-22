import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './App.css'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import WhoAmI from './components/WhoAmI'
import { initBlogs } from './reducers/blogReducer'
import { initLogin } from './reducers/loginReducer'

const App = () => {
  const user = useSelector(state => state.user)
  const blogs = useSelector(state => state.blogs)

  const dispatch = useDispatch()

  useEffect(() => dispatch(initBlogs()), [])
  useEffect(() => dispatch(initLogin()), [])

  const blogFormRef = useRef()

  const mainContent = () => (
    <div className='main-content'>
      <h2>blogs</h2>
      <WhoAmI
        name={user.name} />
      <Togglable
        buttonLabel='create new blog'
        ref={blogFormRef}>
        <BlogForm
          blogFormRef={blogFormRef} />
      </Togglable>
      <div id='blogs'>
        {blogs.map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            isOwner={
              blog.user && blog.user.username === user.username
            } />
        )}
      </div>
    </div>
  )

  return (
    <div>
      <Notification />
      {user === null
        ? <LoginForm />
        : mainContent()
      }
    </div>
  )
}

export default App
