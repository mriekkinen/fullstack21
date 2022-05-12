const router = require('express').Router()

const { tokenExtractor, sessionChecker } = require('./util')
const { User, Session } = require('../models')

router.delete('/', tokenExtractor, sessionChecker, async (req, res) => {
  await Session.destroy({
    where: {
      userId: req.user.id
    }
  })

  res.status(204).end()
})

module.exports = router
