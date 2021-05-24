import React from 'react'
import { useHistory, useRouteMatch } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { updateBlog, removeBlog } from '../reducers/blogReducer'
import Comments from './Comments'
import styled from 'styled-components'
import { MdThumbUp } from 'react-icons/md'
import { Button } from './Button'

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
        <a
          target='_blank'
          rel='noopener noreferrer'
          href={blog.url}>
          {blog.url}
        </a>
      </div>
      <div>
        {blog.likes} likes
        <LikeButton handleClick={() => like()} />
      </div>
      <div>
        added by {blog.user.name}
      </div>
      {isOwner && (
        <div>
          <RemoveBlogButton
            onClick={() => confirmRemove()}>
              remove
          </RemoveBlogButton>
        </div>
      )}
      <Comments
        blog={blog} />
    </div>
  )
}

const LikeButtonContainer = styled.div`
  display: flex;
  align-items: center;
`

const LikeButton = ({ handleClick }) => (
  <Button onClick={handleClick}>
    <LikeButtonContainer>
      <ThumbUpIcon /> like
    </LikeButtonContainer>
  </Button>
)

const ThumbUpIcon = styled(MdThumbUp)`
  width: 1em;
  height: 1em;
  padding-right: 3px;
`

const RemoveBlogButton = styled(Button)`
  margin: 1px 0;
`

Blog.propTypes = {}

export default Blog
