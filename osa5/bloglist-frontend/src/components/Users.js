import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const UserRow = ({ user }) => (
  <tr>
    <td><Link to={`/users/${user.id}`}>{user.name}</Link></td>
    <td>{user.blogs.length}</td>
  </tr>
)

const Users = () => {
  const users = useSelector(state => state.users)

  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user =>
            <UserRow
              key={user.id}
              user={user} />
          )}
        </tbody>
      </table>
    </div>
  )
}

UserRow.propTypes = {
  user: PropTypes.object.isRequired
}

export default Users
