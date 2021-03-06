describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.request('POST', 'http://localhost:3003/api/users', {
      name: 'John Doe',
      username: 'johnd',
      password: 'salainen'
    })

    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.get('html').should('contain', 'Log in to application')
  })

  describe('Login',function() {
    it('Succeeds with correct credentials', function() {
      cy.get('input#username').type('johnd')
      cy.get('input#password').type('salainen')
      cy.contains('log in').click()

      cy.get('#whoami').should('contain', 'John Doe')
    })

    it('Fails with wrong credentials', function() {
      cy.get('input#username').type('johnd')
      cy.get('input#password').type('wrong')
      cy.contains('log in').click()

      cy.get('#notification')
        .should('contain', 'wrong username or password')
        .and('have.css', 'background-color', 'rgb(229, 115, 115)')

      cy.get('#whoami')
        .should('not.exist')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.request('POST', 'http://localhost:3003/api/login', {
        username: 'johnd',
        password: 'salainen'
      }).then(function(response) {
        localStorage.setItem('bloglistUser', JSON.stringify(response.body))
        cy.visit('http://localhost:3000')
      })
    })

    it('A blog can be created', function() {
      cy.contains('create new blog').click()
      cy.get('input#title').type('Example Blog')
      cy.get('input#author').type('John Doe')
      cy.get('input#url').type('https://blog.example.com')
      cy.get('button[type=submit]').click()

      cy.get('#blogs').should('contain', 'Example Blog John Doe')
    })

    it('A blog can be viewed', function() {
      cy.createBlog({
        title: 'Example Blog',
        author: 'John Doe',
        url: 'https://blog.example.com',
        likes: 10
      })

      cy.contains('Example Blog John Doe').click()

      cy.get('#blog').should('contain', 'Example Blog John Doe')
    })

    it('A blog can be liked', function() {
      cy.createBlog({
        title: 'Example Blog',
        author: 'John Doe',
        url: 'https://blog.example.com',
        likes: 10
      })

      cy.contains('Example Blog John Doe').click()

      cy.get('#blog').should('contain', '10 likes')
      cy.get('#blog').contains('like').click()
      cy.get('#blog').should('contain', '11 likes')
    })

    it('A blog can be removed', function() {
      cy.createBlog({
        title: 'Example Blog',
        author: 'John Doe',
        url: 'https://blog.example.com',
        likes: 10
      })

      cy.contains('Example Blog John Doe').click()

      cy.get('#blog').contains('remove').click()

      cy.get('html').should('not.contain', 'Example Blog John Doe')
    })

    it('A blog cannot be removed by someone else', function() {
      cy.createBlog({
        title: 'Example Blog',
        author: 'John Doe',
        url: 'https://blog.example.com',
        likes: 10
      })

      cy.logout()
      cy.addUser({
        name: 'Jane Doe',
        username: 'janed',
        password: 'salainen'
      })
      cy.login({
        username: 'janed',
        password: 'salainen'
      })

      cy.contains('Example Blog John Doe').click()
      cy.get('#blog').should('not.contain', 'remove')
    })

    it('Blogs are ranked by the number of likes', function() {
      cy.createBlog({
        title: 'Example Blog #3',
        author: 'Jack Doe',
        url: 'https://blog3.example.com',
        likes: 10
      })
      cy.createBlog({
        title: 'Example Blog #1',
        author: 'Jane Doe',
        url: 'https://blog1.example.com',
        likes: 100
      })
      cy.createBlog({
        title: 'Example Blog #2',
        author: 'John Doe',
        url: 'https://blog2.example.com',
        likes: 50
      })

      cy.get('#blogs').children('.blog').as('blogs')

      cy.get('@blogs').should('have.length', 3)
      cy.get('@blogs').eq(0).should('contain', 'Example Blog #1')
      cy.get('@blogs').eq(1).should('contain', 'Example Blog #2')
      cy.get('@blogs').eq(2).should('contain', 'Example Blog #3')
    })
  })
})
