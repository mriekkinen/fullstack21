require('dotenv').config()
const { Sequelize, Model, DataTypes } = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    }
  },
  logging: false  // Disable logging
})

class Blog extends Model {}
Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author: DataTypes.TEXT,
  url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'blog'
})

const main = async () => {
  try {
    //await sequelize.authenticate()
    //console.log('Connected to the database.')

    const blogs = await Blog.findAll()

    blogs.forEach(b => {
      console.log(`${b.author}: '${b.title}', ${b.likes} likes`)
    })

    await sequelize.close()
  } catch (error) {
    console.log('Unable to connect to the database:', error)
  }
}

main()
