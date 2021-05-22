import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { updateBlog, removeBlog } from '../reducers/blogReducer'

const Blog = ({ blog, isOwner }) => {
  const [ isExpanded, setExpanded ] = useState(false)

  const dispatch = useDispatch()

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
    }
  }

  return (
    <div className='blog'>
      {!isExpanded
        ? <>
            {blog.title} {blog.author}
            <button
              onClick={() => setExpanded(true)}>
                view
            </button>
          </>
        : <>
            <div>
              {blog.title} {blog.author}
              <button
                onClick={() => setExpanded(false)}>
                  hide
              </button>
            </div>
            <div>
              {blog.url}
            </div>
            <div>
              likes {blog.likes}
              <button onClick={() => like()}>
                like
              </button>
            </div>
            <div>
              {blog.user.name}
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
          </>
      }
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  isOwner: PropTypes.bool
}

export default Blog
