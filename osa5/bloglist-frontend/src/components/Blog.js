import React, { useState } from 'react'

const Blog = ({ blog, update, remove }) => {
  const [ isExpanded, setExpanded ] = useState(false)

  const like = () => {
    const newBlog = {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }

    update(blog.id, newBlog)
  }

  const confirmRemove = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      remove(blog.id, blog)
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
            {remove && (
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

export default Blog
