import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  BrowserRouter as Router,
  Switch, Route
} from 'react-router-dom'
import './App.css'
import Blog from './components/Blog'
import Blogs from './components/Blogs'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import Users from './components/Users'
import User from './components/User'
import NavBar from './components/NavBar'
import { initLogin } from './reducers/loginReducer'
import { initBlogs } from './reducers/blogReducer'
import { initUsers } from './reducers/userReducer'
import styled from 'styled-components'

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
    <Router>
      <NavBar />
      <MainContent>
        <Notification />
        <h2>blog app</h2>
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
          <Route path='/blogs/:id'>
            <Blog />
          </Route>
        </Switch>
      </MainContent>
    </Router>
  )

  return (
    <div>
      {user === null
        ? <LoginForm />
        : mainContent()
      }
    </div>
  )
}

const MainContent = styled.div`
  max-width: 600px;
  margin: 8px 3vw;
`

export default App
