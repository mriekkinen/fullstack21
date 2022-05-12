const jwt = require('jsonwebtoken')

const { SECRET } = require('../util/config')
const { Session, User } = require('../models')

/**
 * Note: this function has been copied from the course material
 */
 const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch (error){
      console.log(error)
      return res.status(401).json({ error: 'Invalid token' })
    }
  } else {
    return res.status(401).json({ error: 'Token missing' })
  }

  next()
}

const sessionChecker = async (req, res, next) => {
  const session = await Session.findByPk(req.decodedToken.sessionId)
  if (!session) {
    return res.status(401).json({ error: 'Invalid session' })
  }

  const user = await User.findByPk(session.userId)
  if (user.disabled) {
    return res.status(403).json({ error: 'Disabled user account' })
  }

  req.user = user
  next()
}

module.exports = {
  tokenExtractor, sessionChecker
}
