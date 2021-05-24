const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const Comment = require('../models/comment')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })
    .populate('comments', { content: 1 })
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
  const updatedBlog = await Blog
    .findByIdAndUpdate(
      request.params.id,
      request.body,
      { new: true }
    )
    .populate('user', { username: 1, name: 1 })
    .populate('comments', { content: 1 })

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

  await Comment.deleteMany({ blog: blog._id })
  await blog.delete()

  response.status(204).end()
})

blogsRouter.post('/:id/comments', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  const comment = new Comment(request.body)

  if (!blog) {
    return response.status(404).end()
  }

  comment.blog = blog._id
  blog.comments.push(comment._id)
  await comment.save()
  await blog.save()

  response.status(201).json(comment)
})

module.exports = blogsRouter
