const errorHandler = (error, req, res, next) => {
  console.error(error)

  if (error.name === 'SequelizeValidationError') {
    res.status(400).json({ error: `Invalid blog: ${error.message}` })
  }

  if (error.name === 'SequelizeDatabaseError') {
    res.status(400).json({ error: `Invalid likes: ${error.message}` })
  }

  next(error)
}

module.exports = errorHandler
