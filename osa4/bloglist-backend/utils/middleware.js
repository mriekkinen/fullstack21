const morgan = require('morgan')
const logger = require('./logger')

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

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
}
