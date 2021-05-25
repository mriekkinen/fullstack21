import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const BlogDiv = styled.div`
  padding: 5px 5px;
  margin-bottom: 5px;
  border: 1px solid black;

  &:first-child {
    margin-top: 5px;
  }
`

const BlogEntry = ({ blog }) => (
  <BlogDiv className='blog'>
    <Link to={`/blogs/${blog.id}`}>
      {blog.title} {blog.author}
    </Link>
  </BlogDiv>
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
