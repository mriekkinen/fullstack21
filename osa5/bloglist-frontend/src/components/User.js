import React from 'react'
import { useSelector } from 'react-redux'
import { useRouteMatch } from 'react-router-dom'

const selectUser = match => state => {
  return match
    ? state.users.find(u => u.id === match.params.id)
    : null
}

const User = () => {
  const match = useRouteMatch('/users/:id')
  const user = useSelector(selectUser(match))

  if (!user) {
    return null
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <p>added blogs</p>
      <ul>
        {user.blogs.map(blog =>
          <li key={blog.id}>{blog.title}</li>
        )}
      </ul>
    </div>
  )
}

User.propTypes = {}

export default User
