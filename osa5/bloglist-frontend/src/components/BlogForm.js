import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { createBlog } from '../reducers/blogReducer'
import styled from 'styled-components'
import { Button } from './Button'

const BlogForm = ({ blogFormRef }) => {
  const [ title, setTitle ] = useState('')
  const [ author, setAuthor ] = useState('')
  const [ url, setUrl ] = useState('')

  const dispatch = useDispatch()

  const addBlog = (e) => {
    e.preventDefault()
    const newBlog = {
      title, author, url
    }

    dispatch(createBlog(newBlog, blogFormRef))
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <Grid>
          <Label htmlFor='title'>title:</Label>
          <input
            type='text'
            id='title'
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <Label htmlFor='author'>author:</Label>
          <input
            type='text'
            id='author'
            value={author}
            onChange={e => setAuthor(e.target.value)}
          />
          <Label htmlFor='url'>url:</Label>
          <input
            type='text'
            id='url'
            value={url}
            onChange={e => setUrl(e.target.value)}
          />
        </Grid>
        <SubmitButton type='submit'>
          create
        </SubmitButton>
      </form>
    </div>
  )
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 3px 8px;
  max-width: 300px;
`

const Label = styled.label`
  justify-self: end;
`

const SubmitButton = styled(Button)`
  margin: 3px 0;
`

BlogForm.propTypes = {
  blogFormRef: PropTypes.object.isRequired
}

export default BlogForm
