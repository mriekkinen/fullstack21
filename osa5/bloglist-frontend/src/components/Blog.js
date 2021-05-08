import React, { useState } from 'react'

const Blog = ({ blog }) => {
  const [ isExpanded, setExpanded ] = useState(false)

  return (
    <>
      {!isExpanded
        ? <div className='blog'>
            {blog.title} {blog.author}
            <button
              onClick={() => setExpanded(true)}>
                view
            </button>
          </div>
        : <div className='blog'>
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
              <button>like</button>
            </div>
            <div>
              {blog.user.name}
            </div>
        </div>
      }
    </>
  )
}

export default Blog
