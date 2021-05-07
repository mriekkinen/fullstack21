const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const { initialBlogs, nonExistingId, blogsInDb } = require('./test_helper')

const api = supertest(app)

describe('when there is initially one user with a few blogs in the db', () => {
  let token;

  beforeEach(async () => {
    await User.deleteMany({})

    // Add user 'root'
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()

    // Create a valid token
    const userForToken = {
      username: user.username,
      id: user._id
    }

    token = jwt.sign(userForToken, process.env.SECRET)

    // Add a number of blogs for 'root'
    const blogs = initialBlogs.map(b => ({ ...b, user: user._id }))

    await Blog.deleteMany({})
    await Blog.insertMany(blogs)
  })

  describe('get all blogs', () => {
    test('blogs are returned as json', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('returns correct number of blogs', async () => {
      const response = await api.get('/api/blogs')

      expect(response.body).toHaveLength(initialBlogs.length)
    })

    test('specific blog is within returned blogs', async () => {
      const response = await api.get('/api/blogs')
      const titles = response.body.map(blog => blog.title)

      expect(titles).toContain('React patterns')
    })

    test('blogs contain id field', async () => {
      const response = await api.get('/api/blogs')
      const blog = response.body[0]

      expect(blog.id).toBeDefined()
      expect(blog._id).not.toBeDefined()
    })
  })

  describe('add new blog', () => {
    test('valid blog can be added', async () => {
      const newBlog = {
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2
      }

      await api
        .post('/api/blogs')
        .set('authorization', `bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await blogsInDb()
      const titles = blogsAtEnd.map(blog => blog.title)

      expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1)
      expect(titles).toContain('Type wars')
    })

    test('number of likes defaults to 0', async () => {
      const newBlog = {
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html'
      }

      await api
        .post('/api/blogs')
        .set('authorization', `bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await blogsInDb()
      const returnedBlog = blogsAtEnd.find(blog => blog.title === 'Type wars')

      expect(returnedBlog).toBeDefined()
      expect(returnedBlog.likes).toBe(0)
    })

    test('if token is missing, returns 401 unauthorized', async () => {
      const newBlog = {
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await blogsInDb()

      expect(blogsAtEnd).toHaveLength(initialBlogs.length)
    })

    test('if title is missing, returns 400 bad request', async () => {
      const newBlog = {
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2
      }

      await api
        .post('/api/blogs')
        .set('authorization', `bearer ${token}`)
        .send(newBlog)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await blogsInDb()

      expect(blogsAtEnd).toHaveLength(initialBlogs.length)
    })

    test('if URL is missing, returns 400 bad request', async () => {
      const newBlog = {
        title: 'Type wars',
        author: 'Robert C. Martin',
        likes: 2
      }

      await api
        .post('/api/blogs')
        .set('authorization', `bearer ${token}`)
        .send(newBlog)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await blogsInDb()

      expect(blogsAtEnd).toHaveLength(initialBlogs.length)
    })
  })

  describe('remove blog', () => {
    test('can remove with valid id', async () => {
      const blogsAtStart = await blogsInDb()
      const blogToDelete = blogsAtStart[0]
      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('authorization', `bearer ${token}`)
        .expect(204)

        const blogsAtEnd = await blogsInDb()
        const titles = blogsAtEnd.map(blog => blog.title)

        expect(blogsAtEnd).toHaveLength(initialBlogs.length - 1)
        expect(titles).not.toContain(blogToDelete.title)
    })

    test('if called with malformatted id, returns 400 bad request', async () => {
      await api
        .delete('/api/blogs/123')
        .set('authorization', `bearer ${token}`)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await blogsInDb()

      expect(blogsAtEnd).toHaveLength(initialBlogs.length)
    })
  })

  describe('update blog', () => {
    test('can update title of existing blog', async () => {
      const blogsAtStart = await blogsInDb()
      const blogToUpdate = blogsAtStart[0]
      const updatedBlog = {
        ...blogToUpdate,
        title: 'Updated Blog'
      }

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(200)

        const blogsAtEnd = await blogsInDb()

        expect(blogsAtEnd).toHaveLength(initialBlogs.length)
        expect(blogsAtEnd).toContainEqual(updatedBlog)
    })

    test('can update likes of existing blog', async () => {
      const blogsAtStart = await blogsInDb()
      const blogToUpdate = blogsAtStart[0]
      const updatedBlog = {
        ...blogToUpdate,
        likes: 100
      }

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(200)

        const blogsAtEnd = await blogsInDb()

        expect(blogsAtEnd).toHaveLength(initialBlogs.length)
        expect(blogsAtEnd).toContainEqual(updatedBlog)
    })

    test('if called with valid but non-existing id, returns 404 not found', async () => {
      const blogsAtStart = await blogsInDb()
      const nonExistingBlog = {
        id: await nonExistingId(),
        title: 'Blog which doesn\'t exist on the server (but has a valid id)',
        author: 'Jane Doe',
        url: 'https://janedoe.example.com',
        likes: 1
      }

      await api
        .put(`/api/blogs/${nonExistingBlog.id}`)
        .send(nonExistingBlog)
        .expect(404)

      const blogsAtEnd = await blogsInDb()
      const titles = blogsAtEnd.map(blog => blog.title)

      expect(blogsAtEnd).toHaveLength(initialBlogs.length)
      expect(titles).not.toContain(nonExistingBlog.title)
    })

    test('if called with malformatted id, returns 400 bad request', async () => {
      const nonExistingBlog = {
        id: '123',
        title: 'Blog which doesn\'t exist on the server (and has a malformatted id)',
        author: 'John Doe',
        url: 'https://johndoe.example.com',
        likes: 1
      }

      await api
        .put(`/api/blogs/${nonExistingBlog.id}`)
        .send(nonExistingBlog)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await blogsInDb()
      const titles = blogsAtEnd.map(blog => blog.title)

      expect(blogsAtEnd).toHaveLength(initialBlogs.length)
      expect(titles).not.toContain(nonExistingBlog.title)
    })
  })
})

afterAll(() => {
  mongoose.connection.close()
})
