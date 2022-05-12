/**
 * Login router
 * 
 * NOTE: MOST OF THIS FILE HAS BEEN COPY-PASTED FROM THE COURSE MATERIAL!
 */
const jwt = require('jsonwebtoken')
const router = require('express').Router()

const { SECRET } = require('../util/config')
const { User, Session } = require('../models')

router.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findOne({
    where: {
      username: body.username
    }
  })

  const passwordCorrect = body.password === 'salainen'

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  if (user.disabled) {
    return response.status(403).json({
      error: 'Disabled user account'
    })
  }

  const session = await Session.create({ userId: user.id })

  const sessionForToken = {
    sessionId: session.id
  }

  const token = jwt.sign(sessionForToken, SECRET)

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = router
