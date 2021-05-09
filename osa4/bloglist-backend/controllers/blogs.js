const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { populate } = require('../models/user')
const User = require('../models/user')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const user = request.user

  if (!user) {
    return response.status(401).json({
      error: 'token missing or invalid'
    })
  }

  const blog = new Blog(request.body)

  blog.user = user._id
  user.blogs.push(blog._id)
  await blog.save()
  await user.save()

  // Populate the blog's user field
  const populatedBlog = await Blog.populate(blog, {
    path: 'user',
    select: { username: 1, name: 1 }
  })

  response.status(201).json(populatedBlog)
})

blogsRouter.put('/:id', async (request, response) => {
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    request.body,
    { new: true }
  )
  .populate('user', { username: 1, name: 1 })

  if (updatedBlog) {
    response.json(updatedBlog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user

  if (!user) {
    return response.status(401).json({
      error: 'token missing or invalid'
    })
  }

  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).end()
  }

  if (blog.user.toString() !== user._id.toString()) {
    return response.status(403).json({
      error: 'this blog doesn\'t belong to you'
    })
  }

  await blog.delete()
  response.status(204).end()
})

module.exports = blogsRouter
