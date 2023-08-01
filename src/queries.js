import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name,
      born
    }
  }
`

export const ALL_BOOKS = gql`
  query getBooks($genres: [String!]){
    allBooks(genres: $genres) {
      title,
      author {
        name,
        born
      },
      published,
      genres
    }
  }
`

export const ALL_GENRES = gql`
  query {
    allGenres
  }
`

export const ME = gql`
  query{
    me {
      username
      favoriteGenre
      id
    }
  }
`

export const ADD_BOOKS = gql`
  mutation createBook(
    $title: String!
    $published: Int!
    $author: String!
    $genres: [String!]!
  ) {
    addBook(title: $title, published: $published, 
      author:$author, genres:$genres) {
      title,
      published,
      author {
        name,
        born
      },
      genres
    }
  }
`

export const EDIT_AUTHOR = gql`
  mutation changeAuthor(
    $name: String!
    $setBornTo: Int!
  ) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
        name,
        born
    }
  }
`

export const LOGIN = gql`
  mutation login(
    $username: String!
    $password: String!
  ) {
    login(username: $username, password: $password) {
      value
    }
  }
`