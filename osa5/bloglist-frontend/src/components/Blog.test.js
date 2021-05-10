import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />', () => {
  let blog
  let mockUpdate
  let component

  beforeEach(() => {
    blog = {
      id: 'example-blog',
      user: { id: 'johnd' },
      author: 'John Doe',
      title: 'Example Blog',
      url: 'https://blog.example.com',
      likes: 10
    }

    mockUpdate = jest.fn()

    component = render(
      <Blog
        blog={blog}
        update={mockUpdate} />
    )
  })

  test('at first, renders only title and author', () => {
    expect(component.container).toHaveTextContent(
      'Example Blog John Doe'
    )

    expect(component.container).not.toHaveTextContent('likes')
    expect(component.container).not.toHaveTextContent(blog.url)
  })

  test('after clicking "view", also displays likes and url', () => {
    fireEvent.click(component.getByText('view'))

    expect(component.container).toHaveTextContent('likes 10')
    expect(component.container).toHaveTextContent(blog.url)
  })

  test('clicking "like" twice triggers two updates', () => {
    fireEvent.click(component.getByText('view'))

    const likeButton = component.getByText('like')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)

    expect(mockUpdate.mock.calls).toHaveLength(2)
    expect(mockUpdate.mock.calls[0][0]).toBe('example-blog')
    expect(mockUpdate.mock.calls[0][1]).toHaveProperty('likes', 11)
  })
})
