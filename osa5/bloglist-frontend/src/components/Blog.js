import React from 'react'
import { useHistory, useRouteMatch } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { updateBlog, removeBlog } from '../reducers/blogReducer'

const selectBlog = match => state => {
  return match
    ? state.blogs.find(b => b.id === match.params.id)
    : null
}

const Blog = () => {
  const match = useRouteMatch('/blogs/:id')
  const blog = useSelector(selectBlog(match))
  const user = useSelector(state => state.user)

  const dispatch = useDispatch()
  const history = useHistory()

  if (!(blog && user)) return null

  const isOwner = blog.user.username === user.username

  const like = () => {
    const newBlog = {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }

    dispatch(updateBlog(blog.id, newBlog))
  }

  const confirmRemove = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      dispatch(removeBlog(blog.id, blog))
      history.push('/')
    }
  }

  return (
    <div>
      <h2>
        {blog.title} {blog.author}
      </h2>
      <div>
        <a href={blog.url}>{blog.url}</a>
      </div>
      <div>
        {blog.likes} likes
        <button onClick={() => like()}>
          like
        </button>
      </div>
      <div>
        added by {blog.user.name}
      </div>
      {isOwner && (
        <div>
          <button
            className='remove-blog-btn'
            onClick={() => confirmRemove()}>
              remove
          </button>
        </div>
      )}
    </div>
  )
}

Blog.propTypes = {}

export default Blog
