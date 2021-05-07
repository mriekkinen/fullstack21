const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const { usersInDb } = require('./test_helper')

const api = supertest(app)

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('get all users', async () => {
    const users = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usernames = users.body.map(u => u.username)

    expect(users.body).toHaveLength(1)
    expect(usernames).toContain('root')
  })

  describe('create user', () => {
    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await usersInDb()

      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen',
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await usersInDb()
      const usernames = usersAtEnd.map(u => u.username)

      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
      expect(usernames).toContain(newUser.username)
    })

    test('if no username provided, creation fails', async () => {
      const usersAtStart = await usersInDb()

      const newUser = {
        name: 'No username',
        password: 'secret',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await usersInDb()

      expect(result.body.error).toContain('`username` is required')
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('if username shorter than 3 chars, creation fails', async () => {
      const usersAtStart = await usersInDb()

      const newUser = {
        username: 'ab',
        name: 'Short username',
        password: 'secret',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await usersInDb()

      expect(result.body.error).toContain(
        '`username` (`ab`) is shorter than the minimum allowed length (3)'
      )
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('if username already taken, creation fails', async () => {
      const usersAtStart = await usersInDb()

      const newUser = {
        username: 'root',
        name: 'Superuser',
        password: 'salainen',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await usersInDb()

      expect(result.body.error).toContain('`username` to be unique')
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('if no password provided, creation fails', async () => {
      const usersAtStart = await usersInDb()

      const newUser = {
        username: 'mikko',
        name: 'No password'
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await usersInDb()

      expect(result.body.error).toContain('no password provided')
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('if password shorter than 3 chars, creation fails', async () => {
      const usersAtStart = await usersInDb()

      const newUser = {
        username: 'mikko',
        name: 'Short password',
        password: 'ab'
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await usersInDb()

      expect(result.body.error).toContain('password must be at least 3 characters long')
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
  })
})

afterAll(() => {
  mongoose.connection.close()
})
