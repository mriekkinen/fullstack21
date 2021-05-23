import React from 'react'
import { Link } from 'react-router-dom'
import WhoAmI from './WhoAmI'

const NavBar = () => (
  <nav className='top-navbar'>
    <div><Link to='/'>blogs</Link></div>
    <div><Link to='/users'>users</Link></div>
    <div><WhoAmI /></div>
  </nav>
)

export default NavBar
