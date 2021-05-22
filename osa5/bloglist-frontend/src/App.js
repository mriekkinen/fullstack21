import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  BrowserRouter as Router,
  Switch, Route
} from 'react-router-dom'
import './App.css'
import Blogs from './components/Blogs'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import WhoAmI from './components/WhoAmI'
import Users from './components/Users'
import User from './components/User'
import { initLogin } from './reducers/loginReducer'
import { initBlogs } from './reducers/blogReducer'
import { initUsers } from './reducers/userReducer'

const App = () => {
  const user = useSelector(state => state.user)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initLogin())
    dispatch(initBlogs())
    dispatch(initUsers())
  }, [])

  const blogFormRef = useRef()

  const frontPage = () => (
    <div>
      <Togglable
        buttonLabel='create new blog'
        ref={blogFormRef}>
        <BlogForm
          blogFormRef={blogFormRef} />
      </Togglable>
      <Blogs />
    </div>
  )

  const mainContent = () => (
    <div className='main-content'>
      <h2>blogs</h2>
      <WhoAmI
        name={user.name} />

      <Router>
        <Switch>
          <Route exact path='/'>
            {frontPage()}
          </Route>
          <Route exact path='/users'>
            <Users />
          </Route>
          <Route path='/users/:id'>
            <User />
          </Route>
        </Switch>
      </Router>
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
