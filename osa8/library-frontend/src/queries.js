import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
  query allAuthors {
    allAuthors {
      name
      born
      bookCount
      id
    }
  }
`

export const BOOK_DETAILS = gql`
  fragment bookDetails on Book {
    title
    author {
      name
      id
    }
    published
    genres
    id
  }
`

export const BOOK_DETAILS_WITH_AUTHOR = gql`
  fragment bookDetailsWithAuthor on Book {
    title
    author {
      name
      born
      bookCount
      id
    }
    published
    genres
    id
  }
`

export const ALL_BOOKS = gql`
  query allBooks($genre: String) {
    allBooks(genre: $genre) {
      ...bookDetails
    }
  }
  ${BOOK_DETAILS}
`

export const CREATE_BOOK = gql`
  mutation createBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
    addBook(title: $title, author: $author, published: $published, genres: $genres) {
      ...bookDetails
    }
  }
  ${BOOK_DETAILS}
`

export const BOOK_ADDED = gql`
  subscription bookAdded {
    bookAdded {
      ...bookDetailsWithAuthor
    }
  }
  ${BOOK_DETAILS_WITH_AUTHOR}
`

export const EDIT_AUTHOR = gql`
  mutation editAuthor($name: String!, $born: Int!) {
    editAuthor(name: $name, setBornTo: $born) {
      name
      born
      bookCount
      id
    }
  }
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`

export const ME = gql`
  query me {
    me {
      username
      favoriteGenre
      id
    }
  }
`
