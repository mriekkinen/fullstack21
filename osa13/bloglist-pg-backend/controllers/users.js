const router = require('express').Router()

const { Blog, User, ReadingList } = require('../models')

const userFinder = async (req, res, next) => {
  req.user = await User.findOne({
    where: {
      username: req.params.username
    }
  })
  next()
}

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] }
    }
  })
  res.json(users)
})

router.get('/:id', async (req, res) => {
  const readingListWhere = {}
  if (req.query.read) {
    readingListWhere.read = req.query.read === 'true'
  }

  const user = await User.findOne({
    where: {
      id: req.params.id
    },
    include: {
      model: Blog,
      as: 'readings',
      through: {
        attributes: []
      },
      include: {
        model: ReadingList,
        attributes: ['read', 'id'],
        where: readingListWhere
      }
    }
  })

  if (!user) {
    return res.status(404).end()
  }

  res.json(user)
})

router.post('/', async (req, res) => {
  const user = await User.create(req.body)
  res.json(user)
})

router.put('/:username', userFinder, async (req, res) => {
  if (req.user) {
    req.user.name = req.body.name
    await req.user.save()
    res.json(req.user)
  } else {
    res.status(404).end()
  }
})

module.exports = router
