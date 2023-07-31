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
  query {
    allBooks {
      title,
      author,
      published
    }
  }
`

export const ADD_BOOKS = gql`
  mutation createBook(
    $title: String!
    $published: Int
    $author: String!
    $genres: [String!]!
  ) {
    addBook(title: $title, published: $published, 
      author:$author, genres:$genres) {
      title,
      author,
      published,
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