const morgan = require('morgan')
const logger = require('./logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

/*
const requestLogger = (req, res, next) => {
  logger.info('Method:', req.method)
  logger.info('Path:  ', req.path)
  logger.info('Body:  ', req.body)
  logger.info('---')
  next()
}
*/

let requestLogger = (req, res, next) => next()

if (process.env.NODE_ENV !== 'test') {
  morgan.token('body', req => JSON.stringify(req.body))

  requestLogger = morgan(
    ':method :url :status :response-time ms - :res[content-length] :body'
  )
}

const getTokenFrom = (req) => {
  const auth = req.get('authorization')
  if (!(auth && auth.toLowerCase().startsWith('bearer '))) {
    return null
  }

  return auth.substring(7)
}

const tokenExtractor = (req, res, next) => {
  req.token = getTokenFrom(req)

  next()
}

const userExtractor = async (req, res, next) => {
  const token = getTokenFrom(req)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (req.token && decodedToken.id) {
    req.user = await User.findById(decodedToken.id)
  }

  next()
}

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).json({
      error: 'malformatted id'
    })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({
      error: error.message
    })
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'invalid token'
    })
  }

  next(error)
}

module.exports = {
  requestLogger,
  tokenExtractor,
  userExtractor,
  unknownEndpoint,
  errorHandler
}
