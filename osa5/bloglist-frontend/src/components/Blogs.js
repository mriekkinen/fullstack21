import React from 'react'
import { useSelector } from 'react-redux'
import Blog from './Blog'

const Blogs = () => {
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)

  return (
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
  )
}

export default Blogs
