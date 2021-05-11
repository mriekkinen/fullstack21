Cypress.Commands.add('createBlog', ({ title, author, url, likes }) => {
  cy.request({
    method: 'POST',
    url: '/api/blogs',
    body: { title, author, url, likes },
    headers: {
      'Authorization': `bearer ${JSON.parse(localStorage.getItem('bloglistUser')).token}`
    }
  })

  cy.visit('/')
})

Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', 'http://localhost:3003/api/login', { username, password })
    .then(response => {
      localStorage.setItem('bloglistUser', JSON.stringify(response.body))
      cy.visit('/')
    })
})

Cypress.Commands.add('logout', () => {
  localStorage.removeItem('bloglistUser')
  cy.visit('/')
})

Cypress.Commands.add('addUser', ({ name, username, password }) => {
  cy.request('POST', 'http://localhost:3003/api/users', {
    name, username, password
  })
  cy.visit('/')
})

Cypress.Commands.add('like', (blog) => {
  cy.request('PUT', 'http://localhost:3003/api/blogs', {
    ...blog,
    likes: blog.likes + 1
  })
  cy.visit('/')
})
