const jwt = require('jsonwebtoken')

const { SECRET } = require('../util/config')

/**
 * Note: this function has been copied from the course material
 */
 const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      console.log(authorization.substring(7))
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

module.exports = {
  tokenExtractor
}
