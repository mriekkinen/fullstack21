import React from 'react'
import CommentForm from './CommentForm'

const Comments = ({ blog }) => (
  <div>
    <h3>comments</h3>
    <CommentForm
      blog={blog} />
    <ul>
      {blog.comments.map(comment =>
        <li key={comment.id}>
          {comment.content}
        </li>
      )}
    </ul>
  </div>
)

export default Comments
