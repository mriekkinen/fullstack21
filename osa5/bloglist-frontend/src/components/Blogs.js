import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const BlogEntry = ({ blog }) => (
  <div className='blog'>
    <Link to={`/blogs/${blog.id}`}>
      {blog.title} {blog.author}
    </Link>
  </div>
)

const Blogs = () => {
  const blogs = useSelector(state => state.blogs)

  return (
    <div id='blogs'>
      {blogs.map(blog =>
        <BlogEntry
          key={blog.id}
          blog={blog} />
      )}
    </div>
  )
}

export default Blogs
