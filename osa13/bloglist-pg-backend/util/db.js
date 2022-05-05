const { Sequelize } = require('sequelize')

const { DATABASE_URL } = require('./config')

const sequelize = new Sequelize(DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    }
  },
  logging: false  // Disable logging
})

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connected to the database')
  } catch (error) {
    console.log('Unable to connect to the database')
    process.exit(1)
  }
}

module.exports = {
  sequelize,
  connectToDatabase
}
