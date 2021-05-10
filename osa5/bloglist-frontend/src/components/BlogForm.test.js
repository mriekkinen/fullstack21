import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  let mockCreateBlog
  let component

  beforeEach(() => {
    mockCreateBlog = jest.fn()
    component = render(
      <BlogForm
        createBlog={mockCreateBlog} />
    )
  })

  test('submitting the form triggers a callback update', () => {
    fireEvent.change(
      component.getByLabelText('title:'),
      { target: { value: 'Example Blog' } }
    )

    fireEvent.change(
      component.getByLabelText('author:'),
      { target: { value: 'John Doe' } }
    )

    fireEvent.change(
      component.getByLabelText('url:'),
      { target: { value: 'https://blog.example.com' } }
    )

    fireEvent.submit(component.container.querySelector('form'))

    expect(mockCreateBlog.mock.calls).toHaveLength(1)
    expect(mockCreateBlog.mock.calls[0][0]).toEqual({
      title: 'Example Blog',
      author: 'John Doe',
      url: 'https://blog.example.com'
    })
  })
})
