import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { ADD_BOOKS, ALL_AUTHORS, ALL_BOOKS } from '../queries'

const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])
  const [createBook, { loading, error }] = useMutation(ADD_BOOKS,
    {
      onError: (err) => {
        console.log("CreateBook err", err)
        console.log("CreateBook err2", error)
      },
      refetchQueries: [{ query: ALL_AUTHORS }, { query: ALL_BOOKS }]
    }
  )

  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    console.log('add book...')
    // console.log(createBook)
    try {
      await createBook({ variables: { title, author, published: parseInt(published), genres } })
    }
    catch (error) {
      // Handle GraphQL errors here
      console.error('GraphQL Error:', error.message);
      console.error('GraphQL Error Details:', error.graphQLErrors);
      console.error('Network Error Details:', error.networkError);
    }

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook