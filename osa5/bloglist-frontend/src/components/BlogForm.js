import React, { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
  const [ title, setTitle ] = useState('')
  const [ author, setAuthor ] = useState('')
  const [ url, setUrl ] = useState('')

  const addBlog = (e) => {
    e.preventDefault()

    const newBlog = {
      title, author, url
    }

    createBlog(newBlog)
  }

  return (
    <div className='create-form'>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          <label>
            title:
            <input
              type='text'
              name='title'
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            author:
            <input
              type='text'
              name='author'
              value={author}
              onChange={e => setAuthor(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            url:
            <input
              type='text'
              name='url'
              value={url}
              onChange={e => setUrl(e.target.value)}
            />
          </label>
        </div>
        <div>
          <button type='submit'>
            create
          </button>
        </div>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm
