import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createComment } from '../reducers/blogReducer'

const CommentForm = ({ blog }) => {
  const [content, setContent] = useState('')

  const dispatch = useDispatch()

  const handleChange = (e) => {
    setContent(e.target.value)
  }

  const addComment = (e) => {
    e.preventDefault()
    dispatch(createComment(blog.id, { content }))
    setContent('')
  }

  return (
    <div>
      <form onSubmit={addComment}>
        <input
          type='text'
          value={content}
          onChange={handleChange} />
        <button>add comment</button>
      </form>
    </div>
  )
}

export default CommentForm
