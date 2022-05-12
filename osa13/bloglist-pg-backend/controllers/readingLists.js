const router = require('express').Router()

const { tokenExtractor } = require('./util')
const { Blog, User, ReadingList } = require('../models')

router.post('/', async (req, res) => {
  // Note: the assignment lists these in snake_case
  const user = await User.findByPk(req.body.user_id)
  const blog = await Blog.findByPk(req.body.blog_id)
  if (!user || !blog) {
    return res.status(400).json({ error: 'unknown blog or user id'})
  }

  const entry = await ReadingList.create({
    userId: user.id,
    blogId: blog.id
  })

  res.json(entry)
})

router.put('/:id', tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  const blog = await Blog.findByPk(req.params.id)
  if (!user || !blog) {
    return res.status(400).json({ error: 'Unknown blog' })
  }

  const entry = await ReadingList.findOne({
    where: {
      userId: user.id,
      blogId: blog.id
    }
  })

  if (!entry) {
    return res.status(400).json({ error: 'This blog isn\'t on your reading list' })
  }

  if (typeof req.body.read !== 'boolean') {
    return res.status(400).json({ error: '"read" should be a boolean' })
  }

  entry.read = req.body.read
  await entry.save()

  res.json(entry)
})

module.exports = router
